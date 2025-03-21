import { Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ScriptureQuote } from "@/components/blog";

interface DevotionalCardProps {
  id: number;
  title: string;
  date: string;
  verse: string;
  verseText: string;
  content: string;
  author: string;
  categories?: string[];
  isCompact?: boolean;
}

export function DevotionalCard({
  id,
  title,
  date,
  verse,
  verseText,
  content,
  author,
  categories = ["Faith", "Peace"],
  isCompact = false,
}: DevotionalCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card
      className={`h-full hover:shadow-md transition-shadow ${
        !isCompact ? "border-t-4 border-t-primary" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {formattedDate}
          </div>
        </div>
        <CardTitle className={isCompact ? "text-xl" : "text-2xl mt-2"}>
          {title}
        </CardTitle>
        <CardDescription>By {author}</CardDescription>
        {categories && (
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCompact && (
          <div>
            <ScriptureQuote
              reference={verse}
              children={verseText}
              translation="NIV"
            />
          </div>
        )}
        <div className="prose max-w-none dark:prose-invert">
          <p className={isCompact ? "line-clamp-3" : ""}>{content}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link
            href={`/devotionals/${id}`}
            className="flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {isCompact ? "Read Full Devotional" : "Continue Reading"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
