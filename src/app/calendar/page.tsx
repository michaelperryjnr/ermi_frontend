"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { HelpCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDialog,
  CalendarGrid,
  EventCard,
  EventDetailsDialog,
  EventSummary,
  FeaturedEvent,
  NotificationDialog,
  RsvpDialog,
  type NotificationSettings,
} from "@/components/events";

import type { Event } from "@/types";
import {
  formatDate,
  formatTime,
  generateShareableUrl,
  getEventsForDate,
  getEventsForMonth,
} from "@/lib";
import Data from "@/data";

export default function CalendarPage() {
  const searchParams = useSearchParams();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState<Event[]>(Data.events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedView, setSelectedView] = useState("month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [userRsvp, setUserRsvp] = useState<{ [key: string]: string }>({});
  const [notificationSettings, setNotificationSettings] = useState<{
    [key: string]: NotificationSettings;
  }>({});
  const [notificationStatus, setNotificationStatus] = useState<{
    [key: number]: boolean;
  }>({});

  // Dialog states
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);

  // Time left for featured event countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Find featured event or first upcoming event
  const featuredEvent =
    allEvents.find((event) => event.featured) ||
    [...allEvents]
      .filter(
        (event) => new Date(`${event.date}T${event.startTime}`) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.startTime}`).getTime() -
          new Date(`${b.date}T${b.startTime}`).getTime()
      )[0];

  // Calculate time left until the featured event
  useEffect(() => {
    if (!featuredEvent) return;

    const calculateTimeLeft = () => {
      const eventTime = new Date(
        `${featuredEvent.date}T${featuredEvent.startTime}`
      ).getTime();
      const now = new Date().getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [featuredEvent]);

  // Handle URL parameters
  useEffect(() => {
    // Check for event ID parameter
    const eventId = searchParams.get("event");
    if (eventId) {
      const event = allEvents.find((e) => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
        return;
      }
    }

    // Check for date parameter
    const dateParam = searchParams.get("date");
    if (dateParam) {
      try {
        // Parse the date parameter
        const paramDate = new Date(dateParam);

        // Set the calendar to show the month containing this date
        setCurrentDate(paramDate);

        // Find events on this date
        const eventsOnDate = getEventsForDate(allEvents, paramDate);

        // If there's only one event on this date, select it
        if (eventsOnDate.length === 1) {
          setSelectedEvent(eventsOnDate[0]);
        }
      } catch (error) {
        console.error("Invalid date parameter:", error);
      }
    }
  }, [searchParams, allEvents]);

  // Get current month and year
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Filter events based on selected department
  const filteredEvents =
    selectedDepartment === "all"
      ? allEvents
      : allEvents.filter((event) => event.department === selectedDepartment);

  // Get events for the current month
  const currentMonthEvents = getEventsForMonth(
    filteredEvents,
    currentYear,
    currentMonth
  );

  // Check if we're showing events for a specific date from URL parameters
  const dateParam = searchParams.get("date");
  const isShowingDateEvents = !!dateParam;

  // Get events for the specific date if provided
  const eventsOnDate = isShowingDateEvents
    ? getEventsForDate(allEvents, new Date(dateParam))
    : [];

  // Handle RSVP
  const handleRsvp = (
    eventId: string,
    response: string,
    email?: string,
    guests?: string,
    requests?: string
  ) => {
    setUserRsvp({ ...userRsvp, [eventId]: response });

    // Update event RSVP count
    setAllEvents(
      allEvents.map((event) => {
        if (event.id === eventId) {
          const updatedRsvpCount = { ...event.rsvpCount };

          // If user had a previous response, decrement that count
          if (userRsvp[eventId]) {
            updatedRsvpCount[
              userRsvp[eventId] as keyof typeof updatedRsvpCount
            ]--;
          }

          // Increment the new response count
          updatedRsvpCount[response as keyof typeof updatedRsvpCount]++;

          return { ...event, rsvpCount: updatedRsvpCount };
        }
        return event;
      })
    );

    setIsRsvpDialogOpen(false);
    toast({
      title: "RSVP Submitted",
      description: `You have responded ${response} to ${selectedEvent?.title}`,
    });
  };

  // Handle notification settings
  const handleNotificationSave = (settings: NotificationSettings) => {
    if (!selectedEvent) return;

    setNotificationSettings({
      ...notificationSettings,
      [selectedEvent.id]: settings,
    });

    setNotificationStatus({
      ...notificationStatus,
      [selectedEvent.id as unknown as number]: settings.email || settings.push,
    });

    setIsNotifyDialogOpen(false);
    toast({
      title: "Notification Settings Saved",
      description: "You will be notified according to your preferences",
    });
  };

  // Handle share
  const handleShare = () => {
    if (!selectedEvent) return;

    const shareUrl = generateShareableUrl(selectedEvent);

    if (navigator.share) {
      navigator.share({
        title: selectedEvent.title,
        text: `Join us for ${selectedEvent.title} on ${formatDate(
          new Date(selectedEvent.date)
        )} at ${selectedEvent.startTime}`,
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

  // Determine if we should show the featured event
  const shouldShowFeaturedEvent =
    !searchParams.get("event") && !isShowingDateEvents && featuredEvent;

  return (
    <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 dark:from-primary/10 dark:via-secondary/10 dark:to-primary/10 min-h-screen">
      <div className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Featured Event */}
          {shouldShowFeaturedEvent && (
            <div className="mb-12">
              <FeaturedEvent
                event={featuredEvent}
                userRsvp={userRsvp}
                onRsvpClick={(event) => {
                  setSelectedEvent(event);
                  setIsRsvpDialogOpen(true);
                }}
                onShareClick={handleShare}
                onCalendarClick={() => setIsCalendarDialogOpen(true)}
                onNotifyClick={() => setIsNotifyDialogOpen(true)}
                notificationStatus={notificationStatus}
                timeLeft={timeLeft}
              />
            </div>
          )}

          {/* Display events for a specific date if URL parameter is provided */}
          {isShowingDateEvents && eventsOnDate.length > 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Events on {formatDate(new Date(dateParam))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {eventsOnDate.map((event, index) => (
                      <EventSummary
                        key={index}
                        event={event}
                        onSelect={setSelectedEvent}
                        userRsvp={userRsvp}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Church Events</h1>
              <p className="text-muted-foreground">
                View upcoming events and activities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <Card className="md:col-span-1">
              <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                  <Label>Filter by Department</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Main Youth">Main Youth</SelectItem>
                      <SelectItem value="Teen Youth">Teen Youth</SelectItem>
                      <SelectItem value="Women's Fellowship">
                        Women's Fellowship
                      </SelectItem>
                      <SelectItem value="Men's Fellowship">
                        Men's Fellowship
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>View</Label>
                  <Tabs value={selectedView} onValueChange={setSelectedView}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="agenda">Agenda</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Upcoming Events</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Click on any event to see details and RSVP options
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredEvents
                      .filter(
                        (event) =>
                          new Date(`${event.date}T${event.startTime}`) >=
                          new Date()
                      )
                      .sort(
                        (a, b) =>
                          new Date(`${a.date}T${a.startTime}`).getTime() -
                          new Date(`${b.date}T${b.startTime}`).getTime()
                      )
                      .slice(0, 5)
                      .map((event, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: event.color }}
                            ></div>
                            <h4 className="font-medium text-sm">
                              {event.title}
                            </h4>
                          </div>
                          <div className="text-xs text-muted-foreground ml-5 mt-1">
                            {formatDate(new Date(event.date))} •{" "}
                            {formatTime(event.startTime)}
                          </div>
                          {userRsvp[event.id] && (
                            <div className="ml-5 mt-1">
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
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs
                value={selectedView}
                onValueChange={setSelectedView}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                </TabsList>

                <TabsContent value="month">
                  <CalendarGrid
                    events={filteredEvents}
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    onEventSelect={setSelectedEvent}
                    userRsvp={userRsvp}
                  />
                </TabsContent>

                <TabsContent value="agenda">
                  <Card>
                    <CardContent className="p-4">
                      <div className="h-full overflow-y-auto pr-2">
                        <div className="space-y-4 pb-4">
                          {currentMonthEvents.length > 0 ? (
                            currentMonthEvents
                              .sort(
                                (a, b) =>
                                  new Date(a.date).getTime() -
                                  new Date(b.date).getTime()
                              )
                              .map((event) => (
                                <EventCard
                                  key={event.id}
                                  event={event}
                                  userRsvp={userRsvp}
                                  onRsvpClick={(event) => {
                                    setSelectedEvent(event);
                                    setIsRsvpDialogOpen(true);
                                  }}
                                />
                              ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>No events found for this month</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Dialogs */}
          <EventDetailsDialog
            event={selectedEvent}
            open={
              !!selectedEvent &&
              !isRsvpDialogOpen &&
              !isCalendarDialogOpen &&
              !isNotifyDialogOpen
            }
            onOpenChange={(open) => !open && setSelectedEvent(null)}
            userRsvp={userRsvp}
            onRsvpClick={() => setIsRsvpDialogOpen(true)}
            onNotifyClick={() => setIsNotifyDialogOpen(true)}
            onShareClick={handleShare}
            onCalendarClick={() => setIsCalendarDialogOpen(true)}
          />

          <RsvpDialog
            event={selectedEvent}
            open={isRsvpDialogOpen}
            onOpenChange={setIsRsvpDialogOpen}
            userRsvp={userRsvp}
            onRsvpSubmit={handleRsvp}
          />

          <CalendarDialog
            event={selectedEvent}
            open={isCalendarDialogOpen}
            onOpenChange={setIsCalendarDialogOpen}
          />

          <NotificationDialog
            event={selectedEvent}
            open={isNotifyDialogOpen}
            onOpenChange={setIsNotifyDialogOpen}
            onSave={handleNotificationSave}
            initialSettings={
              selectedEvent ? notificationSettings[selectedEvent.id] : undefined
            }
          />
        </motion.div>
      </div>
    </div>
  );
}
