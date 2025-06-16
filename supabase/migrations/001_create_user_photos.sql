
-- Create the user-photos storage bucket
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('user-photos', 'user-photos', true, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- Create storage policies to allow authenticated users to upload and read their own photos
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own photos" ON storage.objects
FOR SELECT USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create user_photos table to store photo metadata and evaluation results
CREATE TABLE IF NOT EXISTS user_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  outfit_score INTEGER CHECK (outfit_score >= 1 AND outfit_score <= 10),
  outfit_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_photos table
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_photos table
CREATE POLICY "Users can insert their own photos" ON user_photos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own photos" ON user_photos
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" ON user_photos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" ON user_photos
FOR DELETE USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS user_photos_user_id_idx ON user_photos(user_id);
CREATE INDEX IF NOT EXISTS user_photos_created_at_idx ON user_photos(created_at DESC);
