"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Sermon } from "@/types";
import { formatDate } from "@/lib";
import { Play, Calendar, Book } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./sermonsPagination";

interface SermonsGridProps {
  sermons: {
    data: Sermon[];
    totalPages: number;
    currentPage: number;
  };
}

export default function SermonsGrid({ sermons }: SermonsGridProps) {
  const { data, totalPages, currentPage } = sermons;

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No sermons found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((sermon, index) => (
          <SermonCard key={sermon.id} sermon={sermon} index={index} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}

interface SermonCardProps {
  sermon: Sermon;
  index: number;
}

function SermonCard({ sermon, index }: SermonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-video group">
          <Image
            src={sermon.image || "/placeholder.svg?height=400&width=600"}
            alt={sermon.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link href={`/sermons/${sermon.id}?watch=true`}>
              <Button
                size="icon"
                className="rounded-full bg-primary/90 hover:bg-primary"
              >
                <Play className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/70">
            {sermon.duration}
          </Badge>
        </div>

        <CardContent className="pt-4 flex-1">
          <Link href={`/sermons/${sermon.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              {sermon.title}
            </h3>
          </Link>

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span>{formatDate(sermon.date)}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Book className="mr-1 h-3.5 w-3.5" />
            <span>{sermon.scripture}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4 border-t mt-auto">
          <div className="w-full flex items-center justify-between mt-2">
            <Badge
              variant="outline"
              className="bg-primary/5 hover:bg-primary/10"
            >
              {sermon.speaker}
            </Badge>

            <Button variant="ghost" size="sm" asChild>
              <Link href={`/sermons/${sermon.id}`}>Watch Now</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
