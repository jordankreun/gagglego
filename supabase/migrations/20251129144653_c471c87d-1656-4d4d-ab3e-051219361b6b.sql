-- Add missing UPDATE policy on trip_collaborators table
CREATE POLICY "Trip owners can update collaborators"
ON public.trip_collaborators
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE trips.id = trip_collaborators.trip_id
    AND trips.user_id = auth.uid()
  )
);