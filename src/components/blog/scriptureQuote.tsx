import type React from "react";
import { BookOpen } from "lucide-react";

interface ScriptureQuoteProps {
  reference: string;
  children: React.ReactNode;
  translation?: string;
}

export function ScriptureQuote({
  reference,
  children,
  translation = "NIV",
}: ScriptureQuoteProps) {
  return (
    <div className="my-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
      <div className="flex flex-col space-y-2">
        <blockquote className="text-lg italic font-serif">
          "{children}"
        </blockquote>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-primary font-medium">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{reference}</span>
          </div>
          <span className="text-sm text-muted-foreground">{translation}</span>
        </div>
      </div>
    </div>
  );
}
