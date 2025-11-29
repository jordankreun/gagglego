-- Add DELETE policy for chat_messages table
-- Allows users to delete their own chat messages
CREATE POLICY "Users can delete their own chat messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);