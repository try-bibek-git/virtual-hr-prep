
-- Create a table for interview history
CREATE TABLE public.interview_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile JSONB NOT NULL,
  questions TEXT[] NOT NULL,
  answers TEXT[] NOT NULL,
  evaluation_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own interview history
ALTER TABLE public.interview_history ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own interview history
CREATE POLICY "Users can view their own interview history" 
  ON public.interview_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own interview history
CREATE POLICY "Users can create their own interview history" 
  ON public.interview_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own interview history
CREATE POLICY "Users can update their own interview history" 
  ON public.interview_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own interview history
CREATE POLICY "Users can delete their own interview history" 
  ON public.interview_history 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS interview_history_user_id_idx ON interview_history(user_id);
CREATE INDEX IF NOT EXISTS interview_history_created_at_idx ON interview_history(created_at DESC);
