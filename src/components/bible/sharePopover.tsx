"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Copy, Facebook, Link, Mail, Twitter } from "lucide-react";
import { useState } from "react";

interface SharePopoverProps {
  verse: any;
  selectedBook: any;
  selectedChapter: number;
}

export function SharePopover({
  verse,
  selectedBook,
  selectedChapter,
}: SharePopoverProps) {
  const [copied, setCopied] = useState(false);

  if (!verse || !selectedBook || !selectedBook.name) {
    return null; // Return null if verse or selectedBook is undefined or missing name
  }

  const verseReference = `${selectedBook.name} ${selectedChapter}:${verse.verse}`;
  const verseText = verse.text;
  const shareText = `${verseReference} - ${verseText}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: verseReference,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Bible Verse: ${verseReference}`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}`);
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-full">
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <h4 className="font-medium">Share Verse</h4>
          <p className="text-sm text-muted-foreground">{shareText}</p>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy to clipboard"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={shareViaEmail}
            >
              <Mail className="h-4 w-4" />
              Share via email
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={shareViaTwitter}
            >
              <Twitter className="h-4 w-4" />
              Share on Twitter
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={shareViaFacebook}
            >
              <Facebook className="h-4 w-4" />
              Share on Facebook
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={handleShare}
            >
              <Link className="h-4 w-4" />
              Share via device
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
