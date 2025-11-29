-- Fix RLS policy recursion by using security definer function
-- Create function to check if user can access trip via collaboration
CREATE OR REPLACE FUNCTION public.user_can_access_trip(_user_id uuid, _trip_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trip_collaborators
    WHERE trip_id = _trip_id
      AND user_id = _user_id
  )
$$;

-- Create function to check if user can edit trip
CREATE OR REPLACE FUNCTION public.user_can_edit_trip(_user_id uuid, _trip_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trip_collaborators
    WHERE trip_id = _trip_id
      AND user_id = _user_id
      AND role = 'editor'
  )
$$;

-- Drop old policies that cause recursion
DROP POLICY IF EXISTS "Users can view trips they collaborate on" ON public.trips;
DROP POLICY IF EXISTS "Editors can update trips" ON public.trips;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view trips they collaborate on"
ON public.trips
FOR SELECT
TO authenticated
USING (public.user_can_access_trip(auth.uid(), id));

CREATE POLICY "Editors can update trips"
ON public.trips
FOR UPDATE
TO authenticated
USING (public.user_can_edit_trip(auth.uid(), id));