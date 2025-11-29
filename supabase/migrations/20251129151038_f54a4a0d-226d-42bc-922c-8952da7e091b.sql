-- Add nest_config and meal_preferences columns to family_preferences table
ALTER TABLE family_preferences
ADD COLUMN IF NOT EXISTS nest_config jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS meal_preferences jsonb DEFAULT '{}'::jsonb;