-- Create flock connections table for friend relationships
CREATE TABLE public.flock_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Enable RLS
ALTER TABLE public.flock_connections ENABLE ROW LEVEL SECURITY;

-- Users can view their own connections (sent or received)
CREATE POLICY "Users can view their connections"
ON public.flock_connections
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can send connection requests
CREATE POLICY "Users can send connection requests"
ON public.flock_connections
FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Users can update connections they're part of
CREATE POLICY "Users can respond to connection requests"
ON public.flock_connections
FOR UPDATE
USING (auth.uid() = friend_id OR auth.uid() = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete connections"
ON public.flock_connections
FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create index for faster queries
CREATE INDEX idx_flock_user_id ON public.flock_connections(user_id);
CREATE INDEX idx_flock_friend_id ON public.flock_connections(friend_id);
CREATE INDEX idx_flock_status ON public.flock_connections(status);

-- Add trigger for updated_at
CREATE TRIGGER update_flock_connections_updated_at
BEFORE UPDATE ON public.flock_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();