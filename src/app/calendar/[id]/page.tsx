"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  Share2,
  CalendarPlus,
  ArrowLeft,
} from "lucide-react";
import {
  CalendarDialog,
  RsvpDialog,
  NotificationDialog,
  type NotificationSettings,
} from "@/components/events";
import type { Event } from "@/types";
import {
  formatDate,
  formatTime,
  generateShareableUrl,
  generateGoogleCalendarUrl,
  generateICalContent,
} from "@/lib";
import Data from "@/data";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [userRsvp, setUserRsvp] = useState<{ [key: string]: string }>({});
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<{
    [key: string]: NotificationSettings;
  }>({});

  // Fetch event data
  useEffect(() => {
    // In a real app, you would fetch this from an API
    const foundEvent = Data.events.find((e) => e.id === eventId);

    if (foundEvent) {
      setEvent(foundEvent);

      // Find related events (same department)
      const related = Data.events
        .filter(
          (e) => e.id !== eventId && e.department === foundEvent.department
        )
        .slice(0, 3);

      setRelatedEvents(related);
    } else {
      // Event not found, redirect to calendar
      router.push("/calendar");
    }
  }, [eventId, router]);

  // Handle RSVP
  const handleRsvp = (
    eventId: string,
    response: string,
    email?: string,
    guests?: string,
    requests?: string
  ) => {
    setUserRsvp({ ...userRsvp, [eventId]: response });
    setIsRsvpDialogOpen(false);

    toast({
      title: "RSVP Submitted",
      description: `You have responded ${response} to ${event?.title}`,
    });
  };

  // Handle notification settings
  const handleNotificationSave = (settings: NotificationSettings) => {
    if (!event) return;

    setNotificationSettings({
      ...notificationSettings,
      [event.id]: settings,
    });

    setIsNotifyDialogOpen(false);
    toast({
      title: "Notification Settings Saved",
      description: "You will be notified according to your preferences",
    });
  };

  // Handle share
  const handleShare = () => {
    if (!event) return;

    const shareUrl = generateShareableUrl(event);

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join us for ${event.title} on ${formatDate(
          new Date(event.date)
        )} at ${event.startTime}`,
        url: shareUrl,
      });
    } else {
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard",
        });
      });
    }
  };

  // Handle add to calendar
  const handleAddToGoogleCalendar = () => {
    if (!event) return;
    window.open(generateGoogleCalendarUrl(event), "_blank");
  };

  const downloadICalFile = (event: Event) => {
    const icalContent = generateICalContent(event);
    const blob = new Blob([icalContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          className="mb-6 group"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Details */}
          <div className="lg:col-span-2">
            <Card>
              <div
                className="h-3"
                style={{ backgroundColor: event.color }}
              ></div>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{event.department}</Badge>
                      {event.recurring && (
                        <Badge variant="secondary">Recurring Event</Badge>
                      )}
                      {new Date(event.date) < new Date() && (
                        <Badge variant="destructive">Past Event</Badge>
                      )}
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
                            ? "You're Going"
                            : userRsvp[event.id] === "maybe"
                            ? "You Responded Maybe"
                            : "You're Not Going"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNotifyDialogOpen(true)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notify Me
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{formatDate(new Date(event.date))}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-2">
                    <Button
                      onClick={() => setIsRsvpDialogOpen(true)}
                      className="w-full"
                    >
                      {userRsvp[event.id]
                        ? "Update RSVP"
                        : "RSVP to this Event"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCalendarDialogOpen(true)}
                      className="w-full"
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-lg mb-2">About this Event</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-lg mb-4">
                    Attendance ({event.rsvpCount.yes} attending)
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.attendees &&
                      event.attendees.map((attendee) => (
                        <TooltipProvider key={attendee.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-10 w-10 border-2 border-background">
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
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedEvents.length > 0 ? (
                  relatedEvents.map((relatedEvent) => (
                    <div
                      key={relatedEvent.id}
                      className="flex gap-3 group cursor-pointer"
                      onClick={() =>
                        router.push(`/calendar/${relatedEvent.id}`)
                      }
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: `${relatedEvent.color}40` }}
                        ></div>
                        <div
                          className="absolute top-0 left-0 w-full h-1"
                          style={{ backgroundColor: relatedEvent.color }}
                        ></div>
                      </div>
                      <div>
                        <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {relatedEvent.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(relatedEvent.date))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(relatedEvent.startTime)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No related events found
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Event Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="font-medium">{event.location}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  123 Faith Avenue, Cityville, ST 12345
                </p>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Organizer"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Eternal Redemption Ministry</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.department} Department
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialogs */}
        <RsvpDialog
          event={event}
          open={isRsvpDialogOpen}
          onOpenChange={setIsRsvpDialogOpen}
          userRsvp={userRsvp}
          onRsvpSubmit={handleRsvp}
        />

        <CalendarDialog
          event={event}
          open={isCalendarDialogOpen}
          onOpenChange={setIsCalendarDialogOpen}
        />

        <NotificationDialog
          event={event}
          open={isNotifyDialogOpen}
          onOpenChange={setIsNotifyDialogOpen}
          onSave={handleNotificationSave}
          initialSettings={notificationSettings[event.id]}
        />
      </motion.div>
    </div>
  );
}
