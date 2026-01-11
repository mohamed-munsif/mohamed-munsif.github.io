import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudyEntry } from '@/hooks/use-study-data';
import { BarChart3, Calendar, TrendingUp, Clock } from 'lucide-react';
import { formatDateToString } from '@/lib/date-utils';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useStudyDetails } from '@/hooks/use-study-details';

interface StudyAnalyticsProps {
  studyData: StudyEntry[];
}

type ViewType = 'weekly' | 'monthly' | 'yearly';

// Memoized component to prevent unnecessary re-renders
const StudyAnalyticsComponent = ({ studyData }: StudyAnalyticsProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('weekly');
  const { selectedDate } = useStudyDetails();
  
  // Auto-adjust view when a date is selected from calendar
  useEffect(() => {
    if (selectedDate) {
      // When a calendar date is selected, switch to monthly view to show that month
      setCurrentView('monthly');
    }
  }, [selectedDate]);
  
  // Get the most recent month with data for better initial view
  const getMostRecentMonth = useCallback(() => {
    if (studyData.length === 0) return new Date();
    
    const dates = studyData.map(d => new Date(d.date + 'T00:00:00')).sort((a, b) => b.getTime() - a.getTime());
    return dates[0];
  }, [studyData]);

  const getChartData = useMemo(() => {
    const now = new Date();
    
    if (currentView === 'weekly') {
      // Get current week (Sunday to Saturday) or week containing selected date
      let baseDate = now;
      if (selectedDate) {
        baseDate = new Date(selectedDate + 'T00:00:00');
      }
      
      const startOfWeek = new Date(baseDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const weekData = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayStr = formatDateToString(day);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()];
        
        const logs = studyData.filter(d => d.date === dayStr);
        const totalMinutes = logs.reduce((sum, log) => sum + (log.hours * 60) + log.minutes, 0);
        
        // Highlight the selected date
        const isSelected = selectedDate === dayStr;
        
        return { 
          name: dayName, 
          time: totalMinutes,
          isSelected 
        };
      });
      
      return weekData;
    } else if (currentView === 'monthly') {
      // Show month containing selected date, or current month, or most recent month with data
      let targetMonth, targetYear;
      
      if (selectedDate) {
        // Use the month of the selected date
        const selectedDateObj = new Date(selectedDate + 'T00:00:00');
        targetMonth = selectedDateObj.getMonth();
        targetYear = selectedDateObj.getFullYear();
      } else {
        // Existing logic for current month vs most recent month
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Check if current month has any data
        const currentMonthData = studyData.filter(d => {
          const date = new Date(d.date + 'T00:00:00');
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
        
        if (currentMonthData.length > 0) {
          // Use current month
          targetMonth = currentMonth;
          targetYear = currentYear;
        } else {
          // Fall back to most recent month with data
          const mostRecentDataDate = getMostRecentMonth();
          targetMonth = mostRecentDataDate.getMonth();
          targetYear = mostRecentDataDate.getFullYear();
        }
      }
      
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const monthData = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNumber = i + 1;
        const dayStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        
        const logs = studyData.filter(d => d.date === dayStr);
        const totalMinutes = logs.reduce((sum, log) => sum + (log.hours * 60) + log.minutes, 0);
        
        // Highlight the selected date
        const isSelected = selectedDate === dayStr;
        
        return { 
          name: dayNumber.toString(), 
          time: totalMinutes,
          isSelected 
        };
      });
      
      return monthData;
    } else {
      // Yearly view - show year containing selected date or current year
      let targetYear;
      if (selectedDate) {
        const selectedDateObj = new Date(selectedDate + 'T00:00:00');
        targetYear = selectedDateObj.getFullYear();
      } else {
        targetYear = now.getFullYear();
      }
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const yearData = Array.from({ length: 12 }, (_, i) => {
        const logs = studyData.filter(d => {
          const date = new Date(d.date + 'T00:00:00');
          return date.getMonth() === i && date.getFullYear() === targetYear;
        });
        
        const totalMinutes = logs.reduce((sum, log) => sum + (log.hours * 60) + log.minutes, 0);
        const totalHours = Math.round(totalMinutes / 60);
        
        // Highlight the month containing selected date
        let isSelected = false;
        if (selectedDate) {
          const selectedDateObj = new Date(selectedDate + 'T00:00:00');
          isSelected = selectedDateObj.getMonth() === i && selectedDateObj.getFullYear() === targetYear;
        }
        
        return { 
          name: monthNames[i], 
          time: totalHours,
          isSelected 
        }; // Convert to hours for yearly view
      });
      
      return yearData;
    }
  }, [currentView, selectedDate, studyData, getMostRecentMonth]);

  const data = getChartData;
  const maxValue = Math.max(...data.map((d) => d.time), 1);
  const totalValue = data.reduce((sum: number, item) => sum + item.time, 0);
  const avgValue = Math.round(totalValue / data.length) || 0;

  const getTimeUnit = useCallback(() => {
    return currentView === 'yearly' ? 'hours' : 'minutes';
  }, [currentView]);

  const viewButtons = useMemo(() => [
    { key: 'weekly' as const, label: 'Weekly', icon: Calendar },
    { key: 'monthly' as const, label: 'Monthly', icon: BarChart3 },
    { key: 'yearly' as const, label: 'Yearly', icon: TrendingUp },
  ], []);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Analytics</h2>
      </div>

      <Card className="p-4 border border-border bg-card">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Study Progress ({currentView})
              {selectedDate && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  • Focused on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: currentView === 'yearly' ? 'numeric' : undefined
                  })}
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <span className="text-lg font-bold text-foreground">{totalValue}</span>
                <p className="text-xs text-muted-foreground mt-0.5">Total {getTimeUnit()}</p>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-foreground">{maxValue}</span>
                <p className="text-xs text-muted-foreground mt-0.5">Peak {getTimeUnit()}</p>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-foreground">{avgValue}</span>
                <p className="text-xs text-muted-foreground mt-0.5">Average {getTimeUnit()}</p>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-foreground">{data.length}</span>
                <p className="text-xs text-muted-foreground mt-0.5">Data Points</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {viewButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(key)}
                className="gap-1.5 text-xs px-2 py-1"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full">
          {studyData.length === 0 ? (
            <div className="h-60 bg-muted/20 rounded-lg p-4 border border-border flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-base font-medium text-muted-foreground mb-2">No Study Data</h3>
                <p className="text-xs text-muted-foreground">Start tracking your study sessions to see analytics here.</p>
              </div>
            </div>
          ) : totalValue === 0 ? (
            <div className="h-80 bg-muted/20 rounded-lg p-4 border border-border flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-base font-medium text-muted-foreground mb-2">No Data for {currentView} Period</h3>
                <p className="text-xs text-muted-foreground">
                  Try switching to a different time period or add study entries for this {currentView.replace('ly', '')}.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <ChartContainer config={{
                time: {
                  label: getTimeUnit(),
                  color: "hsl(var(--chart-1))",
                },
              }} className="h-80 w-full">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ 
                      value: getTimeUnit().charAt(0).toUpperCase() + getTimeUnit().slice(1), 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 12 }
                    }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover text-popover-foreground border border-border rounded-lg p-2 shadow-lg">
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-sm">
                              {payload[0].value} {getTimeUnit()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="time" 
                    radius={[2, 2, 0, 0]}
                    className="transition-colors"
                  >
                    {data.map((entry, index: number) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.isSelected ? "hsl(262 83% 58%)" : "hsl(142 76% 36%)"}
                        stroke={entry.isSelected ? "hsl(262 83% 50%)" : "hsl(142 76% 30%)"}
                        strokeWidth={entry.isSelected ? 2 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};

// Export memoized component
export const StudyAnalytics = React.memo(StudyAnalyticsComponent);
