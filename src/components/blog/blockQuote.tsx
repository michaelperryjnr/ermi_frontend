import type React from "react";
import { MessageSquareQuote } from "lucide-react";

interface BlockQuoteProps {
  author?: string;
  source?: string;
  children: React.ReactNode;
}

export function BlockQuote({ author, source, children }: BlockQuoteProps) {
  return (
    <div className="my-8 p-6 bg-muted rounded-lg">
      <div className="flex flex-col space-y-2">
        <div className="flex items-start">
          <MessageSquareQuote className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-1" />
          <blockquote className="text-lg italic">{children}</blockquote>
        </div>
        {(author || source) && (
          <div className="text-right text-sm text-muted-foreground mt-2">
            {author && <span className="font-medium">— {author}</span>}
            {author && source && <span>, </span>}
            {source && <span className="italic">{source}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
