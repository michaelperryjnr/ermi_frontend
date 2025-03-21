"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { Sermon } from "@/types";
import SermonHeader from "./sermonHeader";
import SermonPlayer from "./sermonPlayer";
import SermonContent from "./sermonContent";
import SermonActions from "./sermonActions";
import RelatedSermons from "./relatedSermons";
import CommentSection from "./commentSection";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Video } from "lucide-react";

interface SermonViewProps {
  sermon: Sermon;
  relatedSermons: Sermon[];
  isListenMode: boolean;
  isReadMode: boolean;
}

export default function SermonView({
  sermon,
  relatedSermons,
  isListenMode,
  isReadMode,
}: SermonViewProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Default to video mode if no specific mode is selected
  const [activeMode, setActiveMode] = useState<"video" | "audio" | "read">(
    isListenMode ? "audio" : isReadMode ? "read" : "video"
  );

  useEffect(() => {
    // Update the URL when the mode changes
    if (activeMode === "audio") {
      router.push(`${pathname}?listen=true`);
    } else if (activeMode === "read") {
      router.push(`${pathname}?read=true`);
    } else {
      router.push(pathname);
    }
  }, [activeMode, pathname, router]);

  const handleModeChange = (mode: "video" | "audio" | "read") => {
    setActiveMode(mode);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            <SermonHeader sermon={sermon} />

            {/* Mode Selector */}
            <div className="flex justify-center sm:justify-start mb-2">
              <div className="bg-muted rounded-lg p-1 inline-flex">
                <Button
                  variant={activeMode === "video" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModeChange("video")}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Watch</span>
                </Button>
                <Button
                  variant={activeMode === "audio" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModeChange("audio")}
                  className="flex items-center gap-2"
                >
                  <Headphones className="h-4 w-4" />
                  <span className="hidden sm:inline">Listen</span>
                </Button>
                <Button
                  variant={activeMode === "read" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModeChange("read")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Read</span>
                </Button>
              </div>
            </div>

            {/* Player or Content based on mode */}
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeMode === "read" ? (
                <SermonContent sermon={sermon} expanded={true} />
              ) : (
                <SermonPlayer sermon={sermon} mode={activeMode} />
              )}
            </motion.div>

            {/* Show content below player in video/audio modes */}
            {activeMode !== "read" && (
              <SermonContent sermon={sermon} expanded={false} />
            )}

            {/* Comments Section */}
            <div id="comments" className="pt-8 mt-8 border-t">
              <CommentSection sermonId={sermon.id} />
            </div>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            <SermonActions sermon={sermon} />

            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-bold mb-4">More Sermons</h3>
              <RelatedSermons sermons={relatedSermons} compact={true} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
