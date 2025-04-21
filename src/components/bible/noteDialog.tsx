"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Plus } from "lucide-react";
import { useNotes } from "@/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { LabelManager } from "./labelManager";

interface NoteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedVerse: string | null;
  labelsData: any[];
}

export function NoteDialog({
  isOpen,
  setIsOpen,
  selectedVerse,
  labelsData,
}: NoteDialogProps) {
  const [noteText, setNoteText] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const { addNote } = useNotes();
  const [showLabelManager, setShowLabelManager] = useState(false);

  const [availableLabels, setAvailableLabels] = useState(labelsData);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNoteText("");
      setSelectedLabels([]);
      setShowLabelManager(false);
    }
  }, [isOpen]);

  // Clean up selected labels when labels change
  useEffect(() => {
    if (availableLabels && availableLabels.length > 0) {
      // Filter out any selected labels that no longer exist
      const validLabelIds = availableLabels.map((label) => label.id);
      setSelectedLabels((prev) =>
        prev.filter((id) => validLabelIds.includes(id))
      );
    }
  }, [availableLabels]);

  const handleAddNote = () => {
    if (!selectedVerse || !noteText.trim()) return;

    addNote(selectedVerse, noteText, selectedLabels);
    setIsOpen(false);
  };

  const handleLabelManagerClose = () => {
    // Refresh labels when returning from label manager
    setAvailableLabels(labelsData); // This assumes useLabels hook has a getLabels function
    setShowLabelManager(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {!showLabelManager ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="note-text">Note</Label>
                <Textarea
                  id="note-text"
                  placeholder="Enter your thoughts, reflections, or insights about this verse..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Labels</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setShowLabelManager(true)}
                  >
                    <Plus className="h-3 w-3" /> Create Label
                  </Button>
                </div>
                <ScrollArea className="h-[120px] border rounded-md p-2">
                  <div className="flex flex-wrap gap-2">
                    {availableLabels && availableLabels.length > 0 ? (
                      availableLabels.map((label, index) => (
                        <motion.button
                          key={label.id || index}
                          className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${
                            selectedLabels.includes(label.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedLabels((prev) =>
                              prev.includes(label.id)
                                ? prev.filter((id) => id !== label.id)
                                : [...prev, label.id]
                            );
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          {label.name}
                          {selectedLabels.includes(label.id) && (
                            <Check className="h-3 w-3 ml-1" />
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <div className="flex items-center justify-center w-full h-[80px] text-center">
                        <p className="text-sm text-muted-foreground">
                          No labels created yet
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <LabelManager />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLabelManagerClose}
              >
                Back to Note
              </Button>
            </div>
          )}
        </div>
        {!showLabelManager && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!noteText.trim()}>
              Save Note
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
