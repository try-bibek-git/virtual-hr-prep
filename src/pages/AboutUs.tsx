
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former HR Director with 15 years of experience in talent acquisition and development."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "AI specialist with expertise in machine learning and natural language processing."
    },
    {
      name: "Priya Patel",
      role: "Head of Product",
      bio: "Product leader focused on creating intuitive and effective user experiences."
    },
    {
      name: "David Wilson",
      role: "Head of Customer Success",
      bio: "Dedicated to ensuring our customers get the most value from our platform."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About VirtualHR</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to help job seekers worldwide prepare for interviews and advance their careers with confidence.
        </p>
      </div>

      {/* Our Story */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            VirtualHR was founded in 2023 with a simple idea: make interview preparation accessible, effective, and stress-free for everyone.
          </p>
          <p className="text-gray-600 mb-4">
            After witnessing countless talented individuals struggle with interview anxiety and lack of preparation, our founder, Sarah Johnson, decided to leverage AI technology to create a solution.
          </p>
          <p className="text-gray-600">
            Today, VirtualHR helps thousands of job seekers worldwide practice interviews, receive personalized feedback, and approach their job search with confidence.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="bg-primary/10 p-8 rounded-full">
            <MessageSquare className="h-32 w-32 text-primary" />
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We continuously improve our platform with cutting-edge AI technology to provide the best interview preparation experience.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We believe quality interview preparation should be available to everyone, regardless of background or resources.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Empowerment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We aim to empower job seekers with the skills and confidence they need to succeed in their career journeys.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Team */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {member.name.charAt(0)}
                </div>
                <CardTitle className="mt-4">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
