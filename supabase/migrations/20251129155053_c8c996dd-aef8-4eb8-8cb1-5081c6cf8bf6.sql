-- Create saved_families table for individual family saving
CREATE TABLE public.saved_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dietary JSONB NOT NULL DEFAULT '[]'::jsonb,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_families ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own saved families"
  ON public.saved_families
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved families"
  ON public.saved_families
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved families"
  ON public.saved_families
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved families"
  ON public.saved_families
  FOR DELETE
  USING (auth.uid() = user_id);