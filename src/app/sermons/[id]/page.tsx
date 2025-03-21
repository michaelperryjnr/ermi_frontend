import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSermonById, getRelatedSermons } from "@/data";
import SermonView from "@/components/sermons/sermonView";

interface SermonPageProps {
  params: {
    id: string;
  };
  searchParams: {
    listen?: string;
    read?: string;
  };
}

export async function generateMetadata({
  params,
}: SermonPageProps): Promise<Metadata> {
  const sermon = await getSermonById(params.id);

  if (!sermon) {
    return {
      title: "Sermon Not Found",
    };
  }

  return {
    title: `${sermon.title} | Sermons`,
    description: `Listen to "${sermon.title}" by ${sermon.speaker}. Scripture: ${sermon.scripture}`,
  };
}

export default async function SermonPage({
  params,
  searchParams,
}: SermonPageProps) {
  const sermon = await getSermonById(params.id);

  if (!sermon) {
    notFound();
  }

  const relatedSermons = await getRelatedSermons(sermon.id, 4);
  const isListenMode = searchParams.listen === "true";
  const isReadMode = searchParams.read === "true";

  return (
    <SermonView
      sermon={sermon}
      relatedSermons={relatedSermons}
      isListenMode={isListenMode}
      isReadMode={isReadMode}
    />
  );
}
