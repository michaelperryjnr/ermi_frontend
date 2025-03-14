import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Bell } from "lucide-react";
import { formatDate, formatTime } from "@/lib";
import { Event } from "@/types";

interface FeaturedEventProps {
  featuredEvent: Event;
  notificationStatus: Record<string, boolean>;
  toggleNotification: (id: string) => void;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const FeaturedEvent = ({
  featuredEvent,
  notificationStatus,
  toggleNotification,
  timeLeft,
}: FeaturedEventProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredEvent.image || "/placeholder.svg"}
          alt={featuredEvent.title}
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      <div className="container relative z-10 px-4 mx-auto text-white py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-4 inline-block bg-primary px-4 py-1 rounded-full">
            <span className="text-sm font-medium">Featured Event</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {featuredEvent.title}
          </h1>
          <p className="text-xl mb-8">{featuredEvent.description}</p>

          <div className="flex flex-wrap gap-4 mb-8 text-white/80">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(featuredEvent.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{formatTime(featuredEvent.date)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{featuredEvent.location}</span>
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
              <Link href={`/calendar/${featuredEvent.id}`}>Event Details</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              onClick={() => toggleNotification(featuredEvent.id)}
            >
              <Bell
                className={`h-5 w-5 mr-2 ${
                  notificationStatus[featuredEvent.id] ? "fill-white" : ""
                }`}
              />
              {notificationStatus[featuredEvent.id]
                ? "Notifications On"
                : "Get Notified"}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
