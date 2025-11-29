-- Add RLS policy to allow viewing flock members' profiles
CREATE POLICY "Users can view flock members profiles" ON profiles
FOR SELECT USING (
  id IN (
    SELECT friend_id FROM flock_connections WHERE user_id = auth.uid() AND status = 'accepted'
    UNION
    SELECT user_id FROM flock_connections WHERE friend_id = auth.uid() AND status = 'accepted'
    UNION
    SELECT friend_id FROM flock_connections WHERE user_id = auth.uid() AND status = 'pending'
    UNION
    SELECT user_id FROM flock_connections WHERE friend_id = auth.uid() AND status = 'pending'
  )
);