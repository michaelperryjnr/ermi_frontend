import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { AnimationVariants, formatDate } from "@/lib";
import { BlogPost } from "@/types";

interface BlogPreviewSectionProps {
  data: BlogPost[];
}

const BlogPreviewSection = ({ data }: BlogPreviewSectionProps) => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">From Our Blog</h2>
            <p className="text-muted-foreground mt-2">
              Insights and inspiration for your spiritual journey
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="ghost" className="group" asChild>
              <Link href="/blog" className="flex items-center">
                View All Posts
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
          {data.map((post, index) => (
            <motion.div key={index} variants={AnimationVariants.item}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(post.date)}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="h-auto" asChild>
                    <Link
                      href={`/blog/${post.id}`}
                      className="flex items-center text-primary"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
