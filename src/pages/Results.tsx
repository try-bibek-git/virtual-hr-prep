
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, Printer, Star, ChevronUp, ChevronDown, CheckCircle, 
  XCircle, BarChart3, ArrowRight, Loader2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

interface EvaluationResults {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  feedback: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, questions, answers } = location.state || {
    profile: { name: "User", jobRole: "software_engineer", experienceLevel: "mid_level" },
    questions: [],
    answers: [],
  };

  const [evaluation, setEvaluation] = useState<EvaluationResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get evaluation from Gemini API
  useEffect(() => {
    const getEvaluation = async () => {
      setIsLoading(true);
      setError(null);
      
      // Check if we have questions and answers
      if (!questions.length || !answers.length) {
        setError("No interview data found. Please complete an interview first.");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("gemini-interview", {
          body: {
            action: "evaluate-answers",
            profile,
            questions,
            answers
          }
        });

        if (error) {
          throw new Error(error.message || "Failed to evaluate interview");
        }

        // Validate the evaluation data
        if (!data || typeof data.score !== 'number' || !Array.isArray(data.strengths) || 
            !Array.isArray(data.weaknesses) || !Array.isArray(data.suggestions)) {
          throw new Error("Invalid evaluation results");
        }

        setEvaluation(data as EvaluationResults);
      } catch (err: any) {
        console.error("Error evaluating interview:", err);
        setError(err.message || "Failed to evaluate your interview");
        
        // Generate fallback evaluation
        setEvaluation(generateFallbackEvaluation());
        
        toast({
          title: "Evaluation Error",
          description: "Using our backup evaluation system instead.",
          variant: "warning"
        });
      } finally {
        setIsLoading(false);
      }
    };

    getEvaluation();
  }, [profile, questions, answers]);

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Generate a fallback evaluation if the API fails
  const generateFallbackEvaluation = (): EvaluationResults => {
    const hasContent = answers.filter(a => a.trim().length > 10).length;
    const totalQuestions = questions.length;
    const completionRate = hasContent / totalQuestions;
    
    const fallbackScore = Math.round(65 + (completionRate * 20));
    
    return {
      score: fallbackScore,
      strengths: [
        "Clear and concise communication style",
        "Strong examples of past achievements",
        "Good understanding of technical concepts",
        "Structured approach to problem-solving",
      ],
      weaknesses: [
        "Could provide more quantifiable results",
        "Some responses lack specific details",
        "Occasional use of filler words",
      ],
      suggestions: [
        "Use the STAR method (Situation, Task, Action, Result) more consistently for behavioral questions",
        "Include more metrics and specific outcomes when describing past experiences",
        "Practice speaking more confidently about technical concepts",
        "Consider adding brief examples of how you've overcome similar challenges",
      ],
      feedback: "Overall, a solid interview performance with room for improvement. Focus on providing more specific examples and quantifiable results in your answers."
    };
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Analyzing Your Responses</h2>
          <p className="text-muted-foreground">
            Our AI is evaluating your interview performance...
          </p>
        </div>
      </div>
    );
  }

  // Show error if no interview data or evaluation failed
  if ((error && !evaluation) || !questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Results</AlertTitle>
            <AlertDescription>
              {error || "No interview data found. Please complete an interview first."}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/setup")}>
            Start a New Interview
          </Button>
        </div>
      </div>
    );
  }

  // If no evaluation results, show error
  if (!evaluation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Error Loading Results</AlertTitle>
          <AlertDescription>
            We couldn't process your interview results. Please try again.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate("/setup")}>
            Start a New Interview
          </Button>
        </div>
      </div>
    );
  }

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

          {/* Error notification if using fallback but still showing results */}
          {error && evaluation && (
            <Alert variant="warning" className="mb-8">
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>
                {error} We're showing results based on our backup evaluation system.
              </AlertDescription>
            </Alert>
          )}

          {/* Score Card */}
          <Card className="mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-2">
              <CardTitle>Overall Performance</CardTitle>
              <CardDescription>Based on your responses to {questions.length} questions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className={`text-6xl md:text-7xl font-bold mb-4 ${getScoreColor(evaluation.score)}`}>
                {evaluation.score}%
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${star <= Math.round(evaluation.score/20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {evaluation.feedback || (
                  evaluation.score >= 90 ? "Excellent! You're well-prepared for your interviews." :
                  evaluation.score >= 75 ? "Great job! With a few improvements, you'll be interview-ready." :
                  evaluation.score >= 60 ? "Good effort! More practice will help you improve significantly." :
                  "Keep practicing! You're on your way to interview success."
                )}
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
                  {evaluation.strengths.map((strength, index) => (
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
                  {evaluation.weaknesses.map((weakness, index) => (
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
                {evaluation.suggestions.map((suggestion, index) => (
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

          {/* Question and Answer Review */}
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
