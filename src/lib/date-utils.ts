/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Format a Date object to YYYY-MM-DD string using local time
 * This avoids timezone issues that can occur with toISOString()
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return formatDateToString(new Date());
}

/**
 * Get yesterday's date as YYYY-MM-DD string
 */
export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToString(yesterday);
}

/**
 * Create a date string for a specific day in a given month/year
 */
export function formatDayInMonth(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Parse a date string (YYYY-MM-DD) to a Date object
 * Adds time to avoid timezone issues
 */
export function parseLocalDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}
