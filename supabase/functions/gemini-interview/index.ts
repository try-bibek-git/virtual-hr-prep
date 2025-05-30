
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

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
    const { action, profile, questions, answers, forceOpenAI = false } = await req.json();

    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      throw new Error("No AI API keys configured");
    }

    if (action === "generate-questions") {
      // First try with Gemini if the API key is available and not forced to use OpenAI
      if (GEMINI_API_KEY && !forceOpenAI) {
        try {
          console.log("Attempting to generate questions with Gemini...");
          
          // Create prompt for generating interview questions
          const prompt = `You are an expert interviewer specialized in ${profile.interviewType} interviews for ${profile.jobRole.replace("_", " ")} positions. 
          The candidate has ${profile.experienceLevel.replace("_", " ")} experience.
          Generate 10 thoughtful and challenging interview questions that would help assess this candidate's suitability.
          The questions should be appropriate for their experience level.
          Return only the questions in a valid JSON format as an array of strings, without any additional text or explanation.
          Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

          // Gemini API call
          const response = await fetch(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
            {
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
            }
          );

          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error.message || "Error generating questions with Gemini");
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

          return new Response(JSON.stringify({ 
            questions: parsedQuestions,
            source: "Gemini" 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (geminiError) {
          console.error("Gemini API error:", geminiError.message);
          // If Gemini fails and OpenAI is available, fall back to OpenAI
          if (!OPENAI_API_KEY) {
            throw geminiError; // Re-throw if no fallback available
          }
        }
      }

      // Fallback to OpenAI or if no Gemini key is available or if forced
      if (OPENAI_API_KEY) {
        try {
          console.log("Generating questions with OpenAI...");
          
          const prompt = `You are an expert interviewer specialized in ${profile.interviewType} interviews for ${profile.jobRole.replace("_", " ")} positions. 
          The candidate has ${profile.experienceLevel.replace("_", " ")} experience.
          Generate 5 thoughtful and challenging interview questions that would help assess this candidate's suitability.
          The questions should be appropriate for their experience level.
          Return ONLY the questions in a valid JSON format as an array of strings, without any additional text or explanation.
          Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

          // OpenAI API call
          const openAIResponse = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: "You are an expert interviewer who generates interview questions. Return only a JSON array of string questions." },
                { role: "user", content: prompt }
              ],
              temperature: 0.7,
              max_tokens: 1024
            })
          });

          const openAIData = await openAIResponse.json();
          
          if (openAIData.error) {
            throw new Error(openAIData.error.message || "Error generating questions with OpenAI");
          }

          const openAIText = openAIData.choices[0]?.message?.content;
          
          if (!openAIText) {
            throw new Error("Unexpected response format from OpenAI API");
          }
          
          // Clean up response to ensure valid JSON
          const cleanedText = openAIText.replace(/```json|```/g, '').trim();
          
          let parsedQuestions;
          try {
            parsedQuestions = JSON.parse(cleanedText);
          } catch (e) {
            // Fallback for parsing errors
            const matches = cleanedText.match(/"([^"]+)"/g);
            if (matches) {
              parsedQuestions = matches.map(q => q.replace(/"/g, ''));
            } else {
              // Split by newlines as last resort
              parsedQuestions = cleanedText.split('\n')
                .filter(line => line.trim().length > 0)
                .map(line => line.replace(/^\d+\.\s*/, '').trim());
            }
          }

          return new Response(JSON.stringify({ 
            questions: parsedQuestions,
            source: "OpenAI" 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (openAIError) {
          console.error("OpenAI fallback error:", openAIError.message);
          throw openAIError;
        }
      }
    } 
    else if (action === "evaluate-answers") {
      if (GEMINI_API_KEY && !forceOpenAI) {
        try {
          console.log("Attempting to evaluate answers with Gemini...");
          
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

          const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
            throw new Error("Failed to parse evaluation results");
          }

          return new Response(JSON.stringify({
            ...evaluation,
            source: "Gemini"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (geminiError) {
          console.error("Gemini API error:", geminiError.message);
          // If Gemini fails and OpenAI is available, try the fallback
          if (!OPENAI_API_KEY) {
            throw geminiError;
          }
        }
      }
        
      // Fallback to OpenAI or if no Gemini key is available
      if (OPENAI_API_KEY) {
        try {
          console.log("Evaluating answers with OpenAI...");
          
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

          const openAIResponse = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: "You are an expert interview evaluator who will return only a valid JSON response." },
                { role: "user", content: prompt }
              ],
              temperature: 0.3,
              max_tokens: 2048
            })
          });

          const openAIData = await openAIResponse.json();
          
          if (openAIData.error) {
            throw new Error(openAIData.error.message || "Error evaluating answers with OpenAI");
          }

          const openAIText = openAIData.choices[0]?.message?.content;
          
          if (!openAIText) {
            throw new Error("Unexpected response format from OpenAI API");
          }
          
          // Clean up response to ensure valid JSON
          const cleanedText = openAIText.replace(/```json|```/g, '').trim();
          
          let evaluation;
          try {
            evaluation = JSON.parse(cleanedText);
          } catch (e) {
            throw new Error("Failed to parse evaluation results from OpenAI");
          }

          return new Response(JSON.stringify({
            ...evaluation,
            source: "OpenAI"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (openAIError) {
          console.error("OpenAI fallback error:", openAIError.message);
          throw openAIError;
        }
      }
    }
    else {
      throw new Error("Invalid action specified");
    }
  } catch (error) {
    console.error("AI API error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred",
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
