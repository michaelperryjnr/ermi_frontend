"use client";

import { motion } from "framer-motion";
import type { Sermon } from "@/types";
import {
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageSquare,
  Clock,
  ListPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SermonActionsProps {
  sermon: Sermon;
}

export default function SermonActions({ sermon }: SermonActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42); // Placeholder count

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved sermons" : "Saved to your library",
      description: isSaved
        ? "This sermon has been removed from your saved items."
        : "You can access this sermon in your saved items.",
    });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: `Listen to "${sermon.title}" by ${sermon.speaker}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this sermon with others.",
      });
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would trigger a download of the sermon
    toast({
      title: "Download started",
      description: "Your sermon download will begin shortly.",
    });
  };

  const handleWatchLater = () => {
    toast({
      title: "Added to Watch Later",
      description: "This sermon has been added to your Watch Later list.",
    });
  };

  const handleAddToPlaylist = () => {
    toast({
      title: "Add to Playlist",
      description: "Choose a playlist to add this sermon to.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    className="flex items-center justify-center flex-1"
                    onClick={handleLike}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        isLiked ? "fill-current" : ""
                      }`}
                    />
                    {likeCount}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? "Unlike" : "Like"} this sermon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center flex-1"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this sermon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    className="flex items-center justify-center flex-1"
                    onClick={handleSave}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="mr-2 h-4 w-4" />
                    ) : (
                      <Bookmark className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSaved ? "Remove from" : "Save to"} your library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={handleDownload}
            >
              <Download className="mr-3 h-4 w-4" />
              Download
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={handleWatchLater}
            >
              <Clock className="mr-3 h-4 w-4" />
              Watch Later
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={handleAddToPlaylist}
            >
              <ListPlus className="mr-3 h-4 w-4" />
              Add to Playlist
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              asChild
            >
              <a href="#comments">
                <MessageSquare className="mr-3 h-4 w-4" />
                View Comments
              </a>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-start">
              <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-primary font-bold">
                {sermon.speaker.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{sermon.speaker}</p>
                <p className="text-sm text-muted-foreground">Speaker</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
