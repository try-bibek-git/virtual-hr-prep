
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquare, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Personalized Interviews",
      description: "AI-powered interviews customized to your experience level, industry, and job role."
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Real-Time Feedback",
      description: "Get instant feedback on your responses with specific suggestions for improvement."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Performance Analytics",
      description: "Visualize your progress over time with detailed performance metrics and reports."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Interview Templates",
      description: "Choose from various interview types including behavioral, technical, and role-specific interviews."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">VirtualHR Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered platform helps you prepare for interviews with realistic practice and personalized feedback.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="items-center text-center pb-2">
              <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-full">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary text-primary-foreground p-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to enhance your interview skills?</h2>
        <p className="text-lg mb-8">
          Start practicing today and increase your chances of landing your dream job.
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
          <Link to="/setup">
            Try it Now
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Features;
