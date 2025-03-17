"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface SearchResultsProps {
  searchResults: any[];
  searchQuery: string;
  navigateToSearchResult: (result: any) => void;
  setIsSearching: (isSearching: boolean) => void;
}

export function SearchResults({
  searchResults,
  searchQuery,
  navigateToSearchResult,
  setIsSearching,
}: SearchResultsProps) {
  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
    );
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">
            Search Results{" "}
            {searchResults.length > 0 ? `(${searchResults.length})` : ""}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearching(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => navigateToSearchResult(result)}
              >
                <p className="font-medium text-sm">
                  {result.bookName} {result.chapter}:{result.verse}
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerms(result.text, searchQuery),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No results found for "{searchQuery}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
