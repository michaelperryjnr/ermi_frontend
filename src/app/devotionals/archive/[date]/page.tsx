"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DevotionalCard } from "@/components/devotional/devotionalCard";
import { DevotionalFilters } from "@/components/devotional/devotionalFilters";
import { DevotionalCategories } from "@/components/devotional/devotionalCategories";
import Data from "@/data";
import Link from "next/link";

const devotionals = Data.devotionals;

export default function DevotionalArchivePage() {
  const { date } = useParams();
  const [filters, setFilters] = useState({
    categories: [],
    author: "All Authors",
    sortBy: "newest",
  }) as any;

  // Parse the date from the URL (format: month-year, e.g., "march-2025")
  const formattedDate = date!.toString().replace("-", " ");
  const [month, year] = formattedDate.split(" ");

  // Format for display (capitalize first letter)
  const displayMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const displayDate = `${displayMonth} ${year}`;

  // Filter devotionals by month and year - using useMemo to prevent recalculation on every render
  const archiveDevotionals = useMemo(() => {
    return devotionals.filter((devotional) => {
      const devotionalDate = new Date(devotional.date);
      return (
        devotionalDate.getFullYear() === Number.parseInt(year) &&
        devotionalDate
          .toLocaleString("default", { month: "long" })
          .toLowerCase() === month.toLowerCase()
      );
    });
  }, [month, year]);

  // Apply additional filters (categories, author) - using useMemo to prevent recalculation on every render
  const filteredDevotionals = useMemo(() => {
    let result = [...archiveDevotionals];

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((devotional) =>
        devotional.categories?.some((category: any) =>
          filters.categories.includes(category)
        )
      );
    }

    // Filter by author
    if (filters.author !== "All Authors") {
      result = result.filter(
        (devotional) => devotional.author === filters.author
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        return [...result].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return [...result].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "a-z":
        return [...result].sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return [...result].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }, [archiveDevotionals, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Link href="/devotionals">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Devotionals
            </Button>
          </Link>
        </div>

        <div className="mb-12">
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-2 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Devotional Archives</h1>
            <p className="text-xl text-muted-foreground">{displayDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Content */}
          <div className="lg:col-span-1 space-y-8">
            <DevotionalCategories
              onCategorySelect={(category: any) => {
                setFilters((prev: any) => ({
                  ...prev,
                  categories: prev.categories.includes(category)
                    ? prev.categories.filter((c: any) => c !== category)
                    : [...prev.categories, category],
                }));
              }}
              selectedCategories={filters.categories}
            />

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Archive Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Viewing devotionals from {displayDate}.
              </p>
              <p className="text-sm text-muted-foreground">
                Total devotionals: {archiveDevotionals.length}
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-medium mb-2">Looking for more?</h3>
              <p className="text-sm mb-4">
                Browse our complete collection of devotionals or subscribe to
                receive daily devotionals.
              </p>
              <div className="space-y-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/devotionals">All Devotionals</Link>
                </Button>
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">
                  {filteredDevotionals.length}{" "}
                  {filteredDevotionals.length === 1
                    ? "Devotional"
                    : "Devotionals"}
                </h2>
                <DevotionalFilters onFilterChange={handleFilterChange} />
              </div>
            </div>

            <motion.div
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredDevotionals.map((devotional) => (
                <motion.div key={devotional.id} variants={item}>
                  <DevotionalCard
                    id={devotional.id}
                    title={devotional.title}
                    date={devotional.date}
                    verse={devotional.verse}
                    verseText={devotional.verseText}
                    content={devotional.content}
                    author={devotional.author}
                    categories={devotional.categories}
                    isCompact={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            {filteredDevotionals.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-medium mb-2">
                  No devotionals found
                </h3>
                <p className="text-muted-foreground mb-4">
                  There are no devotionals matching your filters for{" "}
                  {displayDate}.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/devotionals">View All Devotionals</Link>
                </Button>
              </div>
            )}

            {/* Archive Navigation */}
            <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
              <Button variant="outline" asChild className="flex-1">
                <Link
                  href={`/devotionals/archive/february-2025`}
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Month
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link
                  href={`/devotionals/archive/april-2025`}
                  className="flex items-center justify-center gap-2"
                >
                  Next Month
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
