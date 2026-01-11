import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }

    // Optimized query: only select needed fields and add proper caching
    const { data: studyEntries, error } = await supabaseAdmin
      .from('streak_data')
      .select('Date, Hours, Minutes, Topics') // Only select needed fields
      .order('Date', { ascending: false })
      .limit(365); // Limit to last year of data for performance

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!studyEntries) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'CDN-Cache-Control': 'public, s-maxage=60',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
        }
      });
    }

    // Convert the data format to match what the app expects
    const processedData = studyEntries.map((entry) => {
      // Ensure date is in YYYY-MM-DD format
      let dateStr = entry.Date;  // Using capital D to match your table
      if (entry.Date && entry.Date.includes('T')) {
        // If it's a full timestamp, extract just the date part
        dateStr = entry.Date.split('T')[0];
      }
      
      return {
        date: dateStr,
        hours: parseInt(String(entry.Hours || 0)),  // Using capital H to match your table
        minutes: parseInt(String(entry.Minutes || 0)),  // Using capital M to match your table
        topics: String(entry.Topics || '')  // Using singular 'topic' to match your table
      };
    });
    
    console.log('Processed study data:', processedData.length, 'entries');
    
    return NextResponse.json(processedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
      }
    });
  } catch (error) {
    console.error('Error fetching study data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch study data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, hours, minutes, topics } = body;

    // Validate required fields
    if (!date || hours === undefined || minutes === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: date, hours, minutes' },
        { status: 400 }
      );
    }

    // Insert data into Supabase (using your table structure)
    const { data, error } = await supabaseAdmin
      .from('streak_data')
      .insert([
        {
          Date: date,  // Using capital D to match your table (primary key)
          Hours: parseInt(String(hours)),  // Using capital H to match your table
          Minutes: parseInt(String(minutes)),  // Using capital M to match your table
          Topics: String(topics || '')  // Using capital T to match your table
        }
      ])
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error adding study data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add study data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
