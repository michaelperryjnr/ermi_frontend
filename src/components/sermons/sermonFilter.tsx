"use client";

import type React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SermonsFilterProps {
  selectedSpeaker?: string;
  selectedScripture?: string;
  selectedSort?: string;
  searchQuery?: string;
  isCompact?: boolean;
}

// Mock data - in a real app, this would come from an API or database
const speakers = [
  "Pastor John Smith",
  "Pastor Sarah Johnson",
  "Pastor Michael Williams",
  "Pastor David Thompson",
  "Pastor Rebecca Lee",
];

const scriptures = [
  "John 14:27",
  "Hebrews 11:1-6",
  "Ephesians 2:10",
  "James 1:2-4",
  "Psalm 95:1-7",
  "Matthew 5:1-12",
  "Romans 8:28-39",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
];

export default function SermonsFilter({
  selectedSpeaker,
  selectedScripture,
  selectedSort = "newest",
  searchQuery,
  isCompact = false,
}: SermonsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (type: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`/sermons?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("sort", "newest");
    router.push(`/sermons?${params.toString()}`);
  };

  const hasActiveFilters =
    selectedSpeaker || selectedScripture || selectedSort !== "newest";

  const FilterCard = ({ children }: { children: React.ReactNode }) => {
    if (isCompact) {
      return <div className="space-y-6">{children}</div>;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Filter Sermons</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FilterCard>
        <div className="space-y-6">
          {/* Sort */}
          <div>
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {sortOptions.find((option) => option.value === selectedSort)
                    ?.label || "Newest First"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleFilterChange("sort", option.value)}
                      className="flex items-center justify-between"
                    >
                      {option.label}
                      {option.value === selectedSort && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Speaker Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Speaker</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedSpeaker || "All Speakers"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("speaker", null)}
                    className="flex items-center justify-between"
                  >
                    All Speakers
                    {!selectedSpeaker && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <Separator />
                  {speakers.map((speaker) => (
                    <DropdownMenuItem
                      key={speaker}
                      onClick={() => handleFilterChange("speaker", speaker)}
                      className="flex items-center justify-between"
                    >
                      {speaker}
                      {speaker === selectedSpeaker && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Scripture Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Scripture</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedScripture || "All Scriptures"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("scripture", null)}
                    className="flex items-center justify-between"
                  >
                    All Scriptures
                    {!selectedScripture && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  <Separator />
                  {scriptures.map((scripture) => (
                    <DropdownMenuItem
                      key={scripture}
                      onClick={() => handleFilterChange("scripture", scripture)}
                      className="flex items-center justify-between"
                    >
                      {scripture}
                      {scripture === selectedScripture && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Active Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSpeaker && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {selectedSpeaker}
                    <button
                      onClick={() => handleFilterChange("speaker", null)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {selectedScripture && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {selectedScripture}
                    <button
                      onClick={() => handleFilterChange("scripture", null)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {selectedSort !== "newest" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {
                      sortOptions.find(
                        (option) => option.value === selectedSort
                      )?.label
                    }
                    <button
                      onClick={() => handleFilterChange("sort", "newest")}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </FilterCard>
    </motion.div>
  );
}
