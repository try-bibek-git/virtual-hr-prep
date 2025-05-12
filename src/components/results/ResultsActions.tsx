
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Printer, ArrowRight } from "lucide-react";

const ResultsActions = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button className="flex items-center gap-2">
        <Download className="h-5 w-5" /> Download Report
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
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
