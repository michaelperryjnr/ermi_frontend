"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Bell } from "lucide-react";
import { formatDate, formatTime } from "@/lib";
import Link from "next/link";
import { FeaturedEvent } from "@/components/sections";
import Image from "next/image";
import Data from "@/data";

// Mock data - would come from your API/database in production

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [notificationStatus, setNotificationStatus] = useState<
    Record<string, boolean>
  >({});
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const events = Data.events;

  // Find featured event (or first upcoming event)
  const featuredEvent =
    events.find((event) => event.featured) ||
    [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];

  // Calculate time left until the featured event
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventTime = new Date(featuredEvent.date).getTime();
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
  }, [featuredEvent.date]);

  const toggleNotification = (eventId: string) => {
    setNotificationStatus((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));

    // In a real app, you would register/unregister for push notifications here
    if (!notificationStatus[eventId]) {
      // This would be the actual notification registration code
      if ("Notification" in window && Notification.permission === "granted") {
        console.log(`Subscribed to notifications for event ${eventId}`);
      } else if (
        "Notification" in window &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log(`Subscribed to notifications for event ${eventId}`);
          }
        });
      }
    } else {
      console.log(`Unsubscribed from notifications for event ${eventId}`);
    }
  };

  const filteredEvents =
    filter === "all"
      ? events.filter((event) => !event.featured) // Exclude featured event from regular list
      : events.filter(
          (event) => event.department === filter && !event.featured
        );

  const upcomingEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Hero Section for Featured Event */}
      <FeaturedEvent
        featuredEvent={featuredEvent}
        notificationStatus={notificationStatus}
        toggleNotification={toggleNotification}
        timeLeft={timeLeft}
      />

      <div className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us for worship, fellowship, and spiritual growth
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-8">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "General" ? "default" : "outline"}
                  onClick={() => setFilter("General")}
                >
                  General
                </Button>
                <Button
                  variant={filter === "Main Youth" ? "default" : "outline"}
                  onClick={() => setFilter("Main Youth")}
                >
                  Main Youth
                </Button>
                <Button
                  variant={filter === "Teen Youth" ? "default" : "outline"}
                  onClick={() => setFilter("Teen Youth")}
                >
                  Teen Youth
                </Button>
                <Button
                  variant={
                    filter === "Women's Fellowship" ? "default" : "outline"
                  }
                  onClick={() => setFilter("Women's Fellowship")}
                >
                  Women's Fellowship
                </Button>
                <Button
                  variant={
                    filter === "Men's Fellowship" ? "default" : "outline"
                  }
                  onClick={() => setFilter("Men's Fellowship")}
                >
                  Men's Fellowship
                </Button>
              </div>

              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {upcomingEvents.map((event) => (
                  <motion.div key={event.id} variants={item}>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        {event.recurring && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            Recurring
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>
                              {event.department}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleNotification(event.id)}
                            className={
                              notificationStatus[event.id] ? "text-primary" : ""
                            }
                          >
                            <Bell
                              className={`h-5 w-5 ${
                                notificationStatus[event.id]
                                  ? "fill-primary"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {formatTime(event.date)} -{" "}
                            {formatTime(event.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <p className="mt-2 line-clamp-2">{event.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link
                            href={`/calendar/${event.id}?date=${event.date}`}
                          >
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Events Found</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no upcoming events for this department
                  </p>
                  <Button onClick={() => setFilter("all")}>
                    View All Events
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">March 2025</h2>
                  </div>

                  {/* Simple calendar grid - in a real app, you'd use a proper calendar component */}
                  <div className="grid grid-cols-7 gap-1 mb-4 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div key={day} className="p-2 font-medium">
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* First week with empty days */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="p-2 text-muted-foreground"
                      >
                        {/* Empty cells for previous month */}
                      </div>
                    ))}

                    {/* Actual days */}
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const hasEvent = events.some((event) => {
                        const eventDate = new Date(event.date);
                        return (
                          eventDate.getDate() === day &&
                          eventDate.getMonth() === 2
                        ); // March is month 2 (0-indexed)
                      });

                      return (
                        <div
                          key={`day-${day}`}
                          className={`p-2 rounded-md relative ${
                            hasEvent ? "bg-primary/10" : ""
                          }`}
                        >
                          <span>{day}</span>
                          {hasEvent && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Events This Month</h3>
                    <div className="space-y-3">
                      {events
                        .filter((event) => {
                          const eventDate = new Date(event.date);
                          return eventDate.getMonth() === 2; // March is month 2 (0-indexed)
                        })
                        .map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center p-2 hover:bg-muted rounded-md"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="font-medium">
                                {new Date(event.date).getDate()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatTime(event.date)} - {event.location}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/event/${event.id}?date=${event.date}`}
                              >
                                Details
                              </Link>
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
