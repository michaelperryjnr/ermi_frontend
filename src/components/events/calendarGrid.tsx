"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Event } from "@/types";

interface CalendarGridProps {
  events: Event[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventSelect: (event: Event) => void;
  userRsvp: { [eventId: string]: string };
}

const CalendarGrid = ({
  events,
  currentDate,
  onDateChange,
  onEventSelect,
  userRsvp,
}: CalendarGridProps) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Get first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  // Get last day of the month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get total days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Create array of days for the calendar
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Navigation handlers
  const goToPreviousMonth = () => {
    onDateChange(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    onDateChange(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Handle jump to date
  const handleJumpToDate = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
    }
  };

  // Get events for each day, including recurring events
  const getEventsForDay = (day: number) => {
    if (!day) return [];

    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split("T")[0];

    // Get regular events for this day
    const regularEvents = events.filter((event) => event.date === dateString);

    // Get recurring events that should appear on this day
    const recurringEvents = events
      .filter((event) => {
        if (!event.recurring) return false;

        if (event.recurring && event.date === dateString) return false;

        // For simplicity, we'll assume weekly recurring events
        const eventDate = new Date(event.date);

        // Check if the day of week matches - no date restriction for past events
        return eventDate.getDay() === date.getDay();
      })
      .map((event) => {
        // Create a copy of the event with the current date
        return {
          ...event,
          originalDate: event.date, // Store the original date
          date: dateString, // Set to current date in the calendar
        };
      });

    return [...regularEvents, ...recurringEvents];
  };

  // Check if a day is today
  const isTodayDate = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {monthName} {currentYear}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>

            {/* Jump to Date Feature */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Jump to Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleJumpToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-center font-medium border-b mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return (
                <div key={`empty-${index}`} className="min-h-[100px] p-1" />
              );
            }

            const dateString = new Date(currentYear, currentMonth, day)
              .toISOString()
              .split("T")[0];
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[100px] p-1 border rounded-md ${
                  isTodayDate(day)
                    ? "bg-primary/10 border-primary"
                    : hoveredDate === dateString
                    ? "bg-muted/30"
                    : "border-border/50"
                }`}
                onMouseEnter={() => setHoveredDate(dateString)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className="font-medium text-sm mb-1">{day}</div>
                <div className="space-y-1">
                  {dayEvents.map((event, eventIndex) => (
                    <div
                      key={`${event.id}-${eventIndex}`}
                      className="text-xs p-1 rounded cursor-pointer hover:bg-muted/50 transition-colors"
                      style={{ backgroundColor: `${event.color}20` }}
                      onClick={() => onEventSelect(event)}
                    >
                      <div className="flex items-center gap-1">
                        {userRsvp[event.id] === "yes" && (
                          <Check className="h-3 w-3 text-green-500" />
                        )}
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <span className="truncate font-medium">
                          {event.title}
                        </span>
                        {event.recurring && event.originalDate && (
                          <Badge
                            variant="outline"
                            className="ml-auto text-[8px] px-1 py-0"
                          >
                            Recurring
                          </Badge>
                        )}
                      </div>
                      {event.startTime && (
                        <div className="ml-3 truncate">{event.startTime}</div>
                      )}

                      {userRsvp[event.id] && userRsvp[event.id] !== "yes" && (
                        <div className="ml-3 mt-1">
                          <Badge
                            variant={
                              userRsvp[event.id] === "maybe"
                                ? "outline"
                                : "secondary"
                            }
                            className="text-[10px] px-1 py-0"
                          >
                            {userRsvp[event.id] === "maybe"
                              ? "Maybe"
                              : "Not Going"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(CalendarGrid);
