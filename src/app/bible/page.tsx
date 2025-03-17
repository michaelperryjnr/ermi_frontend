"use client";

import BibleReader from "@/components/bible/bibleReader";
import { BibleVersionProvider } from "@/contexts";

export default function BiblePage() {
  return (
    <BibleVersionProvider>
      <BibleReader />
    </BibleVersionProvider>
  );
}
