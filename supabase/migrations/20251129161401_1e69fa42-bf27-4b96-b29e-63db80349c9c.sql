-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the handle_new_user trigger to copy email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'display_name',
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Backfill existing profiles with emails from auth.users
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id AND profiles.email IS NULL;

-- Create trip_invites table for link-based invitations
CREATE TABLE public.trip_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
  email TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on trip_invites
ALTER TABLE public.trip_invites ENABLE ROW LEVEL SECURITY;

-- Trip owners can create invites
CREATE POLICY "Trip owners can create invites"
ON public.trip_invites
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = trip_invites.trip_id
    AND trips.user_id = auth.uid()
  )
);

-- Trip owners can view their trip invites
CREATE POLICY "Trip owners can view invites"
ON public.trip_invites
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = trip_invites.trip_id
    AND trips.user_id = auth.uid()
  )
);

-- Anyone can view invites by code (for claiming)
CREATE POLICY "Anyone can view invites by code"
ON public.trip_invites
FOR SELECT
TO authenticated
USING (true);

-- Trip owners can delete invites
CREATE POLICY "Trip owners can delete invites"
ON public.trip_invites
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = trip_invites.trip_id
    AND trips.user_id = auth.uid()
  )
);

-- Create index for faster invite code lookups
CREATE INDEX idx_trip_invites_code ON public.trip_invites(invite_code);
CREATE INDEX idx_trip_invites_trip_id ON public.trip_invites(trip_id);