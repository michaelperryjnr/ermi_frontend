import {
  format,
  isLeapYear,
  isToday as isDateToday,
  isSameDay,
  addDays,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  getDay,
  getDaysInMonth,
  isLastDayOfMonth,
  isSameMonth,
} from "date-fns";
import type { Event, WeekDay } from "@/types";

// Format a date into "Monday, January 1, 2025"
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "EEEE, MMMM d, yyyy");
};

// Format a time string from "13:30" to "1:30 PM"
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const hour = Number.parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Generate days for a calendar grid (including empty slots for alignment)
export const generateCalendarDays = (
  year: number,
  month: number
): (number | null)[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInCurrentMonth = getDaysInMonth(firstDayOfMonth);
  const firstDayOfWeek = getDay(firstDayOfMonth);
  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    calendarDays.push(day);
  }
  return calendarDays;
};

// Check if a given date is today
export const isToday = (date: Date): boolean => isDateToday(date);

// Check if a date matches a specific weekday (e.g., "mon", "tue")
export const matchesWeekday = (date: Date, weekday: WeekDay): boolean => {
  const dayMap: Record<WeekDay, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };
  return getDay(date) === dayMap[weekday];
};

// Check if an event occurs on a specific date (recurring or one-time events)
export const eventOccursOnDate = (event: Event, date: Date): boolean => {
  const eventDate = new Date(`${event.date}T${event.startTime}`);
  if (!event.recurring) return isSameDay(eventDate, date);
  const config = event.recurringConfig;
  if (!config) return false;

  if (config.endDate !== "always" && date > new Date(config.endDate))
    return false;
  if (date < eventDate) return false;

  switch (config.type) {
    case "daily":
      return differenceInDays(date, eventDate) % (config.interval || 1) === 0;
    case "weekly":
      const weekDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
        getDay(date)
      ] as WeekDay;
      if (config.weekDays?.length && !config.weekDays.includes(weekDay))
        return false;
      return differenceInWeeks(date, eventDate) % (config.interval || 1) === 0;
    case "monthly":
      return (
        (date.getDate() === eventDate.getDate() ||
          (isLastDayOfMonth(eventDate) && isLastDayOfMonth(date))) &&
        differenceInMonths(date, eventDate) % (config.interval || 1) === 0
      );
    case "yearly":
      const isLeapDayEvent =
        eventDate.getMonth() === 1 && eventDate.getDate() === 29;
      return (
        (isLeapDayEvent && !isLeapYear(date)
          ? date.getMonth() === 1 && date.getDate() === 28
          : date.getDate() === eventDate.getDate() &&
            date.getMonth() === eventDate.getMonth()) &&
        differenceInYears(date, eventDate) % (config.interval || 1) === 0
      );
    default:
      return false;
  }
};

// Get all events for a specific date
export const getEventsForDate = (events: Event[], date: Date): Event[] => {
  return events
    .filter((event) => eventOccursOnDate(event, date))
    .map((event) =>
      event.recurring
        ? {
            ...event,
            originalDate: event.date,
            date: format(date, "yyyy-MM-dd"),
          }
        : event
    );
};

// Get all events for a month, avoiding duplicates
export const getEventsForMonth = (
  events: Event[],
  year: number,
  month: number
): Event[] => {
  const result: Event[] = [];
  const lastDay = new Date(year, month + 1, 0);
  const processedEventIds = new Set<string>();

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    getEventsForDate(events, date).forEach((event) => {
      const occurrenceId = event.recurring
        ? `${event.id}-${format(date, "yyyy-MM-dd")}`
        : event.id;
      if (!processedEventIds.has(occurrenceId)) {
        processedEventIds.add(occurrenceId);
        result.push(event);
      }
    });
  }
  return result;
};

// Generate a Google Calendar event link
export const generateGoogleCalendarUrl = (event: Event): string => {
  const startDate = new Date(`${event.date}T${event.startTime}`);
  const endDate = new Date(`${event.date}T${event.endTime}`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, "")}/${endDate
    .toISOString()
    .replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
};

// Generate iCalendar (.ics) content for an event
export const generateICalContent = (event: Event): string => {
  const startDate = new Date(`${event.date}T${event.startTime}`);
  const endDate = new Date(`${event.date}T${event.endTime}`);
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTAMP:${new Date()
    .toISOString()
    .replace(/-|:|\.\d+/g, "")}\nDTSTART:${format(
    startDate,
    "yyyyMMdd'T'HHmmss'Z'"
  )}\nDTEND:${format(endDate, "yyyyMMdd'T'HHmmss'Z'")}\nSUMMARY:${
    event.title
  }\nDESCRIPTION:${event.description}\nLOCATION:${
    event.location
  }\nEND:VEVENT\nEND:VCALENDAR`;
};

// Download an iCal file for an event
export const downloadICalFile = (event: Event): void => {
  const icalContent = generateICalContent(event);
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate a shareable event URL
export const generateShareableUrl = (event: Event): string => {
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  return `${baseUrl}/calendar?id=${event.id}`;
};
