import { useBibleState } from "@/contexts/bibleVersionContext";

export function useHighlights() {
  const { highlights, addHighlight, removeHighlight, updateHighlight } =
    useBibleState();
  return { highlights, addHighlight, removeHighlight, updateHighlight };
}
