"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import Data from "@/data";

const devotionals = Data.devotionals;

// Group devotionals by year and month - moved outside component to prevent recalculation
const getArchiveStructure = () => {
  const archiveMap: Map<any, any> = new Map();

  devotionals.forEach((devotional) => {
    const date = new Date(devotional.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    if (!archiveMap.has(year)) {
      archiveMap.set(year, new Map());
    }

    const yearMap = archiveMap.get(year);
    if (!yearMap.has(month)) {
      yearMap.set(month, []);
    }

    yearMap.get(month).push(devotional);
  });

  // Convert to array structure sorted by year (descending) and month
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const archiveStructure: any[] = [];

  // Sort years in descending order
  const sortedYears = Array.from(archiveMap.keys()).sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    const yearData: any = {
      year,
      months: [],
    };

    const yearMap = archiveMap.get(year);

    // Sort months in chronological order
    const sortedMonths = Array.from(yearMap.keys()).sort(
      (a: any, b: any) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    sortedMonths.forEach((month) => {
      const devotionalsList = yearMap.get(month);
      yearData.months.push({
        month,
        count: devotionalsList.length,
        devotionals: devotionalsList,
      });
    });

    archiveStructure.push(yearData);
  });

  return archiveStructure;
};

// Calculate this once outside the component
const archiveStructureData = getArchiveStructure();
const totalDevotionalsCount = archiveStructureData.reduce(
  (total, yearData) =>
    total +
    yearData.months.reduce(
      (yearTotal: any, monthData: any) => yearTotal + monthData.count,
      0
    ),
  0
);

export default function DevotionalArchivesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  // Filter archives based on search term - using useMemo to prevent recalculation on every render
  const filteredArchives = useMemo(() => {
    if (!searchTerm) return archiveStructureData;

    return archiveStructureData
      .map((yearData) => ({
        ...yearData,
        months: yearData.months.filter(
          (monthData: any) =>
            monthData.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
            yearData.year.toString().includes(searchTerm)
        ),
      }))
      .filter((yearData) => yearData.months.length > 0);
  }, [searchTerm]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
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
            <p className="text-muted-foreground">
              Browse our complete collection of {totalDevotionalsCount}{" "}
              devotionals organized by date
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Archives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by year or month..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Example: "2025" or "March"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Archive Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Total Devotionals</p>
                  <p className="text-2xl font-bold">{totalDevotionalsCount}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Years</p>
                  <p className="text-2xl font-bold">
                    {archiveStructureData.length}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Most Recent</p>
                  <p className="text-lg font-medium">
                    {
                      archiveStructureData[0]?.months[
                        archiveStructureData[0].months.length - 1
                      ]?.month
                    }{" "}
                    {archiveStructureData[0]?.year}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-medium mb-2">
                Looking for today's devotional?
              </h3>
              <p className="text-sm mb-4">
                Read today's devotional or browse our featured content.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/devotionals">Today's Devotional</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Browse by Date</h2>

            {filteredArchives.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No archives found</h3>
                <p className="text-muted-foreground mb-4">
                  No archives match your search term "{searchTerm}".
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArchives.map((yearData) => (
                  <Collapsible
                    key={yearData.year}
                    open={expandedYears.includes(yearData.year)}
                    onOpenChange={() => toggleYear(yearData.year)}
                  >
                    <Card>
                      <CollapsibleTrigger className="w-full text-left">
                        <CardHeader className="flex flex-row items-center justify-between p-4">
                          <CardTitle className="text-xl">
                            {yearData.year}
                          </CardTitle>
                          <Badge variant="outline" className="ml-auto mr-2">
                            {yearData.months.reduce(
                              (total: any, month: any) => total + month.count,
                              0
                            )}{" "}
                            devotionals
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            {expandedYears.includes(yearData.year) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {yearData.months.map((monthData: any) => (
                              <Link
                                key={`${yearData.year}-${monthData.month}`}
                                href={`/devotionals/archive/${monthData.month.toLowerCase()}-${
                                  yearData.year
                                }`}
                                className="block"
                              >
                                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium">
                                      {monthData.month}
                                    </h3>
                                    <Badge>{monthData.count}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {monthData.count} devotional
                                    {monthData.count !== 1 ? "s" : ""}
                                  </p>
                                  <div className="mt-2 text-xs text-primary flex items-center">
                                    View Archive
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
