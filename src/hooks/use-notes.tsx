import { useBibleState } from "@/contexts/bibleVersionContext";
export function useNotes() {
  const {notes, addNote, deleteNote, updateNote} = useBibleState();
  return {notes, addNote, deleteNote, updateNote};
}