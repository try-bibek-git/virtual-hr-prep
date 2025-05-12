
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

// Custom hooks
import { useTimer } from "@/hooks/useTimer";
import { useInterviewQuestions } from "@/hooks/useInterviewQuestions";

// Components
import InterviewHeader from "@/components/interview/InterviewHeader";
import QuestionCard from "@/components/interview/QuestionCard";
import AnswerSection from "@/components/interview/AnswerSection";
import LoadingDisplay from "@/components/interview/LoadingDisplay";
import ErrorDisplay from "@/components/interview/ErrorDisplay";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user profile from location state
  const profile = location.state || {
    name: "User",
    jobRole: "software_engineer",
    experienceLevel: "mid_level",
    interviewType: "Mixed",
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Load questions using our custom hook
  const { questions, isLoading, error, loadQuestions } = useInterviewQuestions(profile);

  // Setup timer with our custom hook
  const { timeLeft, isActive: isTimerActive, toggleTimer, resetTimer, formattedTime } = useTimer({
    initialTime: 120, // 2 minutes per question
    onComplete: () => handleNextQuestion()
  });

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    // Save current answer
    const updatedAnswers = [...answers];
    if (currentQuestion >= updatedAnswers.length) {
      updatedAnswers.push(currentAnswer);
    } else {
      updatedAnswers[currentQuestion] = currentAnswer;
    }
    setAnswers(updatedAnswers);
    
    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer("");
      resetTimer(); // Reset timer for next question
    } else {
      // Show loading toast
      toast({
        title: "Analyzing your responses",
        description: "Please wait while we evaluate your interview...",
      });
      
      // End of interview, navigate to results
      navigate("/results", { 
        state: { 
          profile, 
          questions, 
          answers: updatedAnswers 
        } 
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingDisplay profile={profile} />;
  }

  // Show error state
  if (error && questions.length === 0) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <InterviewHeader 
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            formattedTime={formattedTime}
          />

          {error && (
            <Alert variant="warning" className="mb-6">
              <AlertDescription>
                {error} We're using our backup questions instead.
              </AlertDescription>
            </Alert>
          )}

          <QuestionCard
            questionNumber={currentQuestion + 1}
            question={questions[currentQuestion]}
            interviewType={profile.interviewType}
            jobRole={profile.jobRole}
          />

          <AnswerSection
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
            onNextQuestion={handleNextQuestion}
            onToggleTimer={toggleTimer}
            isTimerActive={isTimerActive}
            isLastQuestion={currentQuestion === questions.length - 1}
          />
        </div>
      </main>
    </div>
  );
};

export default Interview;
