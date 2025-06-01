
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Printer, ArrowRight } from "lucide-react";
import { generatePDFReport } from "@/utils/reportGenerator";
import { toast } from "@/hooks/use-toast";

interface ResultsActionsProps {
  profile: {
    name: string;
    jobRole: string;
    experienceLevel: string;
    interviewType?: string;
  };
  evaluation: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    feedback: string;
    source?: string;
  };
  questions: string[];
  answers: string[];
}

const ResultsActions = ({ profile, evaluation, questions, answers }: ResultsActionsProps) => {
  const handleDownloadReport = () => {
    try {
      console.log('Starting PDF generation...');
      generatePDFReport({
        profile,
        evaluation,
        questions,
        answers
      });
      toast({
        title: "Report Downloaded",
        description: "Your interview report has been downloaded successfully!",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrintResults = () => {
    try {
      window.print();
      toast({
        title: "Print Dialog Opened",
        description: "Print dialog has been opened for your results.",
      });
    } catch (error) {
      console.error("Error opening print dialog:", error);
      toast({
        title: "Print Failed",
        description: "Unable to open print dialog. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button onClick={handleDownloadReport} className="flex items-center gap-2">
        <Download className="h-5 w-5" /> Download Report
      </Button>
      <Button onClick={handlePrintResults} variant="outline" className="flex items-center gap-2">
        <Printer className="h-5 w-5" /> Print Results
      </Button>
      <Button variant="secondary" asChild className="flex items-center gap-2">
        <Link to="/setup">
          Try Another Interview <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};

export default ResultsActions;
