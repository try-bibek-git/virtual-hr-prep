
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, profile, questions, answers } = await req.json();

    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }

    // Endpoint with API key
    const endpoint = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

    if (action === "generate-questions") {
      // Create prompt for generating interview questions
      const prompt = `You are an expert interviewer specialized in ${profile.interviewType} interviews for ${profile.jobRole.replace("_", " ")} positions. 
      The candidate has ${profile.experienceLevel.replace("_", " ")} experience.
      Generate 5 thoughtful and challenging interview questions that would help assess this candidate's suitability.
      The questions should be appropriate for their experience level.
      Return only the questions in a valid JSON format as an array of strings, without any additional text or explanation.
      Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error generating questions");
      }

      let questionsText = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        questionsText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
      
      // Clean up response to ensure valid JSON
      questionsText = questionsText.replace(/```json|```/g, '').trim();
      
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(questionsText);
      } catch (e) {
        // If JSON parsing fails, try to extract questions using regex
        const matches = questionsText.match(/"([^"]+)"/g);
        if (matches) {
          parsedQuestions = matches.map(q => q.replace(/"/g, ''));
        } else {
          // Fallback: split by newlines and clean up
          parsedQuestions = questionsText.split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^\d+\.\s*/, '').trim());
        }
      }

      return new Response(JSON.stringify({ questions: parsedQuestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } 
    else if (action === "evaluate-answers") {
      // Create prompt for evaluating answers
      const prompt = `You are an expert evaluator specialized in ${profile.interviewType} interviews for ${profile.jobRole.replace("_", " ")} positions. 
      The candidate has ${profile.experienceLevel.replace("_", " ")} experience.
      
      Below are the interview questions and the candidate's answers. Please evaluate their performance:
      
      ${questions.map((q, i) => `Question ${i + 1}: ${q}\nAnswer: ${answers[i] || "No answer provided"}`).join("\n\n")}
      
      Provide your evaluation in a valid JSON format with the following structure:
      {
        "score": [a number between 0 and 100 representing overall performance],
        "strengths": [an array of 3-5 strings describing what the candidate did well],
        "weaknesses": [an array of 2-4 strings describing areas for improvement],
        "suggestions": [an array of 3-5 strings with specific advice for improving],
        "feedback": [a brief paragraph summarizing the overall assessment]
      }`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error evaluating answers");
      }

      let evaluationText = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        evaluationText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
      
      // Clean up response to ensure valid JSON
      evaluationText = evaluationText.replace(/```json|```/g, '').trim();
      
      let evaluation;
      try {
        evaluation = JSON.parse(evaluationText);
      } catch (e) {
        // If parsing fails, return an error
        throw new Error("Failed to parse evaluation results");
      }

      return new Response(JSON.stringify(evaluation), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    else {
      throw new Error("Invalid action specified");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
