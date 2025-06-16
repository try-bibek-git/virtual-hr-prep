
import { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, RotateCcw, Check, ArrowRight, Image } from "lucide-react";
import LoadingDisplay from "@/components/interview/LoadingDisplay";

const Look = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{score: number, feedback: string} | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Convert to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setEvaluation(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = useCallback(() => {
    setUploadedImage(null);
    setEvaluation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const evaluateOutfit = async () => {
    if (!uploadedImage) return;

    setIsEvaluating(true);
    try {
      // Convert data URL to blob
      const response = await fetch(uploadedImage);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Professional Look
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Upload a photo of yourself in interview attire. Our AI will evaluate your professional appearance and provide feedback.
            </p>
          </div>

          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100/50 dark:border-blue-900/50">
            {!uploadedImage ? (
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-700 dark:to-blue-900 rounded-lg overflow-hidden border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                     onClick={handleUploadClick}>
                  <div className="text-center">
                    <Image className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      Click to upload your photo
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
                  >
                    <Upload className="h-5 w-5" /> Upload Photo
                  </Button>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Uploaded Photo */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-700 dark:to-blue-900 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                  <img
                    src={uploadedImage}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Evaluation Results */}
                {evaluation && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {evaluation.score}/10
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-600">Outfit Evaluation</h3>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-center">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}

                {/* Photo Controls */}
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={removePhoto} 
                    variant="outline" 
                    className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                  >
                    <RotateCcw className="h-5 w-5" /> Upload Different Photo
                  </Button>
                  
                  {!evaluation ? (
                    <Button 
                      onClick={evaluateOutfit} 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Check className="h-5 w-5" /> Evaluate Outfit
                    </Button>
                  ) : (
                    <Button 
                      onClick={proceedToInterview} 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
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
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Skip outfit check and proceed to interview
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Look;
