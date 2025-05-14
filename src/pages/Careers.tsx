
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time"
    },
    {
      title: "Content Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "New York, NY",
      type: "Full-time"
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Flexible work arrangements",
    "Comprehensive health, dental, and vision insurance",
    "401(k) with company match",
    "Unlimited PTO",
    "Professional development stipend",
    "Home office setup allowance",
    "Regular company retreats"
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Help us empower job seekers worldwide with innovative interview preparation solutions.
        </p>
      </div>

      {/* Why Work With Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Work With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-600 mb-4">
              At VirtualHR, we're passionate about helping people succeed in their careers. We're building cutting-edge AI technology that makes quality interview preparation accessible to everyone.
            </p>
            <p className="text-gray-600 mb-4">
              We're a remote-first company with a collaborative culture that values innovation, inclusivity, and work-life balance. Our team is made up of talented individuals from diverse backgrounds who are united by our mission to transform how people prepare for interviews.
            </p>
            <p className="text-gray-600">
              If you're excited about making a meaningful impact and working on challenging problems at the intersection of AI and career development, we'd love to hear from you!
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Benefits & Perks</h3>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openPositions.map((position, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{position.title}</CardTitle>
                  <CardDescription>{position.department}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {position.location}
                  </div>
                  <div className="bg-blue-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {position.type}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Position</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;
