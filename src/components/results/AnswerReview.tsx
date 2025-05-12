
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnswerReviewProps {
  questions: string[];
  answers: string[];
}

const AnswerReview = ({ questions, answers }: AnswerReviewProps) => {
  return (
    <Card className="mb-8 shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle>Your Interview Responses</CardTitle>
        <CardDescription>
          Review your answers to the interview questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
              <h3 className="text-lg font-medium mb-2">Question {index + 1}:</h3>
              <p className="mb-3 text-gray-800 dark:text-gray-200">{question}</p>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Answer:</h4>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                {answers[index] || <em className="text-gray-400">No answer provided</em>}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerReview;
