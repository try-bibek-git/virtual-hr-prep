
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mic, MicOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AnswerSectionProps {
  answer: string;
  onAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNextQuestion: () => void;
  onToggleTimer: () => void;
  isTimerActive: boolean;
  isLastQuestion: boolean;
}

const AnswerSection = ({
  answer,
  onAnswerChange,
  onNextQuestion,
  onToggleTimer,
  isTimerActive,
  isLastQuestion,
}: AnswerSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startSpeechRecognition = () => {
    // Check if the browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      // Set up event handlers
      recognitionInstance.onstart = () => {
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Start speaking to dictate your answer.",
        });
      };
      
      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          // Create a synthetic event to update the answer
          const syntheticEvent = {
            target: { value: answer + finalTranscript + ' ' },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          
          onAnswerChange(syntheticEvent);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        toast({
          title: "Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
        stopSpeechRecognition();
      };
      
      recognitionInstance.onend = () => {
        // The recognition service has disconnected
        setIsRecording(false);
      };
      
      // Start recognition
      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
      toast({
        title: "Recording Stopped",
        description: "Speech recognition has been turned off.",
      });
    } else {
      startSpeechRecognition();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={answer}
        onChange={onAnswerChange}
        placeholder="Type your answer here..."
        className="min-h-[200px] p-4 text-base resize-y"
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onToggleTimer}
          >
            {isTimerActive ? "Pause Timer" : "Resume Timer"}
          </Button>
          
          <Button
            variant="outline"
            onClick={toggleRecording}
            className={isRecording ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200" : ""}
            title={isRecording ? "Stop dictation" : "Start dictation"}
          >
            {isRecording ? (
              <>
                <MicOff className="h-5 w-5 mr-2" /> Stop Dictating
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" /> Dictate Answer
              </>
            )}
          </Button>
        </div>

        <Button 
          onClick={onNextQuestion} 
          className="px-8"
        >
          {!isLastQuestion ? (
            <>Next Question <ArrowRight className="ml-2 h-5 w-5" /></>
          ) : (
            "Finish Interview"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AnswerSection;
