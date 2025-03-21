import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Devotional } from "@/types";

interface RelatedDevotionalsProps {
  devotionals: Devotional[];
  currentId: number;
}

export function RelatedDevotionals({
  devotionals,
  currentId,
}: RelatedDevotionalsProps) {
  // Filter out current devotional and limit to 3
  const relatedDevotionals = devotionals
    .filter((d) => d.id !== currentId)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Related Devotionals</h3>

      <div className="space-y-4">
        {relatedDevotionals.map((devotional) => (
          <Card key={devotional.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(devotional.date).toLocaleDateString()}
              </div>
              <CardTitle className="text-base line-clamp-1">
                {devotional.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {devotional.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs line-clamp-2">{devotional.content}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                <Link
                  href={`/devotional/${devotional.id}`}
                  className="flex items-center text-xs text-primary"
                >
                  Read More
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button variant="outline" asChild className="w-full">
        <Link href="/devotionals">View All Devotionals</Link>
      </Button>
    </div>
  );
}
