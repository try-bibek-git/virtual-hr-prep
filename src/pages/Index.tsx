
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, FileText, BarChart3, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer @ Google",
    content: "This tool helped me prepare for my technical interviews and gave me the confidence I needed. I got the job!",
    avatar: "S",
  },
  {
    name: "Michael Chen",
    role: "Product Manager @ Microsoft",
    content: "The feedback was incredibly specific and helped me refine my responses. Definitely worth using before any important interview.",
    avatar: "M",
  },
  {
    name: "Priya Patel",
    role: "UX Designer @ Adobe",
    content: "The variety of questions and detailed analysis helped me understand my communication strengths and weaknesses.",
    avatar: "P",
  },
];

const companies = [
  "Google", "Amazon", "Microsoft", "Apple", "Meta", "Netflix", "Adobe", "Salesforce"
];

const workflowSteps = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Set Up Your Profile",
    description: "Select your job role, experience level, and the type of interview you want to practice."
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Answer Questions",
    description: "Respond to AI-generated interview questions tailored to your specific role and experience."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Get Evaluated",
    description: "Receive instant feedback on your responses, evaluating relevance, clarity, and confidence."
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Review Detailed Report",
    description: "Access a comprehensive report with strengths, weaknesses, and tips for improvement."
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Ace Your Next Interview with AI!
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                Practice with our AI-powered interview simulator and get personalized feedback to improve your interview skills.
              </p>
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/setup">
                  Start Practice <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1">
              <img 
                src="/placeholder.svg" 
                alt="Interview Illustration" 
                className="w-full h-auto rounded-2xl shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="items-center text-center pb-2">
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-full">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Carousel */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Used by Top Companies</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {companies.map((company, index) => (
                <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/4">
                  <div className="p-2">
                    <Card className="h-32 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                      <CardContent className="flex items-center justify-center p-6">
                        <span className="text-xl font-bold">{company}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="relative static" />
              <CarouselNext className="relative static" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Ace Your Interview?</h2>
          <p className="max-w-2xl mx-auto text-lg">
            Join thousands of job seekers who have improved their interview skills with our AI-powered platform.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link to="/setup">
              Start Practicing Now
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
