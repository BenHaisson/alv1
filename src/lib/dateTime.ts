/**
 * Date/time helpers for the custom booking-bar pickers.
 *
 * BookingState keeps `date`/`time` as plain ISO strings ("YYYY-MM-DD" /
 * "HH:MM", 24h) so they round-trip cleanly — these helpers only handle
 * parsing them for the calendar/list UI and formatting them for display.
 */

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAY_LONG = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export { WEEKDAY_LABELS };

/** Local-time midnight for "today" — never UTC, so date comparisons match what the user sees. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Parses "YYYY-MM-DD" as a local date (never UTC — avoids off-by-one-day shifts). */
export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "Wed, Jul 15" */
export function formatDateDisplay(value: string): string | null {
  const date = parseISODate(value);
  if (!date) return null;
  return `${WEEKDAY_LONG[date.getDay()]}, ${MONTH_LONG[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}

/** "July 2026" */
export function formatMonthLabel(monthCursor: Date): string {
  return `${MONTH_LONG[monthCursor.getMonth()]} ${monthCursor.getFullYear()}`;
}

export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
}

/** A full 6-row (42-cell) calendar grid for the given month, weeks starting Sunday. */
export function getCalendarCells(monthCursor: Date): CalendarCell[] {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
  const today = startOfDay(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return {
      date,
      isCurrentMonth: date.getMonth() === month,
      isPast: date.getTime() < today.getTime(),
      isToday: isSameDay(date, today)
    };
  });
}

/** Times in 15-minute intervals across the day, as "HH:MM" 24h values. */
export const TIME_OPTIONS: string[] = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = String(Math.floor(index / 4)).padStart(2, "0");
  const minutes = String((index % 4) * 15).padStart(2, "0");
  return `${hours}:${minutes}`;
});

/** "HH:MM" (24h) -> "02:30 PM" */
export function formatTimeDisplay(value: string): string | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours24 = Number(match[1]);
  const minutes = match[2];
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, "0")}:${minutes} ${period}`;
}
