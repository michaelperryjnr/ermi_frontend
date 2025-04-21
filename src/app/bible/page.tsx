"use client";

import BibleReader from "@/components/bible/bibleReader";
import BibleStateProvider from "@/contexts/bibleVersionContext";

export default function BiblePage() {
  return (
    <BibleStateProvider>
      <BibleReader />
    </BibleStateProvider>
  );
}
