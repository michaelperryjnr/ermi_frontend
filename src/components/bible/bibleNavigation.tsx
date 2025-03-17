"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Trash2, Highlighter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isMobile } from "@/lib";
import { LabelManager } from "./labelManager";
import { useNotes, useHighlights } from "@/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface BibleNavigationProps {
  bibleBooks: any[];
  selectedBook: any;
  selectedChapter: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  setSelectedBook: (book: any) => void;
  setSelectedChapter: (chapter: number) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  notes: any[];
  highlights: any[];
  labels: any[];
  selectedVersion: string;
}

export function BibleNavigation({
  bibleBooks,
  selectedBook,
  selectedChapter,
  searchQuery,
  setSearchQuery,
  handleSearch,
  setSelectedBook,
  setSelectedChapter,
  setIsSidebarOpen,
  notes,
  highlights,
  labels,
  selectedVersion,
}: BibleNavigationProps) {
  const { deleteNote } = useNotes(selectedVersion);
  const { removeHighlight } = useHighlights(selectedVersion);
  const [activeTab, setActiveTab] = useState("navigation");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="notes" className="relative">
            Notes
            {notes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="highlights" className="relative">
            Highlights
            {highlights.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {highlights.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="labels">Labels</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation" className="space-y-6">
          {/* Search */}
          <div>
            <Label className="mb-2 block">Search Bible</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Search the Bible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full"
              />
              <Button onClick={handleSearch} size="icon" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Book Selection */}
          <div>
            <Label className="mb-2 block">Book</Label>
            <Select
              value={selectedBook.id}
              onValueChange={(value) => {
                const book = bibleBooks.find((b) => b.id === value);
                if (book) {
                  setSelectedBook(book);
                  setSelectedChapter(1);
                  if (isMobile()) setIsSidebarOpen(false);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {bibleBooks.map((book, index) => (
                  <SelectItem key={index} value={book.id}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Selection */}
          <div>
            <Label className="mb-2 block">Chapter</Label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from(
                { length: Math.min(selectedBook.chapters, 20) },
                (_, i) => i + 1
              ).map((chapter) => (
                <Button
                  key={chapter}
                  variant={chapter === selectedChapter ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedChapter(chapter);
                    if (isMobile()) setIsSidebarOpen(false);
                  }}
                  className="h-9 w-full"
                >
                  {chapter}
                </Button>
              ))}
              {selectedBook.chapters > 20 && (
                <Select
                  value={
                    selectedChapter > 20 ? selectedChapter.toString() : "more"
                  }
                  onValueChange={(value) => {
                    if (value !== "more") {
                      setSelectedChapter(Number.parseInt(value));
                      if (isMobile()) setIsSidebarOpen(false);
                    }
                  }}
                >
                  <SelectTrigger className="w-full col-span-5 mt-2">
                    <SelectValue placeholder="More chapters..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: selectedBook.chapters - 20 },
                      (_, i) => i + 21
                    ).map((chapter) => (
                      <SelectItem key={chapter} value={chapter.toString()}>
                        Chapter {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note, index) => {
                  // Find verse info
                  const [bookId, chapterStr, verseStr] =
                    note.verseId.split("-");
                  const bookName =
                    bibleBooks.find((b) => b.id === bookId)?.name || bookId;

                  return (
                    <motion.div
                      key={index}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="font-medium text-sm cursor-pointer hover:text-primary"
                          onClick={() => {
                            const book = bibleBooks.find(
                              (b) => b.id === bookId
                            );
                            if (book) {
                              setSelectedBook(book);
                              setSelectedChapter(Number.parseInt(chapterStr));
                              setActiveTab("navigation");
                              if (isMobile()) setIsSidebarOpen(false);

                              setTimeout(() => {
                                const verseElement = document.getElementById(
                                  `verse-${note.verseId}`
                                );
                                if (verseElement) {
                                  verseElement.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  verseElement.classList.add("bg-primary/10");
                                  setTimeout(() => {
                                    verseElement.classList.remove(
                                      "bg-primary/10"
                                    );
                                  }, 2000);
                                }
                              }, 300);
                            }
                          }}
                        >
                          {bookName} {chapterStr}:{verseStr}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {note.text}
                      </p>
                      {note.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.labels.map((labelId: string) => {
                            const label = labels.find((l) => l.id === labelId);
                            if (!label) return null;
                            return (
                              <span
                                key={labelId}
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{
                                  backgroundColor: `${label.color}30`,
                                  color: label.color,
                                }}
                              >
                                {label.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No notes yet</p>
                  <p className="text-sm text-muted-foreground">
                    Highlight text and click "Add Note" to create notes
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="highlights">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {highlights.length > 0 ? (
                highlights.map((highlight, index) => {
                  const [bookId, chapterStr, verseStr] =
                    highlight.verseId.split("-");
                  const bookName =
                    bibleBooks.find((b) => b.id === bookId)?.name || bookId;

                  return (
                    <motion.div
                      key={index}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="font-medium text-sm cursor-pointer hover:text-primary"
                          onClick={() => {
                            const book = bibleBooks.find(
                              (b) => b.id === bookId
                            );
                            if (book) {
                              setSelectedBook(book);
                              setSelectedChapter(Number.parseInt(chapterStr));
                              setActiveTab("navigation");
                              if (isMobile()) setIsSidebarOpen(false);

                              // Scroll to verse after rendering
                              setTimeout(() => {
                                const verseElement = document.getElementById(
                                  `verse-${highlight.verseId}`
                                );
                                if (verseElement) {
                                  verseElement.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  verseElement.classList.add("bg-primary/10");
                                  setTimeout(() => {
                                    verseElement.classList.remove(
                                      "bg-primary/10"
                                    );
                                  }, 2000);
                                }
                              }, 300);
                            }
                          }}
                        >
                          {bookName} {chapterStr}:{verseStr}
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: highlight.color }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeHighlight(highlight.verseId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div
                        className="mt-2 p-2 rounded text-sm"
                        style={{ backgroundColor: `${highlight.color}20` }}
                      >
                        <span className="text-muted-foreground">
                          Highlighted verse
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Highlighter className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    No highlights yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Highlight text to mark important verses
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="labels">
          <LabelManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
