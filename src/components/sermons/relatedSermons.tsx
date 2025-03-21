"use client";

import { motion } from "framer-motion";
import type { Sermon } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock } from "lucide-react";

interface RelatedSermonsProps {
  sermons: Sermon[];
  compact?: boolean;
}

export default function RelatedSermons({
  sermons,
  compact = false,
}: RelatedSermonsProps) {
  return (
    <div className="space-y-4">
      {sermons.map((sermon, index) => (
        <motion.div
          key={sermon.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/sermons/${sermon.id}`}
            className="flex gap-3 group hover:bg-accent p-2 rounded-lg transition-colors"
          >
            <div className="relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden">
              <Image
                src={sermon.image || "/placeholder.svg?height=400&width=600"}
                alt={sermon.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium line-clamp-2 text-sm">
                {sermon.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {sermon.speaker}
              </p>

              {!compact && (
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{sermon.duration}</span>
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
