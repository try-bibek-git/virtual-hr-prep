
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  interviewType: string;
  jobRole: string;
}

const QuestionCard = ({ 
  questionNumber, 
  question, 
  interviewType, 
  jobRole 
}: QuestionCardProps) => {
  const [isReading, setIsReading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const readQuestion = () => {
    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
      setAudioElement(null);
    }

    setIsReading(true);

    // Use SpeechSynthesis API for text-to-speech
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(question);
      speech.lang = 'en-US';
      speech.rate = 0.9; // Slightly slower rate for better comprehension
      
      // Handle completion
      speech.onend = () => {
        setIsReading(false);
      };
      
      // Handle errors
      speech.onerror = () => {
        toast({
          title: "Error",
          description: "There was an issue with the text-to-speech service.",
          variant: "destructive"
        });
        setIsReading(false);
      };
      
      window.speechSynthesis.speak(speech);
      
      // Create a reference to cancel if needed
      const audio = new Audio();
      setAudioElement(audio);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "default"
      });
      setIsReading(false);
    }
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
  };
  
  return (
    <Card className="mb-8 shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 animate-fadeIn">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">Question {questionNumber}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {interviewType} Interview for {jobRole.replace(/_/g, " ")}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={isReading ? stopReading : readQuestion}
          title={isReading ? "Stop reading" : "Read aloud"}
          className="text-gray-500 hover:text-primary transition-colors"
        >
          {isReading ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{question}</p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
