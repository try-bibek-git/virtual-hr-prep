import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock } from "lucide-react";

// Sample questions based on interview type
const sampleQuestions = {
  Technical: [
    "Walk me through how you would design a URL shortening service.",
    "Explain the concept of RESTful APIs and their key principles.",
    "How do you approach debugging a complex issue in your code?",
    "Describe a situation where you had to optimize a piece of code for performance.",
    "What strategies do you use for testing your code?",
  ],
  Behavioral: [
    "Tell me about a time you faced a significant challenge at work. How did you handle it?",
    "Describe a situation where you had to work with a difficult team member.",
    "Give an example of a goal you set for yourself and how you achieved it.",
    "Tell me about a time when you had to make an important decision with limited information.",
    "Describe how you handle working under pressure and tight deadlines.",
  ],
  Mixed: [
    "Tell me about yourself and your technical background.",
    "Describe a challenging project you worked on and the technologies you used.",
    "How do you stay updated with the latest trends in your field?",
    "Tell me about a time when you had to learn a new technology quickly. How did you approach it?",
    "What's your approach to balancing code quality with meeting deadlines?",
  ],
};

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Get user profile from location state
  const profile = location.state || {
    name: "User",
    jobRole: "software_engineer",
    experienceLevel: "mid_level",
    interviewType: "Mixed",
  };

  // Initialize questions based on interview type
  useEffect(() => {
    const interviewQuestions = sampleQuestions[profile.interviewType as keyof typeof sampleQuestions] || sampleQuestions.Mixed;
    setQuestions(interviewQuestions);
    setAnswers(new Array(interviewQuestions.length).fill(""));
  }, [profile.interviewType]);

  // Timer countdown
  useEffect(() => {
    let timer: number;
    if (isTimerActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => {
      clearInterval(timer);
    };
  }, [isTimerActive, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    // Save current answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = currentAnswer;
    setAnswers(updatedAnswers);
    
    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer("");
      setTimeLeft(120); // Reset timer for next question
    } else {
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Your Interview Session</h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="h-5 w-5" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <Card className="mb-8 shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {profile.interviewType} Interview for {profile.jobRole.replace("_", " ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{questions[currentQuestion]}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Textarea
              value={currentAnswer}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              className="min-h-[200px] p-4 text-base resize-y"
            />

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? "Pause Timer" : "Resume Timer"}
              </Button>

              <Button 
                onClick={handleNextQuestion} 
                className="px-8"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>Next Question <ArrowRight className="ml-2 h-5 w-5" /></>
                ) : (
                  "Finish Interview"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
