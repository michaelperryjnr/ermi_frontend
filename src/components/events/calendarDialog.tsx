"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarPlus, X } from "lucide-react";
import type { Event } from "@/types";
import { generateGoogleCalendarUrl, downloadICalFile } from "@/lib";

interface CalendarDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CalendarDialog({
  event,
  open,
  onOpenChange,
}: CalendarDialogProps) {
  if (!event) return null;

  const handleAddToGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(event), "_blank");
  };

  const handleAddToAppleCalendar = () => {
    downloadICalFile(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle>Add to Calendar</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button className="w-full" onClick={handleAddToGoogleCalendar}>
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.804 16.863h-1.758v-6.87H8.954v6.87H7.196V7.137h1.758v1.566h8.092V7.137h1.758v9.726z" />
            </svg>
            Add to Google Calendar
          </Button>
          <Button className="w-full" onClick={handleAddToAppleCalendar}>
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
            </svg>
            Add to Apple Calendar
          </Button>
          <Button className="w-full" onClick={() => downloadICalFile(event)}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Download iCal File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
