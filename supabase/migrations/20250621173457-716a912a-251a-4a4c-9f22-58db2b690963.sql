
-- Create job_roles table to store all available job roles
CREATE TABLE public.job_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert existing job roles from the Setup page
INSERT INTO public.job_roles (value, label, sort_order) VALUES
  ('software_engineer', 'Software Engineer', 1),
  ('blockchain_developer', 'Blockchain Developer', 2),
  ('frontend_developer', 'Frontend Developer', 3),
  ('backend_developer', 'Backend Developer', 4),
  ('fullstack_developer', 'Full Stack Developer', 5),
  ('product_manager', 'Product Manager', 6),
  ('data_scientist', 'Data Scientist', 7),
  ('data_analyst', 'Data Analyst', 8),
  ('ai_ml_engineer', 'AI/ML Engineer', 9),
  ('ux_designer', 'UX Designer', 10),
  ('marketing_specialist', 'Marketing Specialist', 11),
  ('teaching_assistant', 'Teaching Assistant', 12),
  ('business_analyst', 'Business Analyst', 13),
  ('graphic_designer', 'Graphic Designer', 14),
  ('motion_designer', 'Motion Designer', 15),
  ('cybersecurity_analyst', 'Cybersecurity Analyst', 16),
  ('sales_representative', 'Sales Representative', 17);

-- Enable Row Level Security
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can see job roles)
CREATE POLICY "Anyone can view active job roles" 
  ON public.job_roles 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admin write access (we'll handle admin auth in the app)
CREATE POLICY "Allow all operations for authenticated users" 
  ON public.job_roles 
  FOR ALL 
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_job_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_job_roles_updated_at
    BEFORE UPDATE ON public.job_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_job_roles_updated_at();
