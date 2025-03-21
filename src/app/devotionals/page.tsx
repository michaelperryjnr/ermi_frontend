"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DevotionalHero } from "@/components/devotional/devotionalHero";
import { DevotionalFilters } from "@/components/devotional/devotionalFilters";
import { DevotionalCard } from "@/components/devotional/devotionalCard";
import { DevotionalCategories } from "@/components/devotional/devotionalCategories";
import { DevotionalArchives } from "@/components/devotional/devotionalArchives";
import { getLatestDevotional, getFilteredDevotionals } from "@/data";

export default function DevotionalsPage() {
  const latestDevotional = getLatestDevotional();
  const [filters, setFilters] = useState({
    categories: [] as any[],
    author: "All Authors",
    sortBy: "newest",
  });

  const filteredDevotionals = getFilteredDevotionals(filters);

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
        <div className="mb-12">
          <DevotionalHero
            title={latestDevotional.title}
            verse={latestDevotional.verse}
            verseText={latestDevotional.verseText}
            date={latestDevotional.date}
            author={latestDevotional.author}
            id={latestDevotional.id}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Content */}
          <div className="lg:col-span-1 space-y-8">
            <DevotionalCategories
              onCategorySelect={(category) => {
                setFilters((prev) => ({
                  ...prev,
                  categories: prev.categories.includes(category)
                    ? prev.categories.filter((c) => c !== category)
                    : [...prev.categories, category],
                }));
              }}
              selectedCategories={filters.categories}
            />

            <DevotionalArchives />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Browse Devotionals</h2>
              <DevotionalFilters onFilterChange={handleFilterChange} />
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
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">
                  No devotionals found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
