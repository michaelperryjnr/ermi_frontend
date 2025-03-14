"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, MapPin, Users } from "lucide-react";
import type { Event } from "@/types";
import { formatTime } from "@/lib";

interface EventSummaryProps {
  event: Event;
  onSelect: (event: Event) => void;
  userRsvp: { [eventId: string]: string };
}

export default function EventSummary({
  event,
  onSelect,
  userRsvp,
}: EventSummaryProps) {
  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
      onClick={() => onSelect(event)}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: event.color }}
        ></div>
        <Badge variant="outline">{event.department}</Badge>
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
        {new Date(event.date) < new Date() && (
          <Badge variant="destructive">Past Event</Badge>
        )}
      </div>
      <h3 className="font-bold text-lg">{event.title}</h3>
      <div className="space-y-1 text-sm text-muted-foreground mt-2">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <span>{event.rsvpCount.yes} attending</span>
        </div>
      </div>

      {/* Attendee avatars */}
      {event.attendees && event.attendees.length > 0 && (
        <div className="mt-3">
          <div className="flex -space-x-2 overflow-hidden">
            {event.attendees.slice(0, 5).map((attendee) => (
              <TooltipProvider key={attendee.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={attendee.image} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{attendee.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {event.attendees.length > 5 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{event.attendees.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
