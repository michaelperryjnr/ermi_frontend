"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - would come from your API/database in production
const galleryItems = [
  {
    id: 1,
    title: "Sunday Service",
    description: "Worship service on Sunday morning",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-03-10",
    department: "General",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Worship team leading praise",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Pastor preaching",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Congregation worshipping",
      },
      {
        id: 4,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Communion service",
      },
      {
        id: 5,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Fellowship after service",
      },
    ],
  },
  {
    id: 2,
    title: "Youth Retreat",
    description: "Annual youth retreat at Camp Wilderness",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-02-15",
    department: "Main Youth",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Group photo at camp",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Outdoor worship",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Team building activities",
      },
      {
        id: 4,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Bible study session",
      },
    ],
  },
  {
    id: 3,
    title: "Women's Conference",
    description: "Annual women's conference",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-01-20",
    department: "Women's Fellowship",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Conference speakers",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Worship session",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Group discussions",
      },
    ],
  },
  {
    id: 4,
    title: "Men's Breakfast",
    description: "Monthly men's breakfast and Bible study",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-03-05",
    department: "Men's Fellowship",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Men gathered for breakfast",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Bible study discussion",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Prayer time",
      },
    ],
  },
  {
    id: 5,
    title: "Teen Game Night",
    description: "Fun and fellowship for our teenagers",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-02-28",
    department: "Teen Youth",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Teens playing games",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Group activities",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Snack time",
      },
    ],
  },
  {
    id: 6,
    title: "Christmas Service",
    description: "Celebrating the birth of our Savior",
    image: "/placeholder.svg?height=600&width=800",
    date: "2024-12-25",
    department: "General",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Christmas decorations",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Nativity scene",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Christmas choir",
      },
    ],
  },
  {
    id: 7,
    title: "Baptism Service",
    description: "Celebrating new believers in Christ",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-01-12",
    department: "General",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Baptism ceremony",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "New believers",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Congregation celebrating",
      },
    ],
  },
  {
    id: 8,
    title: "Community Outreach",
    description: "Serving our local community",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-02-08",
    department: "General",
    images: [
      {
        id: 1,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Food distribution",
      },
      {
        id: 2,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Volunteers serving",
      },
      {
        id: 3,
        src: "/placeholder.svg?height=800&width=1200",
        alt: "Community members",
      },
    ],
  },
];

export default function GalleryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [album, setAlbum] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      const foundAlbum = galleryItems.find(
        (item) => item.id === Number(params.id)
      );
      if (foundAlbum) {
        setAlbum(foundAlbum);
      }
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const handlePrevious = () => {
    if (!album) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? album.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!album) return;
    setCurrentImageIndex((prev) =>
      prev === album.images.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Album Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The gallery album you're looking for doesn't exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/gallery">Back to Gallery</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/gallery" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
          <p className="text-muted-foreground mb-1">{album.description}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(album.date)} • {album.department}
          </p>
        </div>

        {/* Main Image Viewer */}
        <div className="relative mb-8">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <Image
              src={album.images[currentImageIndex].src || "/placeholder.svg"}
              alt={album.images[currentImageIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/50 backdrop-blur-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/50 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-background/50 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-background/50 backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full">
            <p className="text-sm">
              {currentImageIndex + 1} / {album.images.length}
            </p>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {album.images.map((image: any, index: number) => (
            <div
              key={image.id}
              className={`relative aspect-square overflow-hidden rounded-md cursor-pointer ${
                index === currentImageIndex ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
