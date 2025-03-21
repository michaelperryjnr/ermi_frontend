"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Sermon } from "@/types";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockQuote, ScriptureQuote } from "../blog";

interface SermonContentProps {
  sermon: Sermon;
  expanded?: boolean;
}

export default function SermonContent({
  sermon,
  expanded = false,
}: SermonContentProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

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

  // Sample sermon content with proper formatting for our renderer
  const sermonContent = `
## Introduction

Today we're looking at ${sermon.scripture}, a powerful passage that reminds us of God's faithfulness.

<ScriptureQuote reference="${sermon.scripture}" translation="NIV">
For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. For God did not send his Son into the world to condemn the world, but to save the world through him.
</ScriptureQuote>

## Key Principles

In this scripture, we see three important principles:

1. God's love is unconditional and everlasting
2. We are called to respond to this love with faithful obedience
3. The community of believers strengthens each individual's faith journey

## Historical Context

When we examine the context of this passage, we find that it was written during a time of great uncertainty. The people were facing challenges that tested their faith, much like many of us experience today.

<BlockQuote author="Charles Spurgeon" source="Morning and Evening">
Even in our darkest moments, God's light continues to shine, guiding us forward on the path of righteousness.
</BlockQuote>

## Application

The author reminds us that even in difficult times, God's promises remain true. We can trust in His word and His character, knowing that He is working all things together for good for those who love Him.

As we apply this to our lives today, let's consider how we might respond to God's faithfulness with our own faithful actions. How might we demonstrate our trust in Him through our daily choices?

## Conclusion

Let us go forth with renewed confidence in God's promises, living out our faith in tangible ways that reflect His love to the world around us.
  `;

  // Truncated content for preview mode
  const truncatedContent = `
## Introduction

Today we're looking at ${sermon.scripture}, a powerful passage that reminds us of God's faithfulness.

<ScriptureQuote reference="${sermon.scripture}" translation="NIV">
Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid
</ScriptureQuote>

## Key Principles

In this scripture, we see three important principles:

1. God's love is unconditional and everlasting
2. We are called to respond to this love with faithful obedience
3. The community of believers strengthens each individual's faith journey
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={expanded ? "bg-card rounded-xl shadow-sm border p-6" : ""}
    >
      {expanded && (
        <div className="flex items-center mb-6">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Sermon Transcript</h2>
        </div>
      )}

      <div className="prose prose-slate max-w-none">
        {renderContent(
          isExpanded || expanded ? sermonContent : truncatedContent
        )}
      </div>

      {!expanded && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center text-primary"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}
