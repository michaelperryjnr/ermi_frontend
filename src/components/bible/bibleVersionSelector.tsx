"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "lucide-react";

interface BibleVersionSelectorProps {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}

// Available Bible versions
const bibleVersions = [
  { id: "kjv", name: "King James Version (KJV)" },
  { id: "niv", name: "New International Version (NIV)" },
  { id: "esv", name: "English Standard Version (ESV)" },
  { id: "nlt", name: "New Living Translation (NLT)" },
  { id: "nasb", name: "New American Standard Bible (NASB)" },
];

export function BibleVersionSelector({
  selectedVersion,
  onVersionChange,
}: BibleVersionSelectorProps) {
  return (
    <Select value={selectedVersion} onValueChange={onVersionChange}>
      <SelectTrigger className="w-[180px] bg-muted/50">
        <div className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          <SelectValue placeholder="Select version" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {bibleVersions.map((version) => (
          <SelectItem key={version.id} value={version.id}>
            {version.name.slice(0, 10) + "..."}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
