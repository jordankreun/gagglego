-- Create trips table for saving itineraries
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  families JSONB NOT NULL,
  itinerary JSONB NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  progress JSONB DEFAULT '{"completed": []}'::jsonb,
  share_code TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trip_collaborators table for sharing
CREATE TABLE public.trip_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- Enable RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS policies for trips
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public trips"
  ON public.trips FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view trips they collaborate on"
  ON public.trips FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_collaborators
      WHERE trip_collaborators.trip_id = trips.id
      AND trip_collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Editors can update trips"
  ON public.trips FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_collaborators
      WHERE trip_collaborators.trip_id = trips.id
      AND trip_collaborators.user_id = auth.uid()
      AND trip_collaborators.role = 'editor'
    )
  );

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for trip_collaborators
CREATE POLICY "Users can view collaborators on their trips"
  ON public.trip_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_collaborators.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own collaborations"
  ON public.trip_collaborators FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Trip owners can add collaborators"
  ON public.trip_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_collaborators.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip owners can remove collaborators"
  ON public.trip_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_collaborators.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_collaborators;

-- Update trigger for trips
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();