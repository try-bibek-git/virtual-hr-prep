import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import components
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
  source?: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, questions, answers } = location.state || {
    profile: { name: "User", jobRole: "software_engineer", experienceLevel: "mid_level" },
    questions: [],
    answers: [],
  };

  const [evaluation, setEvaluation] = useState<EvaluationResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<string | null>(null);
  const [hasInterviewSaved, setHasInterviewSaved] = useState(false);

  // Save interview to history
  const saveInterviewToHistory = async (evaluationResults: EvaluationResults) => {
    if (!user || hasInterviewSaved) return;

    try {
      const { error } = await supabase
        .from('interview_history')
        .insert({
          user_id: user.id,
          profile,
          questions,
          answers,
          evaluation_results: evaluationResults
        });

      if (error) {
        console.error('Error saving interview to history:', error);
        // Don't show error to user as this is a background operation
      } else {
        setHasInterviewSaved(true);
        console.log('Interview saved to history successfully');
      }
    } catch (err) {
      console.error('Error saving interview to history:', err);
    }
  };

  // Get evaluation from AI API
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

        const evaluationData = data as EvaluationResults;
        setEvaluation(evaluationData);
        setApiSource(data.source || null);
        
        // Save to history after successful evaluation
        await saveInterviewToHistory(evaluationData);
        
        toast({
          title: "Evaluation Complete",
          description: `Your interview has been evaluated using ${data.source || "AI"}!`,
        });
      } catch (err: any) {
        console.error("Error evaluating interview:", err);
        setError(err.message || "Failed to evaluate your interview");
        
        // Try again with OpenAI fallback explicitly
        try {
          const { data, error: retryError } = await supabase.functions.invoke("gemini-interview", {
            body: {
              action: "evaluate-answers",
              profile,
              questions,
              answers,
              forceOpenAI: true
            }
          });
          
          if (retryError || !data || typeof data.score !== 'number' || !Array.isArray(data.strengths)) {
            throw new Error("Both AI providers failed");
          }
          
          const evaluationData = data as EvaluationResults;
          setEvaluation(evaluationData);
          setApiSource(data.source || "OpenAI (fallback)");
          
          // Save to history after successful fallback evaluation
          await saveInterviewToHistory(evaluationData);
          
          toast({
            title: "Evaluation Complete",
            description: `Your interview has been evaluated using ${data.source || "OpenAI fallback"}!`,
          });
        } catch (retryErr) {
          console.error("Fallback evaluation also failed:", retryErr);
          
          // Generate fallback evaluation
          const fallbackEval = generateFallbackEvaluation();
          setEvaluation(fallbackEval);
          setApiSource("Backup System");
          
          // Save fallback evaluation to history
          await saveInterviewToHistory(fallbackEval);
          
          toast({
            title: "Using Backup Evaluation",
            description: "We encountered an issue with our AI. Using our backup evaluation system instead.",
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    getEvaluation();
  }, [profile, questions, answers, user, hasInterviewSaved]);

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
      feedback: "Overall, a solid interview performance with room for improvement. Focus on providing more specific examples and quantifiable results in your answers.",
      source: "Backup System"
    };
  };

  // Show loading state
  if (isLoading) {
    return <LoadingDisplay profile={profile} forResults={true} />;
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
            {apiSource && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Evaluated using {apiSource}
              </div>
            )}
          </div>

          {/* Error notification if using fallback but still showing results */}
          {error && evaluation && (
            <Alert variant="default" className="mb-8">
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>
                {error} We're showing results based on our {apiSource || "backup evaluation system"}.
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
          <ResultsActions 
            profile={profile}
            evaluation={evaluation}
            questions={questions}
            answers={answers}
          />
        </div>
      </main>
    </div>
  );
};

export default Results;
