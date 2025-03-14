"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import Data from "@/data";

// Mock data for blog posts

const blogPosts = Data.blogPosts;

// Categories derived from blog posts
const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ERMI Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, inspiration, and practical wisdom for your spiritual
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Featured Post */}
            {filteredPosts.length > 0 && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative h-80">
                    <Image
                      src={filteredPosts[0].image || "/placeholder.svg"}
                      alt={filteredPosts[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(filteredPosts[0].date)}</span>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-2" />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {filteredPosts[0].title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {filteredPosts[0].excerpt}
                    </p>
                    <Button asChild>
                      <Link href={`/blog/${filteredPosts[0].id}`}>
                        Read Full Article
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Blog Posts Grid */}
            <motion.div
              className="grid gap-6 grid-cols-1 md:grid-cols-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredPosts.slice(1).map((post) => (
                <motion.div key={post.id} variants={item}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
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
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <Button variant="ghost" className="p-0 h-auto" asChild>
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

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Search</h3>
                <div className="flex">
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button className="rounded-l-none">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <Tabs defaultValue="All" onValueChange={setActiveCategory}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Recent">Recent</TabsTrigger>
                  </TabsList>
                  <div className="space-y-1">
                    {["All", ...categories].map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className={`w-full justify-start ${
                          activeCategory === category ? "bg-muted" : ""
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium line-clamp-2">
                          <Link
                            href={`/blog/${post.id}`}
                            className="hover:text-primary"
                          >
                            {post.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest articles and updates delivered to your inbox
                </p>
                <Input placeholder="Your email address" className="mb-2" />
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
