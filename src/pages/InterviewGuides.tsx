
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const InterviewGuides = () => {
  const guides = [
    {
      title: "Behavioral Interview Guide",
      description: "Learn how to effectively answer questions about your past experiences and behaviors.",
      readTime: "15 min read"
    },
    {
      title: "Technical Interview Preparation",
      description: "Tips and strategies for coding interviews, system design, and technical problem-solving.",
      readTime: "20 min read"
    },
    {
      title: "Answering the 'Tell Me About Yourself' Question",
      description: "Craft the perfect elevator pitch that highlights your strengths and relevant experience.",
      readTime: "10 min read"
    },
    {
      title: "Preparing for Leadership Role Interviews",
      description: "Learn how to effectively communicate your leadership style and experiences.",
      readTime: "18 min read"
    },
    {
      title: "Negotiating Your Salary",
      description: "Strategies for discussing compensation and benefits during the interview process.",
      readTime: "12 min read"
    },
    {
      title: "Remote Interview Success",
      description: "Best practices for virtual interviews, from technical setup to building rapport.",
      readTime: "15 min read"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Interview Guides</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive resources to help you prepare for and excel in any interview situation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>{guide.title}</CardTitle>
              <CardDescription>{guide.readTime}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{guide.description}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button variant="outline" className="w-full" asChild>
                <Link to="#">Read Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InterviewGuides;
