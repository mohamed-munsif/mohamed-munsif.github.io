-- SQL to create the study_entries table in Supabase
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS study_entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  hours INTEGER NOT NULL DEFAULT 0,
  minutes INTEGER NOT NULL DEFAULT 0,
  topics TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the date column for better query performance
CREATE INDEX IF NOT EXISTS idx_study_entries_date ON study_entries(date);

-- Create a unique constraint to prevent duplicate entries for the same date
-- (uncomment if you want to enforce one entry per date)
-- ALTER TABLE study_entries ADD CONSTRAINT unique_date UNIQUE (date);

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE study_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust based on your authentication needs)
-- Example policy for public access (remove if you want authenticated access only)
-- CREATE POLICY "Allow all operations" ON study_entries FOR ALL USING (true);

-- Example policy for authenticated users only
-- CREATE POLICY "Allow authenticated users" ON study_entries FOR ALL TO authenticated USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at when a row is modified
CREATE TRIGGER update_study_entries_updated_at 
BEFORE UPDATE ON study_entries 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
