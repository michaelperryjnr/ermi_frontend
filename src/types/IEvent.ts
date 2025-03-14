export interface Attendee {
  id: string;
  name: string;
  image: string;
}

export interface EventRsvpCount {
  yes: number;
  maybe: number;
  no: number;
}

export type RecurringType =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";
export type WeekDay = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface RecurringConfig {
  type: RecurringType;
  endDate: string | "always"; // ISO date string or "always"
  weekDays?: WeekDay[]; // For weekly recurring events on specific days
  interval?: number; // For every X days/weeks/months/years
  times?: string[]; // For custom recurring events with specific times (HH:MM format)
}

// Add originalDate property to Event interface to track recurring event occurrences
export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  originalDate?: string; // Original date for recurring events
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  location: string;
  description: string;
  department: string;
  color: string;
  featured?: boolean;
  image?: string;
  rsvpCount: EventRsvpCount;
  attendees?: Attendee[];
  recurring: boolean;
  recurringConfig?: RecurringConfig;
}
