-- Add date fields to trips table
ALTER TABLE public.trips 
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS trip_duration_days INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED;

-- Update existing trips to have dates (convert existing date string to start_date)
UPDATE public.trips 
SET start_date = CURRENT_DATE
WHERE start_date IS NULL;

-- Add check constraint for date logic
ALTER TABLE public.trips
ADD CONSTRAINT valid_date_range CHECK (end_date >= start_date);