import useSWR, { mutate as globalMutate } from 'swr';

export interface StudyEntry {
  date: string;
  hours: number;
  minutes: number;
  topics: string;
}

// Optimized fetcher with better error handling
const fetcher = async (url: string): Promise<StudyEntry[]> => {
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data;
};

export function useStudyData() {
  const { data, error, isLoading, mutate } = useSWR<StudyEntry[]>(
    '/api/study-data',
    fetcher,
    {
      // Optimized SWR configuration
      revalidateOnFocus: false, // Don't refetch on window focus
      revalidateOnReconnect: true, // Refetch when reconnecting
      refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      errorRetryCount: 3, // Retry failed requests 3 times
      errorRetryInterval: 1000, // Wait 1 second between retries
      fallbackData: [], // Provide empty array as fallback
      keepPreviousData: true, // Keep previous data while loading new data
    }
  );

  const refreshData = async () => {
    console.log('Refresh button clicked - starting data refresh...');
    try {
      // Force revalidation using both local and global mutate for better reliability
      await mutate();
      await globalMutate('/api/study-data');
      console.log('Data refresh completed successfully');
    } catch (error) {
      console.error('Error during data refresh:', error);
    }
  };

  return {
    studyData: data || [],
    isLoading,
    error: error?.message || null,
    refreshData
  };
}
