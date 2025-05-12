
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Import newly created components
import ScoreCard from "@/components/results/ScoreCard";
import StrengthsWeaknesses from "@/components/results/StrengthsWeaknesses";
import SuggestionsList from "@/components/results/SuggestionsList";
import AnswerReview from "@/components/results/AnswerReview";
import ResultsActions from "@/components/results/ResultsActions";
import ErrorState from "@/components/results/ErrorState";
import LoadingDisplay from "@/components/interview/LoadingDisplay";

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
    return <LoadingDisplay profile={profile} />;
  }

  // Show error if no interview data or evaluation failed
  if ((error && !evaluation) || !questions.length) {
    return <ErrorState error={error || "No interview data found"} />;
  }

  // If no evaluation results, show error
  if (!evaluation) {
    return <ErrorState error="We couldn't process your interview results. Please try again." />;
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
          <ScoreCard score={evaluation.score} feedback={evaluation.feedback} />

          {/* Strengths and Weaknesses */}
          <StrengthsWeaknesses strengths={evaluation.strengths} weaknesses={evaluation.weaknesses} />

          {/* Detailed Suggestions */}
          <SuggestionsList suggestions={evaluation.suggestions} />

          {/* Question and Answer Review */}
          <AnswerReview questions={questions} answers={answers} />

          {/* Actions */}
          <ResultsActions />
        </div>
      </main>
    </div>
  );
};

export default Results;
