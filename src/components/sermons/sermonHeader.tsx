"use client";

import { motion } from "framer-motion";
import type { Sermon } from "@/types";
import { formatDate } from "@/lib";
import { ChevronLeft, Calendar, Book, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SermonHeaderProps {
  sermon: Sermon;
}

export default function SermonHeader({ sermon }: SermonHeaderProps) {
  const router = useRouter();
  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          asChild
          onClick={() => {
            router.back();
          }}
          className="mb-4 -ml-2 text-muted-foreground"
        >
          <div className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </div>
        </Button>
      </motion.div>

      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {sermon.title}
      </motion.h1>

      <motion.div
        className="flex flex-wrap gap-x-6 gap-y-3 text-muted-foreground mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          {formatDate(sermon.date)}
        </div>

        <div className="flex items-center text-sm">
          <Book className="mr-2 h-4 w-4 text-primary" />
          {sermon.scripture}
        </div>

        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-primary" />
          {sermon.duration}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
          {sermon.speaker}
        </Badge>
      </motion.div>
    </div>
  );
}
