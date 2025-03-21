import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScriptureQuote } from "@/components/blog";

interface DevotionalHeroProps {
  title: string;
  verse: string;
  verseText: string;
  date: string;
  author: string;
  id: number;
}

export function DevotionalHero({
  title,
  verse,
  verseText,
  date,
  author,
  id,
}: DevotionalHeroProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-muted/50 rounded-xl overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>By {author}</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{title}</h1>

        <div className="mb-4">
          <ScriptureQuote
            reference={verse}
            children={verseText}
            translation="NIV"
          />
        </div>

        <div className="flex gap-x-4">
          <Button asChild>
            <Link href={`/devotional/${id}`}>Read Today's Devotional</Link>
          </Button>
          <Button variant="outline">Browse Archives</Button>
        </div>
      </div>
    </div>
  );
}
