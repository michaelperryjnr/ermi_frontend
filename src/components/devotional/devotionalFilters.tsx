"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DevotionalFiltersProps {
  onFilterChange: (filters: {
    categories: string[];
    author: string;
    sortBy: string;
  }) => void;
}

// Mock data
const authors = [
  "All Authors",
  "Pastor Johnson",
  "Elder Smith",
  "Deacon Williams",
  "Sister Mary",
];
const categories = [
  "Faith",
  "Prayer",
  "Hope",
  "Love",
  "Grace",
  "Wisdom",
  "Peace",
  "Joy",
];

export function DevotionalFilters({ onFilterChange }: DevotionalFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [author, setAuthor] = useState("All Authors");
  const [sortBy, setSortBy] = useState("newest");

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      onFilterChange({
        categories: newCategories,
        author,
        sortBy,
      });

      return newCategories;
    });
  };

  const handleAuthorChange = (value: string) => {
    setAuthor(value);
    onFilterChange({
      categories: selectedCategories,
      author: value,
      sortBy,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({
      categories: selectedCategories,
      author,
      sortBy: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Categories
            {selectedCategories.length > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {selectedCategories.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select value={author} onValueChange={handleAuthorChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Author" />
        </SelectTrigger>
        <SelectContent>
          {authors.map((author) => (
            <SelectItem key={author} value={author}>
              {author}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="a-z">A-Z</SelectItem>
          <SelectItem value="z-a">Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
