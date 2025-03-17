"use client";

import { useState, useEffect } from "react";
import Data from "@/data";

export function useBibleData() {
  const [bibleBooks, setBibleBooks] = useState<any[]>([]);
  const [allVerses, setAllVerses] = useState<any[]>([]);
  const [verses, setVerses] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState("kjv");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadBibleData = async () => {
      try {
        setIsLoading(true);
        const bibleData = await Data.bibles[selectedVersion].get();

        if (!bibleData) {
          setLoadError(`Failed to load Bible data for ${selectedVersion}`);
          setIsLoading(false);
          return;
        }

        setBibleBooks(bibleData.bibleBooks);

        setAllVerses(bibleData.allVerses);

        if (bibleData.bibleBooks.length > 0) {
          const defaultBook =
            bibleData.bibleBooks.find((b: any) => b.id === "Gen") ||
            bibleData.bibleBooks[0];
          setSelectedBook(defaultBook);
        }

        setIsLoading(false);
      } catch (error) {
        console.error(
          `Error loading Bible data for ${selectedVersion}:`,
          error
        );
        setLoadError(`Failed to load Bible data for ${selectedVersion}`);
        setIsLoading(false);
      }
    };

    loadBibleData();
  }, [selectedVersion]);

  useEffect(() => {
    if (!selectedBook || isLoading) return;

    const loadVerses = async () => {
      const chapterVerses = allVerses.filter(
        (v) =>
          v.bookId === selectedBook.id &&
          Number.parseInt(`${v.chapter}`) ===
            Number.parseInt(`${selectedChapter}`)
      );

      setVerses(
        chapterVerses.map((v) => ({
          id: v.id,
          text: v.text,
          verse: v.verse,
        }))
      );
    };

    loadVerses();
  }, [selectedBook, selectedChapter, allVerses, isLoading]);

  return {
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
    loadVerses: () => {},
  };
}
