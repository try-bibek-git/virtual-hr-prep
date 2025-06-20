import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";
import { useJobRoles } from "@/hooks/useJobRoles";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  jobRole: z.string().min(1, {
    message: "Please select a job role.",
  }),
  experienceLevel: z.string().min(1, {
    message: "Please select an experience level.",
  }),
  interviewType: z.enum(["Technical", "Behavioral", "Mixed"], {
    required_error: "Please select an interview type.",
  }),
});

const Setup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: jobRoles, isLoading: jobRolesLoading } = useJobRoles();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      jobRole: "",
      experienceLevel: "",
      interviewType: "Mixed",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // In a real app, you'd save this to your state management or local storage
    console.log(values);
    
    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile Set Up",
        description: "Proceeding to outfit check.",
      });
      
      // Navigate to the look page instead of interview
      navigate("/look", { state: values });
    }, 1000);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-blue dark:bg-gradient-blue-dark">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-primary">Set Up Your Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Help us tailor your interview experience to your needs.
            </p>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 dark:border-gray-700/50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={jobRolesLoading ? "Loading job roles..." : "Select a job role"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobRolesLoading ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            jobRoles?.map((role) => (
                              <SelectItem key={role.id} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry_level">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid_level">Mid Level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior (6+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interviewType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Interview Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Technical" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Technical
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Behavioral" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Behavioral
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Mixed" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Mixed
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg bg-primary hover:bg-primary/90" 
                  disabled={isSubmitting || jobRolesLoading}
                >
                  {isSubmitting ? "Setting Up..." : (
                    <>
                      Continue to Outfit Check <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;
