'use client';

import { useEffect, useState } from 'react';
import { StudyMetrics } from '@/components/study-tracker/metrics';
import StudyCalendar from '@/components/study-tracker/calendar';
import { StudyAnalytics } from '@/components/study-tracker/analytics';
import { useStudyData } from '@/hooks/use-study-data';
import { StudyDetailsProvider } from '@/hooks/use-study-details';
import { Clock, ArrowLeft, Brain, TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StreakPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  // Using optimized SWR-based data fetching for better performance
  const { studyData, isLoading, error, refreshData } = useStudyData();

  useEffect(() => {
    // Set initial time on client-side only
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <StudyDetailsProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-[800px] mx-auto p-6">
          {/* Header */}
          <header className="mb-8 pt-24">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('Refresh button clicked in UI');
                  refreshData();
                }}
                disabled={isLoading}
                className="ml-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Study Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track learning journey and progress
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{currentTime ? formatTime(currentTime) : '--:--'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{currentTime ? formatDate(currentTime) : 'Loading...'}</span>
              </div>
            </div>
          </header>

          {/* Simple Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-foreground font-medium mb-2">Loading study data...</p>
                <p className="text-muted-foreground text-sm">Please wait while we fetch your analytics</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive text-sm font-medium">Error: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <div className="space-y-8">
              {/* Metrics */}
              <StudyMetrics studyData={studyData} />
              
              {/* Analytics */}
              <StudyAnalytics studyData={studyData} />
              
              {/* Calendar with integrated Details */}
              <StudyCalendar studyData={studyData} />
            </div>
          )}
        </div>
      </div>
    </StudyDetailsProvider>
  );
}
