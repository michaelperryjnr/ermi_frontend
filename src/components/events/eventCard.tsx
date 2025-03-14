"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Event } from "@/types";
import { formatDate, formatTime } from "@/lib";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  userRsvp: { [eventId: string]: string };
  onRsvpClick: (event: Event) => void;
}

// Update the event card to show recurring information
export default function EventCard({
  event,
  userRsvp,
  onRsvpClick,
}: EventCardProps) {
  // Check if this is a recurring event occurrence
  const isRecurringOccurrence = event.recurring && event.originalDate;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-2" style={{ backgroundColor: event.color }}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{event.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{event.department}</Badge>
              {event.recurring && (
                <Badge variant="secondary">
                  {isRecurringOccurrence ? "Recurring" : "Recurring Series"}
                </Badge>
              )}
              {new Date(event.date) < new Date() && (
                <Badge variant="destructive">Past Event</Badge>
              )}
            </div>
          </div>
          {userRsvp[event.id] && (
            <Badge
              variant={
                userRsvp[event.id] === "yes"
                  ? "default"
                  : userRsvp[event.id] === "maybe"
                  ? "outline"
                  : "secondary"
              }
            >
              {userRsvp[event.id] === "yes"
                ? "Going"
                : userRsvp[event.id] === "maybe"
                ? "Maybe"
                : "Not Going"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(new Date(event.date))}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.rsvpCount.yes} attending</span>
          </div>
        </div>

        <p className="mt-3 text-sm line-clamp-2">{event.description}</p>

        {/* Attendee avatars */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="mt-3">
            <div className="flex -space-x-2 overflow-hidden">
              {event.attendees.slice(0, 5).map((attendee, index) => (
                <Avatar
                  key={index}
                  className="h-6 w-6 border-2 border-background"
                >
                  <AvatarImage src={attendee.image} alt={attendee.name} />
                  <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {event.attendees.length > 5 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{event.attendees.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/calendar?event=${event.id}`}>View Details</Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onRsvpClick(event);
          }}
        >
          {userRsvp[event.id] ? "Update RSVP" : "RSVP"}
        </Button>
      </CardFooter>
    </Card>
  );
}
