-- Add date fields to family_preferences for saving complete trip configurations
ALTER TABLE public.family_preferences
ADD COLUMN start_date date,
ADD COLUMN end_date date;

COMMENT ON COLUMN public.family_preferences.start_date IS 'Start date for the trip configuration';
COMMENT ON COLUMN public.family_preferences.end_date IS 'End date for the trip configuration';