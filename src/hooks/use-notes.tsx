"use client";

import { useState, useEffect } from "react";

interface Note {
  id: string;
  verseId: string;
  text: string;
  labels: string[];
  createdAt: string;
}

export function useNotes(bibleVersion: string) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(`bible-notes-${bibleVersion}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
    }
  }, [bibleVersion]);

  const saveNotes = (updatedNotes: Note[]) => {
    try {
      localStorage.setItem(
        `bible-notes-${bibleVersion}`,
        JSON.stringify(updatedNotes)
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const addNote = (verseId: string, text: string, labels: string[] = []) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      verseId,
      text,
      labels,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);

    return newNote;
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  const updateNote = (noteId: string, text: string, labels: string[] = []) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, text, labels } : note
    );
    saveNotes(updatedNotes);
  };

  return {
    notes,
    addNote,
    deleteNote,
    updateNote,
  };
}
