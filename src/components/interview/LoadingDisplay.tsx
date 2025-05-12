
import { Loader2 } from "lucide-react";

interface LoadingDisplayProps {
  profile?: {
    interviewType: string;
  };
}

const LoadingDisplay = ({ profile }: LoadingDisplayProps) => {
  const interviewType = profile?.interviewType || "your";
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-2xl font-bold">Preparing Your Interview</h2>
        <p className="text-muted-foreground">
          Our AI is crafting personalized questions for {interviewType} interview...
        </p>
      </div>
    </div>
  );
};

export default LoadingDisplay;
