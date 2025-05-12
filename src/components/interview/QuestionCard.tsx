
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="mb-8 shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-xl">Question {questionNumber}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {interviewType} Interview for {jobRole.replace(/_/g, " ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{question}</p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
