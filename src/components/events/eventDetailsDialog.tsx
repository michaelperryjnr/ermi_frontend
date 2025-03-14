"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  Share2,
  CalendarPlus,
  X,
} from "lucide-react";
import type { Event } from "@/types";
import { formatDate, formatTime } from "@/lib";

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRsvp: { [eventId: string]: string };
  onRsvpClick: () => void;
  onNotifyClick: () => void;
  onShareClick: () => void;
  onCalendarClick: () => void;
}

export default function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  userRsvp,
  onRsvpClick,
  onNotifyClick,
  onShareClick,
  onCalendarClick,
}: EventDetailsDialogProps) {
  if (!event) return null;

  // Check if this is a recurring event occurrence
  const isRecurringOccurrence = event.recurring && event.originalDate;

  const [disableFooterBtns, setDisableFooterBtns] = useState(false);

  useEffect(() => {
    if (new Date(event.date) < new Date()) {
      setDisableFooterBtns(true);
    }
  });

  // Format the recurring pattern for display
  const formatRecurringPattern = () => {
    if (!event.recurringConfig) return "Recurring Event";

    const { type, interval = 1, weekDays, endDate } = event.recurringConfig;

    let pattern = "";
    switch (type) {
      case "daily":
        pattern = interval === 1 ? "Daily" : `Every ${interval} days`;
        break;
      case "weekly":
        if (weekDays && weekDays.length > 0) {
          const days = weekDays
            .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
            .join(", ");
          pattern =
            interval === 1
              ? `Weekly on ${days}`
              : `Every ${interval} weeks on ${days}`;
        } else {
          pattern = interval === 1 ? "Weekly" : `Every ${interval} weeks`;
        }
        break;
      case "monthly":
        pattern = interval === 1 ? "Monthly" : `Every ${interval} months`;
        break;
      case "yearly":
        pattern = interval === 1 ? "Yearly" : `Every ${interval} years`;
        break;
      case "custom":
        pattern = "Custom schedule";
        break;
      default:
        pattern = "Recurring Event";
    }

    if (endDate !== "always") {
      pattern += ` until ${formatDate(new Date(endDate))}`;
    }

    return pattern;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: event.color }}
              ></div>
              <DialogTitle>{event.title}</DialogTitle>
              {new Date(event.date) < new Date() && (
                <Badge variant="destructive" className="ml-2">
                  Past Event
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(new Date(event.date))}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.department}</span>
          </div>
          {event.recurring && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatRecurringPattern()}
                {isRecurringOccurrence && (
                  <span className="ml-1 text-muted-foreground">
                    (Series started on{" "}
                    {formatDate(new Date(event.originalDate || event.date))})
                  </span>
                )}
              </span>
            </div>
          )}
          <div className="pt-2">
            <p className="text-sm">{event.description}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">
              Attendance ({event.rsvpCount.yes} attending)
            </h4>
            <div className="flex flex-wrap -space-x-6 gap-2 mb-4">
              {event.attendees &&
                event.attendees.slice(0, 8).map((attendee) => (
                  <TooltipProvider key={attendee.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage
                            src={attendee.image}
                            alt={attendee.name}
                          />
                          <AvatarFallback>
                            {attendee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{attendee.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              {event.attendees && event.attendees.length > 8 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{event.attendees.length - 8}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Badge variant="default" className="bg-green-500">
                  Yes
                </Badge>
                <span>{event.rsvpCount.yes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline">Maybe</Badge>
                <span>{event.rsvpCount.maybe}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary">No</Badge>
                <span>{event.rsvpCount.no}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={disableFooterBtns}
              onClick={onNotifyClick}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify Me
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={disableFooterBtns}
              onClick={onShareClick}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={disableFooterBtns}
              onClick={onRsvpClick}
            >
              {userRsvp[event.id] ? "Update RSVP" : "RSVP"}
            </Button>
          </div>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            disabled={disableFooterBtns}
            onClick={onCalendarClick}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
