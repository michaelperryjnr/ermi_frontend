import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimationVariants } from "@/lib";
import { GalleryItem } from "@/types";

interface GalleryPreviewSectionProps {
  galleryPreview: Partial<GalleryItem>[];
}

const GalleryPreviewSection = ({
  galleryPreview,
}: GalleryPreviewSectionProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">Photo Gallery</h2>
            <p className="text-muted-foreground mt-2">
              Moments captured from our church community
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="ghost" className="group" asChild>
              <Link href="/gallery" className="flex items-center">
                View Full Gallery
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-4 grid-cols-2 md:grid-cols-4"
          variants={AnimationVariants.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {galleryPreview.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
            >
              <Link href="/gallery">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={item.image! || "/placeholder.svg"}
                    alt={item.title!}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-white font-medium p-4">{item.title!}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryPreviewSection;
