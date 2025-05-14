
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      title: "Top 10 Most Common Interview Questions and How to Answer Them",
      excerpt: "Preparing for an interview can be stressful, but knowing how to respond to common questions can give you confidence and help you shine...",
      author: "Sarah Johnson",
      date: "May 10, 2023",
      category: "Interview Tips",
      readTime: "8 min read"
    },
    {
      title: "How to Showcase Your Soft Skills During an Interview",
      excerpt: "Technical skills may get you in the door, but soft skills often determine whether you get the job. Learn how to effectively demonstrate your...",
      author: "Michael Chen",
      date: "April 25, 2023",
      category: "Career Advice",
      readTime: "6 min read"
    },
    {
      title: "Mastering the Virtual Interview: Tips for Remote Success",
      excerpt: "Virtual interviews have become increasingly common. Learn how to navigate technical challenges, create a professional environment, and build rapport...",
      author: "Priya Patel",
      date: "April 12, 2023",
      category: "Interview Tips",
      readTime: "7 min read"
    },
    {
      title: "The Art of Storytelling in Job Interviews",
      excerpt: "Learn how to craft compelling narratives about your experience that showcase your skills, achievements, and personality in a memorable way...",
      author: "David Wilson",
      date: "March 30, 2023",
      category: "Communication Skills",
      readTime: "9 min read"
    },
    {
      title: "How to Research a Company Before Your Interview",
      excerpt: "Thorough company research is essential for interview success. Discover the key information to look for and how to use it effectively during your interview...",
      author: "Sarah Johnson",
      date: "March 15, 2023",
      category: "Interview Preparation",
      readTime: "5 min read"
    },
    {
      title: "Body Language Tips for Interview Success",
      excerpt: "Your nonverbal communication speaks volumes during an interview. Learn how to make a positive impression through confident body language...",
      author: "Michael Chen",
      date: "February 28, 2023",
      category: "Interview Tips",
      readTime: "6 min read"
    }
  ];

  const categories = [
    "All Categories",
    "Interview Tips",
    "Career Advice",
    "Communication Skills",
    "Interview Preparation",
    "Job Search",
    "Resume Tips"
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">VirtualHR Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert advice, tips, and insights to help you succeed in your job interviews and career.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader>
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">{post.category}</div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="mt-auto pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-600">By {post.author}</div>
                <Button variant="ghost" className="text-primary" asChild>
                  <Link to="#">Read More</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 p-8 bg-blue-50 dark:bg-gray-800 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
          Get the latest interview tips, career advice, and job search strategies delivered straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input placeholder="Enter your email" className="flex-1" />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
