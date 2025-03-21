"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Bookmark,
  Heart,
  Printer,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScriptureQuote, BlockQuote } from "@/components/blog";
import Link from "next/link";
import Data, { getDevotionalById } from "@/data";
import { DevotionalComments } from "@/components/devotional/devotionalComments";
import { RelatedDevotionals } from "@/components/devotional/relatedDevotionals";

const devotionals = Data.devotionals;

export default function DevotionalPage() {
  const { id } = useParams();
  const devotional = getDevotionalById(Number(id));

  if (!devotional) {
    notFound();
  }

  const formattedDate = new Date(devotional.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Find index of current devotional to get previous and next
  const currentIndex = devotionals.findIndex((d) => d.id === devotional.id);
  const prevDevotional =
    currentIndex < devotionals.length - 1
      ? devotionals[currentIndex + 1]
      : null;
  const nextDevotional =
    currentIndex > 0 ? devotionals[currentIndex - 1] : null;

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="mb-8">
        <Link href="/devotionals">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Devotionals
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {formattedDate}
            </div>
            <h1 className="text-4xl font-bold mb-4">{devotional.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              By {devotional.author}
            </p>

            {devotional.categories && (
              <div className="flex flex-wrap gap-2 mb-6">
                {devotional.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <ScriptureQuote
              reference={devotional.verse}
              children={devotional.verseText}
              translation="NIV"
            />
          </div>

          <div className="prose max-w-none dark:prose-invert mb-8">
            {devotional.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {devotional.quote && (
            <div className="mb-8">
              <BlockQuote
                author={devotional.quote.author}
                children={devotional.quote.text}
                source={devotional.quote.source || "Unknown"}
              />
            </div>
          )}

          {devotional.relatedScriptures && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Related Scriptures</h3>
              <ul className="list-disc pl-5 space-y-2">
                {devotional.relatedScriptures.map((scripture, index) => (
                  <li key={index}>{scripture}</li>
                ))}
              </ul>
            </div>
          )}

          {devotional.prayerPoints && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Prayer Points</h3>
              <ul className="list-disc pl-5 space-y-2">
                {devotional.prayerPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Like
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {prevDevotional && (
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Previous Devotional
                </p>
                <Link href={`/devotional/${prevDevotional.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <div className="text-left">
                      <p className="font-medium">{prevDevotional.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(prevDevotional.date).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                </Link>
              </div>
            )}

            {nextDevotional && (
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 text-right">
                  Next Devotional
                </p>
                <Link href={`/devotional/${nextDevotional.id}`}>
                  <Button variant="outline" className="w-full justify-end">
                    <div className="text-right">
                      <p className="font-medium">{nextDevotional.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(nextDevotional.date).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <DevotionalComments />
          </div>
        </motion.div>

        {/* Aside/Sidebar */}
        <motion.aside
          className="space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Author Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">About the Author</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {devotional.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium">{devotional.author}</p>
                <p className="text-sm text-muted-foreground">
                  Devotional Writer
                </p>
              </div>
            </div>
            <p className="text-sm">
              {devotional.author} is a devoted writer who shares spiritual
              insights to help readers grow in their faith journey.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {devotional.categories?.map((category) => (
                <Badge key={category} variant="outline" className="px-3 py-1">
                  {category}
                </Badge>
              )) || (
                <p className="text-sm text-muted-foreground">
                  No categories available
                </p>
              )}
            </div>
          </div>

          {/* Share Options */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Share This Devotional
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Related Devotionals */}
          <RelatedDevotionals
            devotionals={devotionals}
            currentId={devotional.id}
          />

          {/* Subscribe */}
          <div className="bg-primary/5 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Daily Devotionals</h3>
            <p className="text-sm mb-4">
              Receive daily devotionals directly in your inbox.
            </p>
            <Button className="w-full">Subscribe</Button>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
