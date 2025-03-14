import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime } from "@/lib";
import { Event } from "@/types";

const CurrentEventSection = ({
  currentEvent,
}: {
  currentEvent: Partial<Event>;
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate time left until the event
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventTime = new Date(currentEvent.date!).getTime();
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
  }, [currentEvent.date]);

  return (
    <section className="relative h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={currentEvent.image || "/placeholder.svg"}
          alt={currentEvent.title!}
          fill
          className="object-cover brightness-50"
        />
      </div>
      <div className="container relative z-10 px-4 mx-auto text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-4 inline-block bg-primary px-4 py-1 rounded-full">
            <span className="text-sm font-medium">Upcoming Event</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {currentEvent.title}
          </h2>
          <p className="text-xl mb-8">{currentEvent.description}</p>

          <div className="flex flex-wrap gap-4 mb-8 text-white/80">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(currentEvent.date!)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{formatTime(currentEvent.date!)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{currentEvent.location}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-4 max-w-md">
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-xs uppercase tracking-wider">Days</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs uppercase tracking-wider">Hours</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs uppercase tracking-wider">Minutes</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs uppercase tracking-wider">Seconds</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href={`/events/${currentEvent.id}`}>Event Details</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              asChild
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentEventSection;
