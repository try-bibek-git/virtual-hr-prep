import React from 'react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MessageSquare, FileText, BarChart3, Award, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import TypingAnimation from "@/components/TypingAnimation";

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

const CompanyLogos = {
  Google: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 92" width="120" height="40">
      <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
      <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
      <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
    </svg>
  ),
  Amazon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 602.28 181.499" width="120" height="40">
      <path fill="#FF9900" d="M374.006,142.184L374.006,142.184l-22.223,7.511v-11.553l13.225-3.58l9,7.622L374.006,142.184z"/>
      <path fill="#FF9900" d="M135.923,122.625c-8.695,0-17.639,3.251-24.477,8.65v-70.993h-22.603v119.885h22.603v-8.143c7.352,5.76,15.916,8.901,24.478,8.901c20.266,0,36.725-16.472,36.725-36.744C172.649,139.096,156.189,122.625,135.923,122.625z M134.308,157.018c-8.621,0-15.618-7.002-15.618-15.622c0-8.621,7.002-15.618,15.618-15.618c8.626,0,15.618,6.997,15.618,15.618C149.926,150.016,142.934,157.018,134.308,157.018z"/>
      <path fill="#FF9900" d="M212.903,122.625c-8.695,0-17.639,3.251-24.478,8.65v-70.993h-22.603v119.885h22.603v-8.143c7.353,5.76,15.917,8.901,24.478,8.901c20.266,0,36.725-16.472,36.725-36.744C249.629,139.096,233.169,122.625,212.903,122.625z M211.289,157.018c-8.621,0-15.618-7.002-15.618-15.622c0-8.621,7.002-15.618,15.618-15.618c8.626,0,15.618,6.997,15.618,15.618C226.907,150.016,219.915,157.018,211.289,157.018z"/>
      <path fill="#FF9900" d="M301.362,122.625c-22.064,0-39.996,17.924-39.996,40.005c0,22.08,17.932,39.996,39.996,39.996c22.08,0,40.005-17.916,40.005-39.996C341.367,140.549,323.442,122.625,301.362,122.625z M301.362,174.965c-6.798,0-12.335-5.536-12.335-12.335c0-6.798,5.537-12.335,12.335-12.335c6.799,0,12.335,5.537,12.335,12.335C313.697,169.429,308.161,174.965,301.362,174.965z"/>
      <path fill="#FF9900" d="M443.62,122.625c-8.695,0-17.639,3.251-24.478,8.65V129.1h-22.602v69.066h22.602v-37.34c0-8.621,7.002-15.618,15.618-15.618c8.626,0,15.623,6.997,15.623,15.618v37.34h22.597v-40.691C472.981,139.614,459.997,122.625,443.62,122.625z"/>
    </svg>
  ),
  Microsoft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="120" height="40">
      <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#7FBA00" d="M12 1h10v10H12z"/>
      <path fill="#00A4EF" d="M1 12h10v10H1z"/>
      <path fill="#FFB900" d="M12 12h10v10H12z"/>
    </svg>
  ),
  Apple: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="120" height="40">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.93.21-9.84-1.96-14.74-6.52-3.13-2.73-7.05-7.41-11.77-14.04-5.05-7.08-9.2-15.29-12.44-24.65-3.47-10.11-5.21-19.9-5.21-29.38 0-10.86 2.35-20.22 7.04-28.07 3.69-6.28 8.6-11.22 14.75-14.84s12.79-5.47 19.96-5.59c3.91 0 9.05 1.21 15.43 3.59 6.36 2.39 10.45 3.6 12.24 3.6 1.34 0 5.88-1.42 13.57-4.24 7.27-2.61 13.41-3.7 18.4-3.29 13.6 1.1 23.8 6.47 30.58 16.14-12.16 7.37-18.18 17.68-18.08 30.88.09 10.3 3.85 18.87 11.26 25.66 3.34 3.17 7.08 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.1-2.96 15.67-8.86 22.66-7.12 8.33-15.73 13.13-25.07 12.37a25.2 25.2 0 01-.18-3.07c0-7.76 3.37-16.07 9.36-22.82 3-3.4 6.82-6.2 11.45-8.4 4.62-2.18 9-3.35 13.1-3.56.12 1.01.18 2.01.18 3.03z"/>
    </svg>
  ),
  Meta: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="120" height="40">
      <path fill="#0866FF" d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z"/>
      <path fill="#FFFFFF" d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.09 1.116-4.09 4.025V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.53-.399Z"/>
    </svg>
  ),
  Netflix: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 276.742" width="120" height="40">
      <path fill="#E50914" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 74.59 30.27-74.59h47.295z"/>
    </svg>
  ),
  Adobe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="120" height="40">
      <path fill="#FF0000" d="M315.5 64h170.9v384L315.5 64zm-119 0H25.6v384L196.5 64zM256 206.1L363.5 448h-73l-30.7-76.8h-78.7l69.8-165.1H256z"/>
    </svg>
  ),
  Salesforce: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2500 1764" width="120" height="40">
      <path fill="#00A1E0" d="M1020.9 715.6c23.7-25 56.9-40.7 93.5-40.7 42 0 79.5 20.6 102.8 52.4 21.5-9.4 45.2-14.7 70.2-14.7 97.1 0 175.7 78.6 175.7 175.7s-78.6 175.7-175.7 175.7c-10.3 0-20.6-1.1-30.4-2.7-18.8 37.1-57.3 62.6-101.7 62.6-18.7 0-36.3-4.5-51.9-12.5-19.5 51-69 87.2-126.6 87.2-60.8 0-112.5-40-130.2-95.2-7.9 1.5-16 2.3-24.4 2.3-70.1 0-127-56.9-127-127 0-50.1 29-93.7 71.2-114.9-11.9-22.9-18.6-48.8-18.6-76.2 0-94 77.2-170.3 172.3-170.3 76.3 0 142.1 49.5 164.8 118.4z"/>
    </svg>
  )
};

const companies = [
  { name: "Google", logo: CompanyLogos.Google },
  { name: "Amazon", logo: CompanyLogos.Amazon },
  { name: "Microsoft", logo: CompanyLogos.Microsoft },
  { name: "Apple", logo: CompanyLogos.Apple },
  { name: "Meta", logo: CompanyLogos.Meta },
  { name: "Netflix", logo: CompanyLogos.Netflix },
  { name: "Adobe", logo: CompanyLogos.Adobe },
  { name: "Salesforce", logo: CompanyLogos.Salesforce }
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

const Index: React.FC = () => {
  // Embla carousel setup with auto-scroll
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    loop: true,
    dragFree: true
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (emblaApi) {
      // Start auto-scrolling
      const intervalId = setInterval(() => {
        emblaApi.scrollNext();
      }, 3000); // Scroll every 3 seconds
      
      // Clean up interval when component unmounts
      return () => clearInterval(intervalId);
    }
  }, [emblaApi]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight min-h-[4rem] md:min-h-[5rem] lg:min-h-[6rem]">
                <TypingAnimation 
                  text="Ace Your Next Interview with AI!" 
                  speed={40}
                />
              </h1>
              <div className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg min-h-[3rem]">
                <TypingAnimation 
                  text="Practice with our AI-powered interview simulator and get personalized feedback to improve your interview skills." 
                  speed={15}
                />
              </div>
              <div className="pt-4">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link to="/setup">
                    Start Practice <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="/interview-dark.png" 
                alt="Interview Illustration" 
                className="w-full h-auto rounded-2xl shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* MCQ Generator Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 via-blue-50 to-green-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-green-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Transform Your PDFs into Interactive MCQs
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Upload any PDF document and instantly generate multiple choice questions for self-assessment. 
                  Perfect for studying, reviewing materials, or testing your knowledge.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Instant PDF Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>AI-Generated Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Immediate Feedback</span>
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0" 
                asChild
              >
                <a 
                  href="https://mock-mcq-sepia.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Try MCQ Generator Now
                </a>
              </Button>
            </div>
            <div className="flex-1">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 shadow-xl">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">1</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Upload your PDF document</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">AI generates relevant MCQs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Take the quiz and get instant feedback</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <Card 
                key={index} 
                className="transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-white via-blue-50/30 to-green-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-green-900/10 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 backdrop-blur-sm"
              >
                <CardHeader className="items-center text-center pb-2">
                  <div className="mb-4 p-3 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                    {step.icon}
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
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

      {/* Companies Carousel - Now with SVG Logos */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Used by Top Companies</h2>
          <div className="w-full max-w-5xl mx-auto overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {/* Duplicate companies for seamless infinite scroll */}
              {[...companies, ...companies].map((company, index) => (
                <div key={index} className="min-w-[250px] flex-shrink-0 px-4">
                  <Card className="h-32 flex items-center justify-center border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                    <CardContent className="flex items-center justify-center p-4">
                      {company.logo && <company.logo />}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Ace Your Interview?</h2>
          <p className="max-w-2xl mx-auto text-lg">
            Join thousands of job seekers who have improved their interview skills with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/setup">
                Start Practicing Now
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors" 
              asChild
            >
              <a 
                href="https://mock-mcq-sepia.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Try MCQ Generator
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
