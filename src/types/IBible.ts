interface Label {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  verseId: string;
  text: string;
  labels: string[];
  timestamp: number;
}

interface Highlight {
  verseId: string;
  color: string;
  timestamp: number;
}

interface BibleStateContextType {
  // Notes
  notes: Note[];
  addNote: (verseId: string, text: string, labels: string[]) => void;
  deleteNote: (noteId: string) => void;
  updateNote: (noteId: string, text: string, labels: string[]) => void;

  //Highlights
  highlights: Highlight[];
  addHighlight: (verseId: string, color: string) => void;
  removeHighlight: (verseId: string) => void;
  updateHighlight: (verseId: string, color: string) => void;

  // Labels
  labels: Label[];
  addLabel: (name: string, color: string) => void;
  deleteLabel: (labelId: string) => void;
  updateLabel: (labelId: string, name: string, color: string) => void;

  // Version
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
}

export type { Label, Note, Highlight, BibleStateContextType };
export default BibleStateContextType;
