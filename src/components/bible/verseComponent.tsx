"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Highlighter, MessageSquarePlus, Share2 } from "lucide-react";
import { useHighlights } from "@/hooks";
import { useBibleState } from "@/contexts/bibleVersionContext";
import { motion, AnimatePresence } from "framer-motion";

// Default highlight colors
const highlightColors = [
  "#FFD700", // Gold
  "#90EE90", // Light Green
  "#FFB6C1", // Light Pink
  "#87CEEB", // Sky Blue
  "#DDA0DD", // Plum
  "#F0E68C", // Khaki
];

interface VerseComponentProps {
  verse: any;
  highlights: any[];
  notes: any[];
  labels: any[];
  setSelectedVerse: (verseId: string | null) => void;
  setIsAddingNote: (isAdding: boolean) => void;
  selectedBook: any;
  selectedChapter: number;
}

export function VerseComponent({
  verse,
  highlights,
  notes,
  labels,
  setSelectedVerse,
  setIsAddingNote,
  selectedBook,
  selectedChapter,
}: VerseComponentProps) {
  const { selectedVersion } = useBibleState();
  const { addHighlight, removeHighlight, updateHighlight } =
    useHighlights();
  const [selectedColor, setSelectedColor] = useState(highlightColors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const verseRef = useRef<HTMLDivElement>(null);

  const verseHighlights = highlights.filter((h) => h.verseId === verse.id);
  const verseNotes = notes.filter((n) => n.verseId === verse.id);
  const highlightColor =
    verseHighlights.length > 0 ? verseHighlights[0].color : null;

  // Handle text selection
  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Check if selection is within this verse
        if (
          verseRef.current &&
          verseRef.current.contains(selection.anchorNode)
        ) {
          setActionPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom + window.scrollY,
          });
          setShowActions(true);
        }
      } else {
        setShowActions(false);
      }
    };

    document.addEventListener("mouseup", checkSelection);
    document.addEventListener("touchend", checkSelection);

    return () => {
      document.removeEventListener("mouseup", checkSelection);
      document.removeEventListener("touchend", checkSelection);
    };
  }, []);

  const handleHighlight = (color: string) => {
    // Check if verse is already highlighted
    const existingHighlight = highlights.find((h) => h.verseId === verse.id);

    if (existingHighlight) {
      // Remove highlight if same color is selected
      if (existingHighlight.color === color) {
        removeHighlight(verse.id);
        return;
      }

      // Update highlight color
      updateHighlight(verse.id, color);
      return;
    }

    // Add new highlight
    addHighlight(verse.id, color);
  };

  const handleShare = () => {
    const verseReference = `${selectedBook.name} ${selectedChapter}:${verse.verse}`;
    const verseText = verse.text;
    const shareText = `${verseReference} - ${verseText}`;

    if (navigator.share) {
      navigator.share({
        title: verseReference,
        text: shareText,
        url: window.location.href,
      });
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Verse copied to clipboard!");
    }
  };

  return (
    <div
      id={`verse-${verse.id}`}
      ref={verseRef}
      className="group relative flex transition-colors duration-300 rounded-md py-1 hover:bg-muted/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm font-bold text-muted-foreground mr-2 mt-1 w-6 shrink-0 text-right">
        {verse.verse}
      </span>
      <div className="flex-1">
        <span
          className={`relative ${highlightColor ? "px-1 py-0.5 rounded" : ""}`}
          style={
            highlightColor ? { backgroundColor: `${highlightColor}30` } : {}
          }
        >
          {verse.text}
        </span>

        {/* Verse Actions - Visible on hover */}
        <AnimatePresence>
          {isHovered && !showActions && (
            <motion.div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 bg-background/80 backdrop-blur-sm shadow-sm rounded-full p-1 border z-10"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                  >
                    <Highlighter className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <div className="flex flex-wrap gap-2">
                    {highlightColors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          selectedColor === color
                            ? "ring-2 ring-primary ring-offset-2 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          handleHighlight(color);
                        }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => {
                  setSelectedVerse(verse.id);
                  setIsAddingNote(true);
                }}
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Selection Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className="fixed z-50 flex gap-1 bg-background shadow-lg rounded-full p-1 border"
              style={{
                left: `${actionPosition.x}px`,
                top: `${actionPosition.y + 10}px`,
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedColor }}
                    ></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-wrap gap-2">
                    {highlightColors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          selectedColor === color
                            ? "ring-2 ring-primary ring-offset-2 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          handleHighlight(color);
                          setShowActions(false);
                        }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => {
                  setSelectedVerse(verse.id);
                  setIsAddingNote(true);
                  setShowActions(false);
                }}
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => {
                  handleShare();
                  setShowActions(false);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Display */}
        {verseNotes.length > 0 && (
          <div className="mt-1 pl-4 border-l-2 border-primary/20 bg-muted/30 p-2 rounded">
            {verseNotes.map((note, index) => (
              <div key={index} className="text-sm mb-2 last:mb-0">
                <p>{note.text}</p>
                {note.labels && note.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {note.labels.map((labelId: string, labelIndex: number) => {
                      const label = labels.find((l) => l.id === labelId);
                      if (!label) return null;
                      return (
                        <span
                          key={labelIndex}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: `${label.color}30`,
                            color: label.color,
                          }}
                        >
                          {label.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
