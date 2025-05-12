
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <Textarea
        value={answer}
        onChange={onAnswerChange}
        placeholder="Type your answer here..."
        className="min-h-[200px] p-4 text-base resize-y"
      />

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onToggleTimer}
        >
          {isTimerActive ? "Pause Timer" : "Resume Timer"}
        </Button>

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
