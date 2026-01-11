import React from 'react';
import { Card } from '@/components/ui/card';
import { StudyEntry } from '@/hooks/use-study-data';
import { Flame, Target, Calendar, Trophy, Clock, TrendingUp } from 'lucide-react';
import { getTodayString, getYesterdayString } from '@/lib/date-utils';
import { SkeletonDemo } from '@/components/ui/skeleton';

interface StudyMetricsProps {
  studyData: StudyEntry[];
}

const DAILY_GOAL = 120; // 2 hours in minutes

// Memoized component to prevent unnecessary re-renders
const StudyMetricsComponent = ({ studyData }: StudyMetricsProps) => {
  const calculateStreaks = React.useMemo(() => {
    if (studyData.length === 0) return { current: 0, highest: 0, last: 0 };
    
    // Sort dates in ascending order (oldest first)
    const sortedDates = studyData
      .map(d => d.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    const uniqueDates = [...new Set(sortedDates)].sort();
    
    const streaks: number[] = [];
    let currentStreak = 1;
    
    // Calculate all streaks
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i] + 'T00:00:00');
      const prevDate = new Date(uniqueDates[i - 1] + 'T00:00:00');
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        streaks.push(currentStreak);
        currentStreak = 1;
      }
    }
    streaks.push(currentStreak);
    
    const highestStreak = Math.max(...streaks);
    
    // Calculate current streak (from most recent data)
    const todayStr = getTodayString();
    const yesterdayStr = getYesterdayString();
    const hasRecentData = uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr);
    
    let currentActiveStreak = 0;
    if (hasRecentData) {
      const recentDates = [...uniqueDates].reverse();
      currentActiveStreak = 1;
      let currentDate = new Date(recentDates[0] + 'T00:00:00');
      
      for (let i = 1; i < recentDates.length; i++) {
        const prevDate = new Date(recentDates[i] + 'T00:00:00');
        const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentActiveStreak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }
    }
    
    // Calculate last streak (previous streak before current one)
    let lastStreak = 0;
    if (streaks.length > 1) {
      if (currentActiveStreak > 0) {
        // If we have a current streak, last streak is the second to last completed streak
        const completedStreaks = streaks.slice(0, -1);
        lastStreak = completedStreaks.length > 0 ? completedStreaks[completedStreaks.length - 1] : 0;
      } else {
        // If no current streak, last streak is the most recent completed streak
        lastStreak = streaks[streaks.length - 1];
      }
    }
    
    return {
      current: currentActiveStreak,
      highest: highestStreak,
      last: lastStreak
    };
  }, [studyData]); // Only recalculate when studyData changes

  const getTodayStudyTime = React.useMemo(() => {
    const todayStr = getTodayString();
    const todayEntries = studyData.filter(entry => entry.date === todayStr);
    return todayEntries.reduce((total, entry) => total + (entry.hours * 60) + entry.minutes, 0);
  }, [studyData]);

  const getTotalStudyTime = React.useMemo(() => {
    return studyData.reduce((total, entry) => total + (entry.hours * 60) + entry.minutes, 0);
  }, [studyData]);

  const getAverageDaily = React.useMemo(() => {
    const totalMinutes = studyData.reduce((total, entry) => total + (entry.hours * 60) + entry.minutes, 0);
    const uniqueDates = new Set(studyData.map(entry => entry.date));
    const studyDays = uniqueDates.size;
    return studyDays > 0 ? Math.round(totalMinutes / studyDays) : 0;
  }, [studyData]);

  const formatTime = React.useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }, []);

  const goalProgress = React.useMemo(() => {
    return Math.min((getTodayStudyTime / DAILY_GOAL) * 100, 100);
  }, [getTodayStudyTime]);

  const metrics = React.useMemo(() => [
    {
      title: 'Current Streak',
      value: `${calculateStreaks.current} days`,
      icon: Flame,
      description: 'Consecutive study days',
      color: 'text-orange-500'
    },
    {
      title: 'Highest Streak',
      value: `${calculateStreaks.highest} days`,
      icon: Trophy,
      description: 'Best streak achieved',
      color: 'text-yellow-500'
    },
    {
      title: 'Last Streak',
      value: `${calculateStreaks.last} days`,
      icon: Calendar,
      description: 'Previous streak record',
      color: 'text-green-500'
    },
    {
      title: 'Today\'s Progress',
      value: `${formatTime(getTodayStudyTime)}/${formatTime(DAILY_GOAL)}`,
      icon: Target,
      description: `${goalProgress.toFixed(0)}% of daily study goal`,
      color: 'text-blue-500'
    },
    {
      title: 'Total Time',
      value: formatTime(getTotalStudyTime),
      icon: Clock,
      description: 'All study sessions',
      color: 'text-purple-500'
    },
    {
      title: 'Daily Average',
      value: formatTime(getAverageDaily),
      icon: TrendingUp,
      description: 'Average time per study day',
      color: 'text-indigo-500'
    }
  ], [calculateStreaks, getTodayStudyTime, getTotalStudyTime, getAverageDaily, formatTime, goalProgress]);

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Target className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Study Metrics</h2>
      </div>

      {studyData.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <SkeletonDemo />
          <SkeletonDemo />
          <SkeletonDemo />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-3 border border-border bg-card hover:bg-card/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-md bg-muted ${metric.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{metric.title}</p>
                  </div>
                  <p className="text-xl font-bold text-foreground mb-0.5">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
        </div>
      )}
    </section>
  );
};

// Export memoized component
export const StudyMetrics = React.memo(StudyMetricsComponent);