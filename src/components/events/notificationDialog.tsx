"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Event } from "@/types/IEvent";
import { useState } from "react";

interface NotificationDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: NotificationSettings) => void;
  initialSettings?: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reminderTime: string;
}

export default function NotificationDialog({
  event,
  open,
  onOpenChange,
  onSave,
  initialSettings = {
    email: true,
    push: false,
    reminderTime: "1hour",
  },
}: NotificationDialogProps) {
  const [settings, setSettings] =
    useState<NotificationSettings>(initialSettings);

  if (!event) return null;

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle>Notification Settings</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notify">Email Notifications</Label>
            <Switch
              id="email-notify"
              checked={settings.email}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, email: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notify">Push Notifications</Label>
            <Switch
              id="push-notify"
              checked={settings.push}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, push: checked })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Select
              value={settings.reminderTime}
              onValueChange={(value) =>
                setSettings({ ...settings, reminderTime: value })
              }
            >
              <SelectTrigger id="reminder-time">
                <SelectValue placeholder="Select reminder time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="3hours">3 hours before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
                <SelectItem value="2days">2 days before</SelectItem>
                <SelectItem value="1week">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
