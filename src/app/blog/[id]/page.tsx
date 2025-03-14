"use client";

import React, { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  BookOpen,
  MessageSquareQuote,
} from "lucide-react";
import {
  ScriptureQuote,
  BlockQuote,
  TableOfContents,
  ReadingProgressBar,
} from "@/components/blog";
import Data from "@/data";

const blogPosts = Data.blogPosts;

// Get related posts based on category
const getRelatedPosts = (currentPost: any) => {
  return blogPosts
    .filter(
      (post) =>
        post.id !== currentPost.id && post.category === currentPost.category
    )
    .slice(0, 2);
};

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  const { id } = use(params);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);

      // Simulate API fetch
      setTimeout(() => {
        const foundPost = blogPosts.find((p) => p.id === id);

        if (foundPost) {
          setPost(foundPost);
          setRelatedPosts(getRelatedPosts(foundPost));

          // Extract headings for table of contents
          const headingRegex = /## (.*?)(?=\n|$)/g;
          const matches = [...foundPost.content.matchAll(headingRegex)];
          const extractedHeadings = matches.map((match) => ({
            id: match[1].toLowerCase().replace(/\s+/g, "-"),
            text: match[1],
          }));
          setHeadings(extractedHeadings);
        }

        setIsLoading(false);
      }, 500);
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // Function to process the content and replace MDX-like components with actual JSX
  const renderContent = (content: string) => {
    if (!content) return null;

    // Split content by sections that might contain our custom components
    const sections = content.split(
      /(<ScriptureQuote[\s\S]*?<\/ScriptureQuote>|<BlockQuote[\s\S]*?<\/BlockQuote>)/g
    );

    return sections.map((section, index) => {
      // Handle ScriptureQuote component
      if (section.startsWith("<ScriptureQuote")) {
        const referenceMatch = section.match(/reference="([^"]*)"/);
        const translationMatch = section.match(/translation="([^"]*)"/);
        const textMatch = section.match(/>([\s\S]*?)<\/ScriptureQuote>/);

        const reference = referenceMatch ? referenceMatch[1] : "";
        const translation = translationMatch ? translationMatch[1] : "NIV";
        const text = textMatch ? textMatch[1].trim() : "";

        return (
          <ScriptureQuote
            key={index}
            reference={reference}
            translation={translation}
          >
            {text}
          </ScriptureQuote>
        );
      }

      // Handle BlockQuote component
      if (section.startsWith("<BlockQuote")) {
        const authorMatch = section.match(/author="([^"]*)"/);
        const sourceMatch = section.match(/source="([^"]*)"/);
        const textMatch = section.match(/>([\s\S]*?)<\/BlockQuote>/);

        const author = authorMatch ? authorMatch[1] : undefined;
        const source = sourceMatch ? sourceMatch[1] : undefined;
        const text = textMatch ? textMatch[1].trim() : "";

        return (
          <BlockQuote key={index} author={author} source={source}>
            {text}
          </BlockQuote>
        );
      }

      // Process regular markdown-like content
      if (section.trim()) {
        // Convert markdown headings to HTML
        const processedContent = section
          .replace(/## (.*?)(?=\n|$)/g, (_, heading) => {
            const id = heading.toLowerCase().replace(/\s+/g, "-");
            return `<h2 id="${id}" class="scroll-mt-20 text-2xl font-bold mt-10 mb-4">${heading}</h2>`;
          })
          .replace(
            /### (.*?)(?=\n|$)/g,
            '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>'
          )

          // Convert markdown lists to HTML
          .replace(
            /^\s*-\s+(.*?)(?=\n|$)/gm,
            '<li class="leading-relaxed">$1</li>'
          )
          .replace(
            /^\s*\d+\.\s+(.*?)(?=\n|$)/gm,
            '<li class="leading-relaxed">$1</li>'
          )
          .replace(/(<li.*?<\/li>(?:\n|$))+/g, (match) => {
            return match.includes("1.")
              ? `<ol class="mb-6 ml-6 list-decimal space-y-2">${match}</ol>`
              : `<ul class="mb-6 ml-6 list-disc space-y-2">${match}</ul>`;
          })
          // Convert markdown paragraphs to HTML
          .replace(
            /^(?!<[oh][l23]|<li|<ul|<ol)(.+?)(?=\n|$)/gm,
            '<p class="mb-4 leading-relaxed">$1</p>'
          );

        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        );
      }

      return null;
    });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />

      <div className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-6 group">
              <Link href="/blog" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <article className="bg-card rounded-xl shadow-sm p-6 md:p-8">
                <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                    priority
                  />
                </div>

                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {post.author}
                      </span>
                    </div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>

                  {headings.length > 0 && (
                    <div className="mb-8 p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 font-medium mb-2">
                        <BookOpen className="h-4 w-4" />
                        <span>In this article:</span>
                      </div>
                      <TableOfContents headings={headings} />
                    </div>
                  )}
                </div>

                <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                  {renderContent(post.content)}
                </div>

                <Separator className="my-8" />

                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      Share this article:
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Share on Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Share on Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">Share on LinkedIn</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: shareUrl,
                          });
                        } else if (navigator.clipboard) {
                          navigator.clipboard.writeText(shareUrl);
                          alert("Link copied to clipboard!");
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                </div>
              </article>
            </div>

            <div className="space-y-8">
              {/* Author */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">About the Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage
                        src="/placeholder.svg?height=200&width=200"
                        alt={post.author}
                      />
                      <AvatarFallback>
                        {post.author
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{post.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        Church Elder
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Passionate about teaching God's word and helping others grow
                    in their faith journey.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/about#${post.author
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="flex gap-3 group">
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={relatedPost.image || "/placeholder.svg"}
                              alt={relatedPost.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-110 duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              <Link href={`/blog/${relatedPost.id}`}>
                                {relatedPost.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(relatedPost.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquareQuote className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">
                      Subscribe to Our Newsletter
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest articles and updates delivered to your inbox
                  </p>
                  <form className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      required
                    />
                    <Button className="w-full">Subscribe</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(blogPosts.map((post) => post.category))
                    ).map((category) => (
                      <Link
                        key={category}
                        href={`/blog/category/${category.toLowerCase()}`}
                        className="bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full text-sm transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
