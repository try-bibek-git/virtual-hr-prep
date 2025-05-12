
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface InterviewHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  formattedTime: string;
}

const InterviewHeader = ({ 
  currentQuestion, 
  totalQuestions, 
  formattedTime 
}: InterviewHeaderProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Your Interview Session</h1>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="h-5 w-5" />
          <span className="font-mono">{formattedTime}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default InterviewHeader;
