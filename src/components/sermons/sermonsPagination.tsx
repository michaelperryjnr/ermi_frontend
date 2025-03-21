"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/sermons?${params.toString()}`;
  };

  // Generate page numbers to display
  const generatePagination = () => {
    // If there are 7 or fewer pages, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Add current page and pages around it
    const leftSiblingIndex = Math.max(currentPage - 1, firstPage);
    const rightSiblingIndex = Math.min(currentPage + 1, lastPage);

    // Don't show dots if there's only one number in between
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;

    // Case 1: Show left dots but no right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 5;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => lastPage - rightItemCount + i + 1
      );
      return [firstPage, "leftDots", ...rightRange];
    }

    // Case 2: Show right dots but no left dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 5;
      const leftRange = Array.from(
        { length: leftItemCount },
        (_, i) => firstPage + i
      );
      return [...leftRange, "rightDots", lastPage];
    }

    // Case 3: Show both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPage, "leftDots", ...middleRange, "rightDots", lastPage];
    }
  };

  const pages = generatePagination() || [];

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pages.map((page, i) => {
        if (page === "leftDots" || page === "rightDots") {
          return (
            <Button key={`dots-${i}`} variant="outline" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </Button>
          );
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => router.push(createPageURL(page))}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
