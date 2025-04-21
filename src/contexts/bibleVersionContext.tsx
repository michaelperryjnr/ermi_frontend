import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {v4 as uuidv4 } from "uuid";
import { BibleStateContextType, Label, Note, Highlight } from "@/types";

const BibleStateContext = createContext<BibleStateContextType | undefined>(undefined);

export function BibleStateProvider({children}: { children: ReactNode }) {
  const [selectedVersion, setSelectedVersion] = useState<string>("kjv");
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedVersion = localStorage.getItem("bibleVersion");

        if (storedVersion) {
          setSelectedVersion(storedVersion);
        }

        const storedNotes = localStorage.getItem(`bibleNotes_${selectedVersion}`);

        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }

        const storedHighlights = localStorage.getItem(`bibleHighlights_${selectedVersion}`);
        
        if (storedHighlights) {
          setHighlights(JSON.parse(storedHighlights));
        }

        const storedLabels = localStorage.getItem("bibleLabels");

        if (storedLabels) {
          setLabels(JSON.parse(storedLabels));
        }
      } catch (error: any) {
        console.error("Failed to load stored Bible data")
      }

      loadStoredData();
    }
  }, [selectedVersion]);

  useEffect(() => {
    localStorage.setItem(`bibleNotes_${selectedVersion}`, JSON.stringify(notes));
  }, [notes, selectedVersion]);

  useEffect(() => {
    localStorage.setItem(`bibleHighlights_${selectedVersion}`, JSON.stringify(highlights));
  }, [highlights, selectedVersion]);

  useEffect(() => {
    localStorage.setItem("bibleLabels", JSON.stringify(labels));
  }, [labels]);

  useEffect(() => {
    localStorage.setItem("bibleVersion", selectedVersion);
  }, [selectedVersion]);

  const addNote = (verseId: string, text: string, labels: string[]) => {
    const newNote = {
      id: uuidv4(),
      verseId,
      text,
      labels,
      timestamp: Date.now(),
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  }

  const deleteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  }

  const updateNote = (noteId: string, text: string, labels: string[]) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, text, labels } : note
      )
    );
  }

  const addHighlight = (verseId: string, color: string) => {
    const newHighlight = {
      verseId,
      color,
      timestamp: Date.now(),
    };
    setHighlights((prevHighlights) => [...prevHighlights, newHighlight]);
  }

  const removeHighlight = (verseId: string) => {
    setHighlights((prevHighlights) =>
      prevHighlights.filter((highlight) => highlight.verseId !== verseId)
    );
  }

  const updateHighlight = (verseId: string, color: string) => {
    setHighlights((prevHighlights) =>
      prevHighlights.map((highlight) =>
        highlight.verseId === verseId ? { ...highlight, color } : highlight
      )
    );
  }

  const addLabel = (name: string, color: string) => {
    const newLabel = {
      id: uuidv4(),
      name,
      color,
    };
    setLabels((prevLabels) => [...prevLabels, newLabel]);
  }

  const deleteLabel = (labelId: string) => {
    setLabels((prevLabels) => prevLabels.filter((label) => label.id !== labelId));
  }

  const updateLabel = (labelId: string, name: string, color: string) => {
    setLabels((prevLabels) =>
      prevLabels.map((label) =>
        label.id === labelId ? { ...label, name, color } : label
      )
    );
  }

  const value = {
    notes,
    addNote,
    deleteNote,
    updateNote,
    highlights,
    addHighlight,
    removeHighlight,
    updateHighlight,
    labels,
    addLabel,
    deleteLabel,
    updateLabel,
    selectedVersion,
    setSelectedVersion,
  }

  return (
    <BibleStateContext.Provider value={value}>
      {children}
    </BibleStateContext.Provider>
  );
}


export function useBibleState() {
  const context = useContext(BibleStateContext);
  if (context === undefined) {
    throw new Error("useBibleState must be used within a BibleStateProvider");
  }
  return context;
}

export default BibleStateProvider;