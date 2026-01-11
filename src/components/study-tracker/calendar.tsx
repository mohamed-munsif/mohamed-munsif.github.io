import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { StudyEntry } from '@/hooks/use-study-data';
import { Calendar as CalendarIcon, BookOpen, Clock, Target } from 'lucide-react';
import { useStudyDetails } from '@/hooks/use-study-details';
import { formatDateToString } from '@/lib/date-utils';

interface StudyCalendarProps {
  studyData: StudyEntry[];
}

const DAILY_GOAL = 120; // 2 hours in minutes

export function StudyCalendar({ studyData }: StudyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { selectedDate: selectedDateString, setSelectedDate: setSelectedDateString } = useStudyDetails();

  const getStudyDataForDate = (date: Date) => {
    const dateStr = formatDateToString(date);
    const entries = studyData.filter(d => d.date === dateStr);
    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);
    
    return {
      entries,
      totalMinutes,
      hasData: entries.length > 0
    };
  };

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return '';
    if (minutes < 30) return 'bg-primary/20 text-primary-foreground';
    if (minutes < 60) return 'bg-primary/40 text-primary-foreground';
    if (minutes < 120) return 'bg-primary/60 text-primary-foreground';
    return 'bg-primary text-primary-foreground';
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = formatDateToString(date);
      setSelectedDateString(dateStr);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get details for selected date
  const getSelectedDateDetails = () => {
    if (!selectedDateString) return null;
    
    const entries = studyData.filter(d => d.date === selectedDateString);
    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);
    const goalProgress = Math.min((totalMinutes / DAILY_GOAL) * 100, 100);
    
    return {
      entries,
      totalMinutes,
      goalProgress,
      hasData: entries.length > 0
    };
  };

  const selectedDetails = getSelectedDateDetails();

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
          <CalendarIcon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Study Calendar & Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calendar Section */}
        <Card className="p-4 border border-border bg-card">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground mb-1">Calendar</h3>
            <p className="text-xs text-muted-foreground">Click on any day to see study details</p>
          </div>
          
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              showOutsideDays={true}
              className="rounded-md border-none"
              components={{
                DayButton: ({ day, ...props }) => {
                  const { totalMinutes, hasData } = getStudyDataForDate(day.date);
                  const intensityClass = getIntensityClass(totalMinutes);
                  
                  // Check if this is today's date
                  const today = new Date();
                  const isToday = day.date.getDate() === today.getDate() && 
                                 day.date.getMonth() === today.getMonth() && 
                                 day.date.getFullYear() === today.getFullYear();
                  
                  return (
                    <div className="relative group">
                      <button
                        {...props}
                        className={`
                          relative w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 
                          hover:scale-105 group-hover:z-10
                          ${intensityClass}
                          ${isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                          ${props.className || ''}
                        `}
                      >
                        {day.date.getDate()}
                      </button>
                      
                      {/* Tooltip */}
                      {hasData && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                          {formatTime(totalMinutes)}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-xs">Activity:</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-muted/30"></div>
                <span className="text-xs">None</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-primary/20"></div>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-primary/40"></div>
                <span className="text-xs">Med</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-primary/60"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-primary"></div>
                <span className="text-xs">Max</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Details Section */}
        <Card className="p-4 border border-border bg-card">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground mb-1">Study Details</h3>
            {selectedDateString && (
              <p className="text-xs text-muted-foreground">
                {new Date(selectedDateString + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          {!selectedDetails ? (
            <div className="bg-muted/20 p-4 rounded-lg text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-sm font-medium text-foreground mb-2">Select a Date</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Click on any date in the calendar to view study details.
              </p>
              <div className="bg-muted/50 p-2 rounded text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Study Goal:</span>
                  <span className="font-medium text-foreground">{formatTime(DAILY_GOAL)}</span>
                </div>
              </div>
            </div>
          ) : !selectedDetails.hasData ? (
            <div className="bg-muted/20 p-4 rounded-lg text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-sm font-medium text-foreground mb-2">No Study Sessions</h4>
              <p className="text-xs text-muted-foreground mb-3">
                No study sessions recorded for this date.
              </p>
              <div className="bg-muted/50 p-2 rounded text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Study Goal:</span>
                  <span className="font-medium text-foreground">{formatTime(DAILY_GOAL)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Total Time</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{formatTime(selectedDetails.totalMinutes)}</span>
                </div>
                <div className="bg-muted/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Progress</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{Math.round(selectedDetails.goalProgress)}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Goal Progress</span>
                  <span className="font-medium text-foreground">
                    {formatTime(selectedDetails.totalMinutes)} / {formatTime(DAILY_GOAL)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(selectedDetails.goalProgress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-primary" />
                  {selectedDetails.entries.length === 1 ? 'Study Session' : `Sessions (${selectedDetails.entries.length})`}
                </h4>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {selectedDetails.entries.map((entry, index) => (
                    entry.topics.split(',').map((topic, topicIndex) => (
                      <div key={`${index}-${topicIndex}`} className="text-sm text-muted-foreground">
                        • {topic.trim()}
                      </div>
                    ))
                  )).flat()}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

export default StudyCalendar;
