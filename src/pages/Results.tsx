import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, Star, ChevronUp, ChevronDown, CheckCircle, XCircle, BarChart3, ArrowRight } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const { profile, questions, answers } = location.state || {
    profile: { name: "User", jobRole: "software_engineer", experienceLevel: "mid_level" },
    questions: [],
    answers: [],
  };

  // Sample scores and feedback (in a real app, these would be calculated by AI)
  const score = 85;
  const strengths = [
    "Clear and concise communication style",
    "Strong examples of past achievements",
    "Good understanding of technical concepts",
    "Structured approach to problem-solving",
  ];
  const weaknesses = [
    "Could provide more quantifiable results",
    "Some responses lack specific details",
    "Occasional use of filler words",
  ];
  const suggestions = [
    "Use the STAR method (Situation, Task, Action, Result) more consistently for behavioral questions",
    "Include more metrics and specific outcomes when describing past experiences",
    "Practice speaking more confidently about technical concepts",
    "Consider adding brief examples of how you've overcome similar challenges",
  ];

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Interview Results</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Great job {profile.name}! Here's how you performed.
            </p>
          </div>

          {/* Score Card */}
          <Card className="mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-2">
              <CardTitle>Overall Performance</CardTitle>
              <CardDescription>Based on your responses to {questions.length} questions</CardDescription>
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
                {score >= 90 ? "Excellent! You're well-prepared for your interviews." :
                 score >= 75 ? "Great job! With a few improvements, you'll be interview-ready." :
                 score >= 60 ? "Good effort! More practice will help you improve significantly." :
                 "Keep practicing! You're on your way to interview success."}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <Card className="shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle>Strengths</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronUp className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <CardTitle>Areas for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronDown className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Suggestions */}
          <Card className="mb-8 shadow-md border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <CardTitle>Detailed Suggestions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium shrink-0">
                      {index + 1}
                    </div>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2">
              <Download className="h-5 w-5" /> Download Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-5 w-5" /> Print Results
            </Button>
            <Button variant="secondary" asChild className="flex items-center gap-2">
              <Link to="/setup">
                Try Another Interview <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
