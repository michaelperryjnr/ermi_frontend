"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useHighlights } from "@/hooks";
import { useContext } from "react";
import { BibleVersionContext } from "@/contexts";

// Default highlight colors
const highlightColors = [
  "#FFD700", // Gold
  "#90EE90", // Light Green
  "#FFB6C1", // Light Pink
  "#87CEEB", // Sky Blue
  "#DDA0DD", // Plum
  "#F0E68C", // Khaki
];

interface HighlightPopoverProps {
  verse: any;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export function HighlightPopover({
  verse,
  selectedColor,
  setSelectedColor,
}: HighlightPopoverProps) {
  const { selectedVersion } = useContext(BibleVersionContext);
  const { highlights, addHighlight, removeHighlight, updateHighlight } =
    useHighlights(selectedVersion);

  if (!verse) {
    return null; // Return null if verse is undefined
  }

  const handleHighlight = (verseId: string, color: string) => {
    // Check if verse is already highlighted
    const existingHighlight = highlights.find((h) => h.verseId === verseId);

    if (existingHighlight) {
      // Remove highlight if same color is selected
      if (existingHighlight.color === color) {
        removeHighlight(verseId);
        return;
      }

      // Update highlight color
      updateHighlight(verseId, color);
      return;
    }

    // Add new highlight
    addHighlight(verseId, color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-full">
          Highlight
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium">Choose Color</h4>
          <div className="flex flex-wrap gap-2">
            {highlightColors.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full ${
                  selectedColor === color
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSelectedColor(color);
                  handleHighlight(verse.id, color);
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
