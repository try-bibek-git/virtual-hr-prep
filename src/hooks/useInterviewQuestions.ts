
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Profile {
  name: string;
  jobRole: string;
  experienceLevel: string;
  interviewType: string;
}

export const useInterviewQuestions = (profile: Profile) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<string | null>(null);

  // Fallback sample questions
  const getSampleQuestions = (interviewType: string) => {
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
    
    return sampleQuestions[interviewType as keyof typeof sampleQuestions] || sampleQuestions.Mixed;
  };

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    setApi(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("gemini-interview", {
        body: {
          action: "generate-questions",
          profile
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to generate questions");
      }

      if (!data || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("Invalid response from AI API");
      }

      setQuestions(data.questions);
      setApi(data.source || "Gemini");
      toast({
        title: "Questions Generated",
        description: `Your personalized interview questions are ready! (Using ${data.source || "AI"})`,
      });
    } catch (err: any) {
      console.error("Error fetching questions:", err);
      setError(err.message || "Failed to generate interview questions");
      
      // Try one more time with a direct flag for OpenAI
      try {
        const { data, error: retryError } = await supabase.functions.invoke("gemini-interview", {
          body: {
            action: "generate-questions",
            profile,
            forceOpenAI: true
          }
        });
        
        if (retryError || !data || !data.questions || !Array.isArray(data.questions)) {
          throw new Error("Both AI providers failed");
        }
        
        setQuestions(data.questions);
        setApi(data.source || "OpenAI (fallback)");
        toast({
          title: "Questions Generated",
          description: `Your personalized interview questions are ready! (Using ${data.source || "OpenAI fallback"})`,
          variant: "default"
        });
      } catch (retryErr: any) {
        console.error("Fallback also failed:", retryErr);
        // Final fallback to sample questions
        const fallbackQuestions = getSampleQuestions(profile.interviewType);
        setQuestions(fallbackQuestions);
        setApi("Sample Questions");
        toast({
          title: "Using Sample Questions",
          description: "We encountered an issue with AI question generation. Using sample questions instead.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [profile]);

  return { questions, isLoading, error, api, loadQuestions };
};
