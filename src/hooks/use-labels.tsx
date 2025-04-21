import { useBibleState } from "@/contexts/bibleVersionContext";

export function useLabels() {
  const { labels, addLabel, deleteLabel, updateLabel } = useBibleState();
  return { labels, addLabel, deleteLabel, updateLabel };
}
