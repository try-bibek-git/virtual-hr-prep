import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, profile, questions, answers, imageUrl, forceOpenAI } = await req.json();
    
    console.log('Request received:', { action, profile: profile?.name });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (action === 'evaluate-outfit') {
      console.log('Evaluating outfit for image:', imageUrl);
      
      // Try Gemini first for outfit evaluation
      if (geminiApiKey && !forceOpenAI) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    text: `Analyze this interview outfit photo and provide feedback. Rate the professional appearance on a scale of 1-10 considering:
                    - Formal attire appropriateness
                    - Color coordination
                    - Overall professional presentation
                    - Interview readiness
                    - Be strict (warn if user wear outfit that is not ideal for an interview)
                    
                    Job Role: ${profile?.jobRole || 'Professional'}
                    Experience Level: ${profile?.experienceLevel || 'Mid-level'}
                    
                    Respond with a JSON object containing:
                    - score: number (1-10)
                    - feedback: string (brief, encouraging feedback about their appearance)
                    
                    Keep feedback positive and constructive, focusing on what looks ideal for an interview and any minor improvements.`
                  },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: await fetch(imageUrl).then(r => r.arrayBuffer()).then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))))
                    }
                  }
                ]
              }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 300
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
              const jsonMatch = text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                console.log('Gemini outfit evaluation successful:', result);
                return new Response(JSON.stringify({ ...result, source: 'Gemini AI' }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          }
        } catch (error) {
          console.error('Gemini outfit evaluation failed:', error);
        }
      }

      // Fallback to OpenAI for outfit evaluation
      if (openaiApiKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: `Analyze this interview outfit photo and provide feedback. Rate the professional appearance on a scale of 1-10 considering formal attire, color coordination, and interview readiness.

Job Role: ${profile?.jobRole || 'Professional'}
Experience Level: ${profile?.experienceLevel || 'Mid-level'}

Respond with only a JSON object containing:
- score: number (1-10)
- feedback: string (brief, encouraging feedback about their appearance)`
                    },
                    {
                      type: 'image_url',
                      image_url: { url: imageUrl }
                    }
                  ]
                }
              ],
              max_tokens: 300,
              temperature: 0.3
            })
          });

          if (response.ok) {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            
            if (content) {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                console.log('OpenAI outfit evaluation successful:', result);
                return new Response(JSON.stringify({ ...result, source: 'OpenAI' }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          }
        } catch (error) {
          console.error('OpenAI outfit evaluation failed:', error);
        }
      }

      // Fallback evaluation
      const fallbackScore = Math.floor(Math.random() * 3) + 7; // 7-9
      return new Response(JSON.stringify({
        score: fallbackScore,
        feedback: "You look professional and well-prepared for your interview! Your attire appears appropriate for a formal interview setting.",
        source: 'Fallback System'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'generate-questions') {
      console.log('Generating interview questions');
      
      const questionPrompt = `Generate 5 interview questions for a ${profile.jobRole.replace('_', ' ')} position, ${profile.experienceLevel.replace('_', ' ')} level, ${profile.interviewType.toLowerCase()} interview type. Return as a JSON array of strings.`;

      // Try Gemini first
      if (geminiApiKey && !forceOpenAI) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: questionPrompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
              const jsonMatch = text.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                const questions = JSON.parse(jsonMatch[0]);
                console.log('Gemini questions generated successfully');
                return new Response(JSON.stringify({ questions, source: 'Gemini AI' }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          }
        } catch (error) {
          console.error('Gemini question generation failed:', error);
        }
      }

      // Fallback to OpenAI
      if (openaiApiKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: questionPrompt }],
              temperature: 0.7,
              max_tokens: 800
            })
          });

          if (response.ok) {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            
            if (content) {
              const jsonMatch = content.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                const questions = JSON.parse(jsonMatch[0]);
                console.log('OpenAI questions generated successfully');
                return new Response(JSON.stringify({ questions, source: 'OpenAI' }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          }
        } catch (error) {
          console.error('OpenAI question generation failed:', error);
        }
      }

      // Fallback questions
      const fallbackQuestions = [
        "Tell me about yourself and your background.",
        "Why are you interested in this position?",
        "What are your greatest strengths?",
        "Describe a challenging situation you faced and how you handled it.",
        "Where do you see yourself in 5 years?"
      ];

      return new Response(JSON.stringify({ questions: fallbackQuestions, source: 'Fallback Questions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'evaluate-answers') {
      console.log('Evaluating interview answers');
      
      const evaluationPrompt = `Evaluate these interview answers for a ${profile.jobRole.replace('_', ' ')} position, ${profile.experienceLevel.replace('_', ' ')} level:

Questions and Answers:
${questions.map((q: string, i: number) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer provided'}`).join('\n\n')}

Provide evaluation as JSON with:
- score: number (0-100)
- strengths: array of strings (3-4 items)
- weaknesses: array of strings (2-3 items)  
- suggestions: array of strings (3-4 improvement tips)
- feedback: string (overall summary)`;

      // Try Gemini first
      if (geminiApiKey && !forceOpenAI) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: evaluationPrompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
              const jsonMatch = text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                console.log('Gemini evaluation successful');
                return new Response(JSON.stringify({ ...evaluation, source: 'Gemini AI' }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          }
        } catch (error) {
          console.error('Gemini evaluation failed:', error);
        }
      }

      // Fallback to OpenAI
      if (openaiApiKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: evaluationPrompt }],
              temperature: 0.3,
              max_tokens: 1000
            })
          });

          if (response.ok) {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            
            if (content) {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                console.log('OpenAI evaluation successful');
                return new Response(JSON.stringify({ ...evaluation, source: 'OpenAI' }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          }
        } catch (error) {
          console.error('OpenAI evaluation failed:', error);
        }
      }

      throw new Error('All AI providers failed');
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });

  } catch (error: any) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
