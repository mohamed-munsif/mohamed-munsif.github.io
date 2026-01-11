# Supabase Migration Guide

## Overview
This project has been migrated from Google Apps Script to Supabase for better performance, real-time capabilities, and a more robust database solution.

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Sign up/sign in and create a new project
3. Wait for the project to be fully provisioned

### 2. Set up the Database
1. In your Supabase dashboard, go to the SQL Editor
2. Run the SQL commands from `supabase-setup.sql` to create the `study_entries` table

### 3. Configure Environment Variables
1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon public key
3. Update the `.env.local` file with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Database Schema
The `study_entries` table has the following structure:
- `id`: Primary key (auto-increment)
- `date`: Date of the study session (DATE)
- `hours`: Hours studied (INTEGER)
- `minutes`: Minutes studied (INTEGER)
- `topics`: Topics studied (TEXT)
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last updated

### 5. API Endpoints
The API now supports both GET and POST operations:

#### GET `/api/study-data`
Fetches all study entries from Supabase, sorted by date (newest first).

#### POST `/api/study-data`
Creates a new study entry. Requires JSON body with:
```json
{
  "date": "2024-01-15",
  "hours": 2,
  "minutes": 30,
  "topics": "React, TypeScript"
}
```

### 6. Data Migration (if needed)
If you have existing data in Google Apps Script/Sheets, you can:
1. Export your data from Google Sheets as CSV
2. Use Supabase's CSV import feature in the Table Editor
3. Or manually insert data using the Supabase dashboard

### 7. Security Considerations
- The current setup uses the anon key for simplicity
- For production, consider implementing Row Level Security (RLS)
- Uncomment the RLS policies in `supabase-setup.sql` if needed
- Consider implementing authentication if required

## Benefits of Supabase Migration
- **Real-time updates**: Automatic UI updates when data changes
- **Better performance**: Direct database queries instead of HTTP calls to Google Apps Script
- **Offline support**: Built-in caching and offline capabilities
- **Type safety**: Full TypeScript support with generated types
- **Scalability**: PostgreSQL database that can handle more complex queries
- **Authentication**: Built-in auth system if needed in the future
