"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const upcomingEvents = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "2025-03-17T10:00:00",
    location: "Main Sanctuary",
    description: "Join us for our weekly worship service",
  },
  {
    id: 2,
    title: "Youth Bible Study",
    date: "2025-03-19T18:30:00",
    location: "Youth Center",
    description: "Bible study for young adults",
  },
  {
    id: 3,
    title: "Women's Prayer Meeting",
    date: "2025-03-20T19:00:00",
    location: "Fellowship Hall",
    description: "A time of prayer and fellowship for women",
  },
];

export default function UpcomingEvents() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show the upcoming events banner after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 right-0 z-40 p-4 w-full md:w-auto md:max-w-md"
        >
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-0">
              <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
                <h3 className="font-bold flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Events
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "-" : "+"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80"
                    onClick={() => setIsVisible(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border-b pb-3 last:border-b-0 last:pb-0"
                        >
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1 mt-1">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-2" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-2" />
                              {formatTime(event.date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-2" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/events">View All Events</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isExpanded && (
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Next: {upcomingEvents[0].title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(upcomingEvents[0].date)} at{" "}
                      {formatTime(upcomingEvents[0].date)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/events">View All</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
