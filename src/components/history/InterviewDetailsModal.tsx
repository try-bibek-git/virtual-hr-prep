
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Calendar, User, Briefcase, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { format } from "date-fns";

interface InterviewDetailsModalProps {
  interview: {
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
  };
  isOpen: boolean;
  onClose: () => void;
}

const InterviewDetailsModal = ({ interview, isOpen, onClose }: InterviewDetailsModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Interview Details</span>
            {interview.evaluation_results?.score && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {interview.evaluation_results.score}/10
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {getJobRoleDisplayName(interview.profile.jobRole)} • {format(new Date(interview.created_at), 'MMM dd, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Interview Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Candidate</p>
                      <p className="text-sm text-gray-600">{interview.profile.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Experience Level</p>
                      <p className="text-sm text-gray-600">
                        {getExperienceLevelDisplayName(interview.profile.experienceLevel)}
                      </p>
                    </div>
                  </div>
                  {interview.profile.interviewType && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Interview Type</p>
                        <p className="text-sm text-gray-600">{interview.profile.interviewType}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Results */}
            {interview.evaluation_results && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evaluation Results</CardTitle>
                  <CardDescription>{interview.evaluation_results.feedback}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Strengths */}
                    <div>
                      <h4 className="flex items-center gap-2 font-medium text-green-700 dark:text-green-400 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {interview.evaluation_results.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div>
                      <h4 className="flex items-center gap-2 font-medium text-red-700 dark:text-red-400 mb-2">
                        <XCircle className="h-4 w-4" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {interview.evaluation_results.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h4 className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400 mb-2">
                        <Lightbulb className="h-4 w-4" />
                        Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {interview.evaluation_results.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions and Answers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions & Answers</CardTitle>
                <CardDescription>
                  Review your responses to the interview questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interview.questions.map((question, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-2">Question {index + 1}:</h3>
                      <p className="mb-3 text-gray-800 dark:text-gray-200">{question}</p>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Answer:</h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        {interview.answers[index] || <em className="text-gray-400">No answer provided</em>}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDetailsModal;
