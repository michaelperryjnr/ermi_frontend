"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  Share2,
  CalendarPlus,
} from "lucide-react";
import type { Event } from "@/types";
import { formatDate, formatTime } from "@/lib";
import { motion } from "framer-motion";
import React from "react";

interface FeaturedEventProps {
  event: Event;
  userRsvp: { [eventId: string]: string };
  onRsvpClick: (event: Event) => void;
  onShareClick: (event: Event) => void;
  onCalendarClick: (event: Event) => void;
  onNotifyClick: (event: Event) => void;
  notificationStatus: { [key: string]: boolean };
  timeLeft?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const FeaturedEvent = ({
  event,
  userRsvp,
  onRsvpClick,
  onShareClick,
  onCalendarClick,
  onNotifyClick,
  notificationStatus,
  timeLeft,
}: FeaturedEventProps) => {
  return (
    <div className="relative bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 dark:from-primary/10 dark:via-secondary/10 dark:to-primary/10 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: event.color }}
            ></div>
            <Badge variant="outline">{event.department}</Badge>
            {event.recurring && (
              <Badge variant="secondary">Recurring Event</Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {event.title}
            {event && new Date(event.date) < new Date() && (
              <Badge variant="destructive" className="ml-2">
                Past Event
              </Badge>
            )}
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg">
                  {formatDate(new Date(event.date))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-lg">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg">
                  {event.rsvpCount.yes} people attending
                </span>
              </div>

              <p className="text-lg mt-4">{event.description}</p>
            </div>

            <div className="flex flex-col justify-between">
              {timeLeft && (
                <div className="bg-card rounded-lg p-6 shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Event Starts In
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-3xl font-bold">{timeLeft.days}</div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-3xl font-bold">{timeLeft.hours}</div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-3xl font-bold">
                        {timeLeft.minutes}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Minutes
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-3xl font-bold">
                        {timeLeft.seconds}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button className="w-full" onClick={() => onRsvpClick(event)}>
                  {userRsvp[event.id] ? "Update RSVP" : "RSVP Now"}
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onNotifyClick(event)}
                  >
                    <Bell
                      className={`h-5 w-5 ${
                        notificationStatus[event.id] ? "fill-primary" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" onClick={() => onShareClick(event)}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onCalendarClick(event)}
                  >
                    <CalendarPlus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {event.attendees && event.attendees.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Attendees</h3>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-2 bg-card p-2 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={attendee.image} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm pr-2">{attendee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(FeaturedEvent);
