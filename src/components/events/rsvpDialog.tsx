"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import type { Event } from "@/types";
import { useState } from "react";

interface RsvpDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRsvp: { [eventId: string]: string };
  onRsvpSubmit: (
    eventId: string,
    response: string,
    email: string,
    guests: string,
    requests: string
  ) => void;
}

export default function RsvpDialog({
  event,
  open,
  onOpenChange,
  userRsvp,
  onRsvpSubmit,
}: RsvpDialogProps) {
  const [email, setEmail] = useState("");
  const [additionalGuests, setAdditionalGuests] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [response, setResponse] = useState<string>("yes");

  if (!event) return null;

  // Set initial response based on existing RSVP
  const initialResponse = userRsvp[event.id] || "yes";

  const handleSubmit = () => {
    onRsvpSubmit(event.id, response, email, additionalGuests, specialRequests);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle>RSVP to {event.title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Will you attend?</Label>
            <RadioGroup
              defaultValue={initialResponse}
              className="flex flex-col space-y-1"
              onValueChange={setResponse}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="font-normal">
                  Yes, I'll be there
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe" className="font-normal">
                  Maybe, I'm not sure yet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="font-normal">
                  No, I can't make it
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (for confirmation)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Additional Guests</Label>
            <Input
              id="guests"
              placeholder="Names of additional guests"
              value={additionalGuests}
              onChange={(e) => setAdditionalGuests(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests</Label>
            <Textarea
              id="requests"
              placeholder="Any dietary restrictions or special needs?"
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit RSVP</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
