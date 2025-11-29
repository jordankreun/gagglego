-- Create chat messages table for persistence
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view chat messages for trips they own or collaborate on
CREATE POLICY "Users can view chat for their trips"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trips 
    WHERE trips.id = chat_messages.trip_id 
    AND trips.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM trip_collaborators
    WHERE trip_collaborators.trip_id = chat_messages.trip_id
    AND trip_collaborators.user_id = auth.uid()
  )
);

-- Users can insert chat messages for trips they own or collaborate on (as editors)
CREATE POLICY "Users can insert chat for their trips"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips 
    WHERE trips.id = chat_messages.trip_id 
    AND trips.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM trip_collaborators
    WHERE trip_collaborators.trip_id = chat_messages.trip_id
    AND trip_collaborators.user_id = auth.uid()
    AND trip_collaborators.role = 'editor'
  )
);

-- Create index for faster queries
CREATE INDEX idx_chat_messages_trip_id ON public.chat_messages(trip_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);