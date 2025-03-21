"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock categories for filtering
const categories = [
  "Faith",
  "Prayer",
  "Hope",
  "Love",
  "Grace",
  "Wisdom",
  "Peace",
  "Joy",
  "Patience",
  "Kindness",
];

interface DevotionalCategoriesProps {
  onCategorySelect: (category: string) => void;
  selectedCategories: string[];
}

export function DevotionalCategories({
  onCategorySelect,
  selectedCategories,
}: DevotionalCategoriesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
