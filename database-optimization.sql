-- Database Performance Optimization for Streak App
-- Run these commands in your Supabase SQL editor for better performance

-- 1. Create index on Date column for faster sorting and filtering
CREATE INDEX IF NOT EXISTS idx_streak_data_date ON streak_data (Date DESC);

-- 2. Create index for date range queries (if you plan to add filtering by date range)
CREATE INDEX IF NOT EXISTS idx_streak_data_date_range ON streak_data (Date) WHERE Date >= CURRENT_DATE - INTERVAL '1 year';

-- 3. Create partial index for recent data (last 90 days) for even faster queries
CREATE INDEX IF NOT EXISTS idx_streak_data_recent ON streak_data (Date DESC, Hours, Minutes) 
WHERE Date >= CURRENT_DATE - INTERVAL '90 days';

-- 4. Update table statistics for better query planning
ANALYZE streak_data;

-- 5. Optional: Create a materialized view for aggregated data (if you have lots of data)
-- This pre-calculates common aggregations for faster loading
/*
CREATE MATERIALIZED VIEW IF NOT EXISTS study_metrics_mv AS
SELECT 
  Date,
  Hours,
  Minutes,
  (Hours * 60 + Minutes) as total_minutes,
  EXTRACT(YEAR FROM Date::date) as year,
  EXTRACT(MONTH FROM Date::date) as month,
  EXTRACT(WEEK FROM Date::date) as week,
  EXTRACT(DOW FROM Date::date) as day_of_week
FROM streak_data
ORDER BY Date DESC;

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_study_metrics_mv_date ON study_metrics_mv (Date DESC);

-- Refresh the materialized view (run this periodically or set up a trigger)
REFRESH MATERIALIZED VIEW study_metrics_mv;
*/
