
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Tips = () => {
  const tipsAndTricks = [
    {
      title: "Research the Company",
      description: "Always thoroughly research the company before your interview. Understand their products, services, culture, and recent news."
    },
    {
      title: "Prepare STAR Stories",
      description: "Structure your answers using the STAR method: Situation, Task, Action, and Result for behavioral questions."
    },
    {
      title: "Practice Active Listening",
      description: "Focus on what the interviewer is asking and respond directly to their question rather than giving a prepared speech."
    },
    {
      title: "Prepare Insightful Questions",
      description: "Have 3-5 thoughtful questions prepared for when the interviewer asks if you have any questions."
    },
    {
      title: "Body Language Matters",
      description: "Maintain good posture, eye contact, and a positive demeanor throughout the interview."
    },
    {
      title: "Follow Up After the Interview",
      description: "Send a thank-you email within 24 hours, expressing appreciation for the opportunity and reiterating your interest."
    },
    {
      title: "Practice With Our AI",
      description: "Use our VirtualHR platform to practice answering common interview questions and receive feedback."
    },
    {
      title: "Dress Professionally",
      description: "Dress one level up from the company's typical dress code to make a positive first impression."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Interview Tips & Tricks</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert advice to help you stand out in your next interview and land your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tipsAndTricks.map((tip, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{tip.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Quick Checklist</h2>
        <Separator className="my-4" />
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Review your resume and be prepared to discuss any item on it</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Practice common questions like "Tell me about yourself" and "Why do you want this job?"</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Prepare examples of your achievements and how they relate to the job</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Test your equipment if it's a virtual interview</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span>Get a good night's sleep before the interview day</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tips;
