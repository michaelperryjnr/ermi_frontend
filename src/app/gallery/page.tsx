"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sun,
  Moon,
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
  },
  {
    id: 2,
    title: "Youth Retreat",
    description: "Annual youth retreat at Camp Wilderness",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-02-15",
    department: "Main Youth",
  },
  {
    id: 3,
    title: "Women's Conference",
    description: "Annual women's conference",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-01-20",
    department: "Women's Fellowship",
  },
  {
    id: 4,
    title: "Men's Breakfast",
    description: "Monthly men's breakfast and Bible study",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-03-05",
    department: "Men's Fellowship",
  },
  {
    id: 5,
    title: "Teen Game Night",
    description: "Fun and fellowship for our teenagers",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-02-28",
    department: "Teen Youth",
  },
  {
    id: 6,
    title: "Christmas Service",
    description: "Celebrating the birth of our Savior",
    image: "/placeholder.svg?height=600&width=800",
    date: "2024-12-25",
    department: "General",
  },
  {
    id: 7,
    title: "Baptism Service",
    description: "Celebrating new believers in Christ",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-01-12",
    department: "General",
  },
  {
    id: 8,
    title: "Community Outreach",
    description: "Serving our local community",
    image: "/placeholder.svg?height=600&width=800",
    date: "2025-02-08",
    department: "General",
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredGallery =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.department === filter);

  const handlePrevious = () => {
    if (selectedImage === null) return;

    const currentIndex = filteredGallery.findIndex(
      (item) => item.id === selectedImage
    );
    const prevIndex =
      (currentIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setSelectedImage(filteredGallery[prevIndex].id);
  };

  const handleNext = () => {
    if (selectedImage === null) return;

    const currentIndex = filteredGallery.findIndex(
      (item) => item.id === selectedImage
    );
    const nextIndex = (currentIndex + 1) % filteredGallery.length;
    setSelectedImage(filteredGallery[nextIndex].id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Gallery</h1>
            <p className="text-muted-foreground">
              Moments captured from our church community and events
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="flex flex-wrap justify-center mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="General">General</TabsTrigger>
            <TabsTrigger value="Main Youth">Main Youth</TabsTrigger>
            <TabsTrigger value="Teen Youth">Teen Youth</TabsTrigger>
            <TabsTrigger value="Women's Fellowship">
              Women's Fellowship
            </TabsTrigger>
            <TabsTrigger value="Men's Fellowship">Men's Fellowship</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            <motion.div
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredGallery.map((galleryItem) => (
                <motion.div
                  key={galleryItem.id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                >
                  <Link href={`/gallery/${galleryItem.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={galleryItem.image || "/placeholder.svg"}
                        alt={galleryItem.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="text-white font-medium">
                            {galleryItem.title}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {formatDate(galleryItem.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {filteredGallery.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No Images Found</h3>
                <p className="text-muted-foreground mb-6">
                  There are no images for this department
                </p>
                <Button onClick={() => setFilter("all")}>
                  View All Images
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-4xl p-4">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/50 backdrop-blur-sm"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/50 backdrop-blur-sm"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/50 backdrop-blur-sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg">
                {filteredGallery.find((item) => item.id === selectedImage) && (
                  <Image
                    src={
                      filteredGallery.find((item) => item.id === selectedImage)!
                        .image || "/placeholder.svg"
                    }
                    alt={
                      filteredGallery.find((item) => item.id === selectedImage)!
                        .title
                    }
                    fill
                    className="object-contain"
                  />
                )}
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

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">
                  {
                    filteredGallery.find((item) => item.id === selectedImage)
                      ?.title
                  }
                </h2>
                <p className="text-muted-foreground">
                  {
                    filteredGallery.find((item) => item.id === selectedImage)
                      ?.description
                  }
                </p>
                <p className="text-sm mt-1">
                  {formatDate(
                    filteredGallery.find((item) => item.id === selectedImage)
                      ?.date || ""
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
