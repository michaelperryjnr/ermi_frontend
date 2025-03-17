"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Menu,
  X,
  BookMarked,
  SearchIcon,
} from "lucide-react";
import { BibleNavigation } from "./bibleNavigation";
import { VerseComponent } from "./verseComponent";
import { SearchResults } from "./searchResults";
import { BibleVersionSelector } from "./bibleVersionSelector";
import { useNotes, useHighlights, useBibleData, useLabels } from "@/hooks";
import { NoteDialog } from "./noteDialog";
import { isMobile } from "@/lib";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BibleReader() {
  const {
    bibleBooks,
    allVerses,
    verses,
    selectedBook,
    selectedChapter,
    selectedVersion,
    isLoading,
    loadError,
    setSelectedBook,
    setSelectedChapter,
    setSelectedVersion,
  } = useBibleData();

  const { notes } = useNotes(selectedVersion);
  const { highlights } = useHighlights(selectedVersion);
  const { labels } = useLabels();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll position for "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 300);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simple search implementation
    const query = searchQuery.toLowerCase();
    const results = allVerses.filter(
      (verse) =>
        verse.text.toLowerCase().includes(query) ||
        `${verse.bookName} ${verse.chapter}:${verse.verse}`
          .toLowerCase()
          .includes(query)
    );

    setSearchResults(results);
  };

  const navigateToSearchResult = (result: any) => {
    const book = bibleBooks.find((b) => b.id === result.bookId);
    if (book) {
      setSelectedBook(book);
      setSelectedChapter(result.chapter);
      setIsSearching(false);
      setSearchQuery("");

      // Scroll to verse after rendering
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${result.id}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
          verseElement.classList.add("bg-primary/10");
          setTimeout(() => {
            verseElement.classList.remove("bg-primary/10");
          }, 2000);
        }
      }, 300);
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousChapter = () => {
    if (!selectedBook) return;

    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      // Go to previous book
      const currentBookIndex = bibleBooks.findIndex(
        (b) => b.id === selectedBook.id
      );
      if (currentBookIndex > 0) {
        const prevBook = bibleBooks[currentBookIndex - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(prevBook.chapters); // Last chapter of previous book
      }
    }
    scrollToTop();
  };

  const handleNextChapter = () => {
    if (!selectedBook) return;

    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      // Go to next book
      const currentBookIndex = bibleBooks.findIndex(
        (b) => b.id === selectedBook.id
      );
      if (currentBookIndex < bibleBooks.length - 1) {
        setSelectedBook(bibleBooks[currentBookIndex + 1]);
        setSelectedChapter(1); // First chapter of next book
      }
    }
    scrollToTop();
  };

  // Filter verses based on quick search
  const filteredVerses = quickSearch.trim()
    ? verses.filter(
        (v) =>
          v.text.toLowerCase().includes(quickSearch.toLowerCase()) ||
          v.verse.toString().includes(quickSearch)
      )
    : verses;

  // Loading state
  if (isLoading) {
    return (
      <div className="container px-4 py-6 mx-auto flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading Bible data...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError || !selectedBook) {
    return (
      <div className="container px-4 py-6 mx-auto flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Failed to load Bible</h2>
          <p className="text-muted-foreground mb-4">
            {loadError || "Unable to load Bible data"}
          </p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookMarked className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Bible</h1>
              <p className="text-muted-foreground">
                Read, study, and engage with God's Word
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BibleVersionSelector
              selectedVersion={selectedVersion}
              onVersionChange={setSelectedVersion}
            />
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {(isSidebarOpen || !isMobile()) && (
              <motion.div
                className={`w-full md:w-64 shrink-0 ${
                  isMobile() ? "fixed inset-0 z-50 bg-background p-4" : ""
                }`}
                initial={isMobile() ? { x: "-100%" } : { opacity: 0 }}
                animate={isMobile() ? { x: 0 } : { opacity: 1 }}
                exit={isMobile() ? { x: "-100%" } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobile() && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Bible Navigation</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                <BibleNavigation
                  bibleBooks={bibleBooks}
                  selectedBook={selectedBook}
                  selectedChapter={selectedChapter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  setSelectedBook={setSelectedBook}
                  setSelectedChapter={setSelectedChapter}
                  setIsSidebarOpen={setIsSidebarOpen}
                  notes={notes}
                  highlights={highlights}
                  labels={labels}
                  selectedVersion={selectedVersion}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results */}
            {isSearching && (
              <SearchResults
                searchResults={searchResults}
                searchQuery={searchQuery}
                navigateToSearchResult={navigateToSearchResult}
                setIsSearching={setIsSearching}
              />
            )}

            {/* Bible Content */}
            <Card className="relative overflow-hidden border-none shadow-lg">
              <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                <h2 className="text-xl font-bold">
                  {selectedBook.name} {selectedChapter}
                </h2>
                <div className="relative">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filter verses..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="pl-9 h-9 w-[200px]"
                  />
                </div>
              </div>

              <ScrollArea className="h-[65vh]" ref={contentRef}>
                <div className="p-6">
                  <div className="space-y-1">
                    {filteredVerses.length > 0 ? (
                      filteredVerses.map((verse, index) => (
                        <VerseComponent
                          key={index}
                          verse={verse}
                          highlights={highlights}
                          notes={notes}
                          labels={labels}
                          setSelectedVerse={setSelectedVerse}
                          setIsAddingNote={setIsAddingNote}
                          selectedBook={selectedBook}
                          selectedChapter={selectedChapter}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          {quickSearch
                            ? "No verses match your filter"
                            : "No verses available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center p-4 bg-muted/30 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousChapter}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm font-medium">
                  {selectedBook.name} {selectedChapter}
                </span>

                <Button
                  variant="outline"
                  onClick={handleNextChapter}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Scroll to Top Button */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.div
                  className="fixed bottom-6 right-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg"
                    onClick={scrollToTop}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Add Note Dialog */}
        {isAddingNote && (
          <NoteDialog
            isOpen={isAddingNote}
            setIsOpen={setIsAddingNote}
            selectedVerse={selectedVerse}
            labelsData={labels}
            bibleVersion={selectedVersion}
          />
        )}
      </motion.div>
    </div>
  );
}
