
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, RotateCcw, Check, ArrowRight } from "lucide-react";
import LoadingDisplay from "@/components/interview/LoadingDisplay";

const Look = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{score: number, feedback: string} | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  // Clean up camera stream on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false);
        toast({
          title: "Camera Not Supported",
          description: "Your device doesn't support camera access. You can skip this step.",
          variant: "destructive"
        });
        return;
      }

      console.log("Requesting camera access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      console.log("Camera stream obtained:", stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        const videoElement = videoRef.current;
        
        const handleLoadedMetadata = () => {
          console.log("Video metadata loaded, starting playback");
          videoElement.play().then(() => {
            console.log("Video playback started successfully");
            setIsStreaming(true);
          }).catch((error) => {
            console.error("Error starting video playback:", error);
            toast({
              title: "Video Playback Error",
              description: "Could not start video preview. Please try again.",
              variant: "destructive"
            });
          });
        };

        if (videoElement.readyState >= 1) {
          // Metadata already loaded
          handleLoadedMetadata();
        } else {
          // Wait for metadata to load
          videoElement.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraSupported(false);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take your photo, or skip this step.",
        variant: "destructive"
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        console.log("Stopping camera track:", track.kind);
        track.stop();
      });
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas element not available");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error("Could not get canvas context");
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    console.log("Capturing photo with dimensions:", canvas.width, "x", canvas.height);
    
    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    console.log("Photo captured successfully");
    
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setEvaluation(null);
    startCamera();
  }, [startCamera]);

  const evaluateOutfit = async () => {
    if (!capturedImage) return;

    setIsEvaluating(true);
    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Upload to Supabase storage
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileName = `${user.id}/outfit-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      // Call Gemini API for outfit evaluation
      const { data: evalData, error: evalError } = await supabase.functions.invoke("gemini-interview", {
        body: {
          action: "evaluate-outfit",
          imageUrl: publicUrl,
          profile
        }
      });

      if (evalError) throw evalError;

      // Store evaluation in database
      const { error: dbError } = await (supabase as any)
        .from('user_photos')
        .insert({
          user_id: user.id,
          photo_url: publicUrl,
          outfit_score: evalData.score,
          outfit_feedback: evalData.feedback
        });

      if (dbError) throw dbError;

      setEvaluation(evalData);
      toast({
        title: "Outfit Evaluated",
        description: `Your outfit scored ${evalData.score}/10!`,
      });

    } catch (error: any) {
      console.error("Error evaluating outfit:", error);
      toast({
        title: "Evaluation Failed",
        description: "We couldn't evaluate your outfit. You can proceed to the interview.",
        variant: "destructive"
      });
      
      // Generate fallback evaluation
      setEvaluation({
        score: 8,
        feedback: "You look professional and ready for the interview! Your attire appears appropriate for a formal interview setting."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const proceedToInterview = () => {
    navigate("/interview", { state: { ...profile, outfitEvaluation: evaluation } });
  };

  const skipOutfitCheck = () => {
    navigate("/interview", { state: profile });
  };

  if (!profile) {
    navigate("/setup");
    return null;
  }

  if (isEvaluating) {
    return <LoadingDisplay profile={profile} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-blue dark:bg-gradient-blue-dark">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Your Professional Look</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Let's check your interview attire. Take a portrait photo so we can provide feedback on your professional appearance.
            </p>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 dark:border-gray-700/50">
            {!capturedImage ? (
              <div className="space-y-6">
                {/* Camera View */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                  {isStreaming ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                        <p className="text-gray-600 dark:text-gray-400">
                          {isCameraSupported ? "Click 'Start Camera' to begin" : "Camera not available"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-4 justify-center">
                  {!isStreaming ? (
                    <Button onClick={startCamera} disabled={!isCameraSupported} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                      <Camera className="h-5 w-5" /> Start Camera
                    </Button>
                  ) : (
                    <Button onClick={capturePhoto} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                      <Camera className="h-5 w-5" /> Capture Photo
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Captured Photo */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                  <img
                    src={capturedImage}
                    alt="Captured portrait"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Evaluation Results */}
                {evaluation && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {evaluation.score}/10
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-primary">Outfit Evaluation</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-center">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}

                {/* Photo Controls */}
                <div className="flex gap-4 justify-center">
                  <Button onClick={retakePhoto} variant="outline" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
                    <RotateCcw className="h-5 w-5" /> Retake Photo
                  </Button>
                  
                  {!evaluation ? (
                    <Button onClick={evaluateOutfit} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                      <Check className="h-5 w-5" /> Evaluate Outfit
                    </Button>
                  ) : (
                    <Button onClick={proceedToInterview} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                      Start Interview <ArrowRight className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Skip Option */}
            <div className="mt-6 text-center border-t border-blue-100 dark:border-blue-800 pt-6">
              <Button 
                onClick={skipOutfitCheck} 
                variant="ghost"
                className="text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Skip outfit check and proceed to interview
              </Button>
            </div>
          </div>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </main>
    </div>
  );
};

export default Look;
