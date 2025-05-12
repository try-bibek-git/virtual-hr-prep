
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Loading Results</AlertTitle>
          <AlertDescription>
            {error || "No interview data found. Please complete an interview first."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/setup")}>
          Start a New Interview
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
