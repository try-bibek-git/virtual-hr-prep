
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ScoreCardProps {
  score: number;
  feedback?: string;
}

const ScoreCard = ({ score, feedback }: ScoreCardProps) => {
  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Generate default feedback if not provided
  const defaultFeedback = 
    score >= 90 ? "Excellent! You're well-prepared for your interviews." :
    score >= 75 ? "Great job! With a few improvements, you'll be interview-ready." :
    score >= 60 ? "Good effort! More practice will help you improve significantly." :
    "Keep practicing! You're on your way to interview success.";

  return (
    <Card className="mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="text-center pb-2">
        <CardTitle>Overall Performance</CardTitle>
        <CardDescription>Based on your interview responses</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className={`text-6xl md:text-7xl font-bold mb-4 ${getScoreColor(score)}`}>
          {score}%
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 ${star <= Math.round(score/20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {feedback || defaultFeedback}
        </p>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
