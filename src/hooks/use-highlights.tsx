"use client";

import { useState, useEffect } from "react";

interface Highlight {
  id: string;
  verseId: string;
  color: string;
  createdAt: string;
}

export function useHighlights(bibleVersion: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    try {
      const savedHighlights = localStorage.getItem(
        `bible-highlights=${bibleVersion}`
      );

      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      } else {
        setHighlights([]);
      }
    } catch (error) {
      console.error("Error loading highlights: ", error);
      setHighlights([]);
    }
  }, [bibleVersion]);

  const saveHighLights = (updatedHighlights: Highlight[]) => {
    try {
      localStorage.setItem(
        `bible-highlights=${bibleVersion}`,
        JSON.stringify(updatedHighlights)
      );

      setHighlights(updatedHighlights);
    } catch (error) {
      console.error("Error saving highlights: ", error);
    }
  };

  const addHighlight = (verseId: string, color: string) => {
    const newHighlight: Highlight = {
      id: `highlight-${Date.now()}`,
      verseId,
      color,
      createdAt: new Date().toISOString(),
    };

    const filteredHighlights = highlights.filter((h) => h.verseId !== verseId);

    const updatedHighlights = [...filteredHighlights, newHighlight];

    saveHighLights(updatedHighlights);

    return newHighlight;
  };

  const removeHighlight = (verseId: string) => {
    const updatedHighlights = highlights.filter((h) => h.verseId !== verseId);
    saveHighLights(updatedHighlights);
  };

  const updateHighlight = (verseId: string, color: string) => {
    const updatedHighlights = highlights.map((h) =>
      h.verseId === verseId ? { ...h, color } : h
    );

    saveHighLights(updatedHighlights);
  };

  return {
    highlights,
    addHighlight,
    removeHighlight,
    updateHighlight,
  };
}
