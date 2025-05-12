
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Loading Interview</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {onRetry && (
          <Button onClick={onRetry}>Try Again</Button>
        )}
        <Button variant="outline" onClick={() => navigate("/setup")}>
          Return to Setup
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
