import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Briefcase, Star, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import InterviewDetailsModal from "@/components/history/InterviewDetailsModal";
import { Database } from "@/integrations/supabase/types";

type InterviewHistoryRecord = Database['public']['Tables']['interview_history']['Row'];

interface InterviewHistory {
  id: string;
  profile: {
    name: string;
    jobRole: string;
    experienceLevel: string;
    interviewType?: string;
  };
  questions: string[];
  answers: string[];
  evaluation_results?: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    feedback: string;
  };
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<InterviewHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<InterviewHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInterviewHistory();
    }
  }, [user]);

  const fetchInterviewHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the database records to match our interface
      const transformedData: InterviewHistory[] = (data || []).map((record: InterviewHistoryRecord) => ({
        id: record.id,
        profile: record.profile as InterviewHistory['profile'],
        questions: record.questions,
        answers: record.answers,
        evaluation_results: record.evaluation_results as InterviewHistory['evaluation_results'],
        created_at: record.created_at
      }));

      setInterviews(transformedData);
    } catch (error: any) {
      console.error('Error fetching interview history:', error);
      toast({
        title: "Error",
        description: "Failed to load interview history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (interview: InterviewHistory) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  const getJobRoleDisplayName = (jobRole: string) => {
    return jobRole.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getExperienceLevelDisplayName = (level: string) => {
    return level.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading your interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Interview History</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Review your past interview sessions and track your progress
            </p>
          </div>

          {interviews.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No Interviews Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You haven't completed any interviews yet. Start practicing to see your history here!
                </p>
                <Button onClick={() => window.location.href = '/setup'}>
                  Start Your First Interview
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getJobRoleDisplayName(interview.profile.jobRole)}
                      </CardTitle>
                      {interview.evaluation_results?.score && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {interview.evaluation_results.score}/10
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(interview.created_at), 'MMM dd, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Experience:</span>
                        <Badge variant="outline">
                          {getExperienceLevelDisplayName(interview.profile.experienceLevel)}
                        </Badge>
                      </div>
                      
                      {interview.profile.interviewType && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Type:</span>
                          <Badge variant="outline">
                            {interview.profile.interviewType}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Questions:</span>
                        <span>{interview.questions.length}</span>
                      </div>
                      
                      <Button 
                        onClick={() => handleViewDetails(interview)}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedInterview && (
        <InterviewDetailsModal
          interview={selectedInterview}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};

export default History;
