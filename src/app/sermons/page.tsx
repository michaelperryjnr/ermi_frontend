import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllSermons } from "@/data";
import SermonsGrid from "@/components/sermons/sermonsGrid";
import SermonsHeader from "@/components/sermons/sermonsHeader";
import SermonsFilter from "@/components/sermons/sermonFilter";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sermons | Church Name",
  description: "Browse and search our collection of sermons",
};

interface SermonsPageProps {
  searchParams: {
    q?: string;
    speaker?: string;
    scripture?: string;
    sort?: string;
    page?: string;
  };
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const { q, speaker, scripture, sort = "newest", page = "1" } = searchParams;
  const currentPage = Number.parseInt(page, 10);

  const sermons = await getAllSermons({
    search: q,
    speaker,
    scripture,
    sort: sort as "newest" | "oldest" | "popular",
    page: currentPage,
    limit: 12,
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 mx-auto py-8">
        <SermonsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <SermonsFilter
              selectedSpeaker={speaker}
              selectedScripture={scripture}
              selectedSort={sort}
              searchQuery={q}
            />
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<SermonsGridSkeleton />}>
              <SermonsGrid sermons={sermons} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

function SermonsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden border shadow-sm">
          <Skeleton className="w-full aspect-video" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
