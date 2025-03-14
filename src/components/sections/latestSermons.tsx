import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Headphones, Play } from "lucide-react";
import { AnimationVariants, formatDate } from "@/lib";
import { Sermon } from "@/types";

const LatestSermonsSection = ({
  sermonPreview,
}: {
  sermonPreview: Sermon[];
}) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">Latest Sermons</h2>
            <p className="text-muted-foreground mt-2">
              Listen to our recent messages
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="ghost" className="group" asChild>
              <Link href="/sermons" className="flex items-center">
                View All Sermons
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={AnimationVariants.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {sermonPreview.map((sermon) => (
            <motion.div key={sermon.id} variants={AnimationVariants.item}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="relative h-48 group">
                  <Image
                    src={sermon.image || "/placeholder.svg"}
                    alt={sermon.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-white/20 hover:bg-white/30"
                    >
                      <Play className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{sermon.title}</h3>
                  <p className="text-muted-foreground mb-1">{sermon.speaker}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(sermon.date)}
                  </p>
                  <p className="text-sm mb-4">Scripture: {sermon.scripture}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Headphones className="h-4 w-4 mr-2" />
                    <span>{sermon.duration}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/sermons/${sermon.id}`}>
                        <Headphones className="h-4 w-4 mr-2" />
                        Listen
                      </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/sermons/${sermon.id}?watch=true`}>
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Link>
                    </Button>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/`}>Read</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LatestSermonsSection;
