"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, BookOpen, Trash2, Check, ChevronLeft, ChevronRight, Menu, X, ArrowUp } from "lucide-react"

// Types
interface Verse {
  id: string
  text: string
  verse: number
}

interface Note {
  id: string
  verseId: string
  text: string
  labels: string[]
  createdAt: string
}

interface Highlight {
  id: string
  verseId: string
  color: string
  createdAt: string
}

interface BibleLabel {
  id: string
  name: string
  color: string
}

interface SearchResult {
  bookId: string
  bookName: string
  chapter: number
  verse: number
  text: string
  id: string
}

// Mock Bible data
const bibleBooks = [
  { id: "GEN", name: "Genesis", chapters: 50 },
  { id: "EXO", name: "Exodus", chapters: 40 },
  { id: "LEV", name: "Leviticus", chapters: 27 },
  { id: "NUM", name: "Numbers", chapters: 36 },
  { id: "DEU", name: "Deuteronomy", chapters: 34 },
  { id: "MAT", name: "Matthew", chapters: 28 },
  { id: "MRK", name: "Mark", chapters: 16 },
  { id: "LUK", name: "Luke", chapters: 24 },
  { id: "JHN", name: "John", chapters: 21 },
  { id: "ACT", name: "Acts", chapters: 28 },
  { id: "ROM", name: "Romans", chapters: 16 },
  { id: "PSA", name: "Psalms", chapters: 150 },
  { id: "PRO", name: "Proverbs", chapters: 31 },
]

// Sample verse content
const sampleVerses = {
  "GEN-1": [
    { id: "GEN-1-1", verse: 1, text: "In the beginning God created the heavens and the earth." },
    {
      id: "GEN-1-2",
      verse: 2,
      text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
    },
    { id: "GEN-1-3", verse: 3, text: 'And God said, "Let there be light," and there was light.' },
  ],
  "JHN-1": [
    {
      id: "JHN-1-1",
      verse: 1,
      text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    },
    { id: "JHN-1-2", verse: 2, text: "He was with God in the beginning." },
    {
      id: "JHN-1-3",
      verse: 3,
      text: "Through him all things were made; without him nothing was made that has been made.",
    },
    { id: "JHN-1-4", verse: 4, text: "In him was life, and that life was the light of all mankind." },
    { id: "JHN-1-5", verse: 5, text: "The light shines in the darkness, and the darkness has not overcome it." },
  ],
  "JHN-3": [
    {
      id: "JHN-3-16",
      verse: 16,
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    },
    {
      id: "JHN-3-17",
      verse: 17,
      text: "For God did not send his Son into the world to condemn the world, but to save the world through him.",
    },
  ],
  "PSA-23": [
    { id: "PSA-23-1", verse: 1, text: "The LORD is my shepherd, I lack nothing." },
    { id: "PSA-23-2", verse: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
    { id: "PSA-23-3", verse: 3, text: "he refreshes my soul. He guides me along the right paths for his name's sake." },
  ],
  "ROM-8": [
    {
      id: "ROM-8-28",
      verse: 28,
      text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    },
    {
      id: "ROM-8-29",
      verse: 29,
      text: "For those God foreknew he also predestined to be conformed to the image of his Son, that he might be the firstborn among many brothers and sisters.",
    },
  ],
  "MAT-11": [
    { id: "MAT-11-28", verse: 28, text: "Come to me, all you who are weary and burdened, and I will give you rest." },
    {
      id: "MAT-11-29",
      verse: 29,
      text: "Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.",
    },
  ],
}

// Default highlight colors
const highlightColors = [
  "#FFD700", // Gold
  "#90EE90", // Light Green
  "#FFB6C1", // Light Pink
  "#87CEEB", // Sky Blue
  "#DDA0DD", // Plum
  "#F0E68C", // Khaki
]

// All verses for search functionality
const allVerses: SearchResult[] = Object.entries(sampleVerses).flatMap(([key, verses]) => {
  const [bookId, chapter] = key.split("-")
  const bookName = bibleBooks.find((b) => b.id === bookId)?.name || ""

  return verses.map((verse) => ({
    bookId,
    bookName,
    chapter: Number.parseInt(chapter),
    verse: verse.verse,
    text: verse.text,
    id: verse.id,
  }))
})

export default function BiblePage() {
  const [selectedBook, setSelectedBook] = useState(bibleBooks.find((b) => b.id === "JHN") || bibleBooks[0])
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [labels, setLabels] = useState<BibleLabel[]>([])
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(highlightColors[0])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState(highlightColors[0])
  const [isEditingLabels, setIsEditingLabels] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load saved data from localStorage
    const loadSavedData = () => {
      try {
        const savedNotes = localStorage.getItem("bible-notes")
        const savedHighlights = localStorage.getItem("bible-highlights")
        const savedLabels = localStorage.getItem("bible-labels")

        if (savedNotes) setNotes(JSON.parse(savedNotes))
        if (savedHighlights) setHighlights(JSON.parse(savedHighlights))
        if (savedLabels) setLabels(JSON.parse(savedLabels))
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }

    loadSavedData()
  }, [])

  useEffect(() => {
    // Simulate loading verses
    const loadVerses = () => {
      const key = `${selectedBook.id}-${selectedChapter}`
      setVerses(sampleVerses[key as keyof typeof sampleVerses] || [])
    }

    loadVerses()
  }, [selectedBook, selectedChapter])

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 300)
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll)
      return () => contentElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleHighlight = (verseId: string) => {
    // Check if verse is already highlighted
    const existingHighlight = highlights.find((h) => h.verseId === verseId)

    if (existingHighlight) {
      // Remove highlight if same color is selected
      if (existingHighlight.color === selectedColor) {
        const updatedHighlights = highlights.filter((h) => h.verseId !== verseId)
        setHighlights(updatedHighlights)
        localStorage.setItem("bible-highlights", JSON.stringify(updatedHighlights))
        return
      }

      // Update highlight color
      const updatedHighlights = highlights.map((h) => (h.verseId === verseId ? { ...h, color: selectedColor } : h))
      setHighlights(updatedHighlights)
      localStorage.setItem("bible-highlights", JSON.stringify(updatedHighlights))
      return
    }

    // Add new highlight
    const newHighlight = {
      id: `highlight-${Date.now()}`,
      verseId,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    }

    const updatedHighlights = [...highlights, newHighlight]
    setHighlights(updatedHighlights)
    localStorage.setItem("bible-highlights", JSON.stringify(updatedHighlights))
  }

  const handleAddNote = () => {
    if (!selectedVerse || !noteText.trim()) return

    const newNote = {
      id: `note-${Date.now()}`,
      verseId: selectedVerse,
      text: noteText,
      labels: selectedLabels,
      createdAt: new Date().toISOString(),
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem("bible-notes", JSON.stringify(updatedNotes))

    setNoteText("")
    setSelectedLabels([])
    setIsAddingNote(false)
  }

  const handleAddLabel = () => {
    if (!newLabelName.trim()) return

    const newLabel = {
      id: `label-${Date.now()}`,
      name: newLabelName,
      color: newLabelColor,
    }

    const updatedLabels = [...labels, newLabel]
    setLabels(updatedLabels)
    localStorage.setItem("bible-labels", JSON.stringify(updatedLabels))

    setNewLabelName("")
    setNewLabelColor(highlightColors[0])
  }

  const handleDeleteLabel = (labelId: string) => {
    const updatedLabels = labels.filter((label) => label.id !== labelId)
    setLabels(updatedLabels)
    localStorage.setItem("bible-labels", JSON.stringify(updatedLabels))

    // Remove label from notes
    const updatedNotes = notes.map((note) => ({
      ...note,
      labels: note.labels.filter((id) => id !== labelId),
    }))
    setNotes(updatedNotes)
    localStorage.setItem("bible-notes", JSON.stringify(updatedNotes))
  }

  const handleShare = (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId)
    if (!verse) return

    if (navigator.share) {
      navigator.share({
        title: `${selectedBook.name} ${selectedChapter}:${verse.verse}`,
        text: verse.text,
        url: window.location.href,
      })
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(`${selectedBook.name} ${selectedChapter}:${verse.verse} - ${verse.text}`)
      alert("Verse copied to clipboard!")
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simple search implementation
    const query = searchQuery.toLowerCase()
    const results = allVerses.filter(
      (verse) =>
        verse.text.toLowerCase().includes(query) ||
        `${verse.bookName} ${verse.chapter}:${verse.verse}`.toLowerCase().includes(query),
    )

    setSearchResults(results)
  }

  const navigateToSearchResult = (result: SearchResult) => {
    const book = bibleBooks.find((b) => b.id === result.bookId)
    if (book) {
      setSelectedBook(book)
      setSelectedChapter(result.chapter)
      setIsSearching(false)
      setSearchQuery("")

      // Scroll to verse after rendering
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${result.id}`)
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: "smooth", block: "center" })
          verseElement.classList.add("bg-primary/10")
          setTimeout(() => {
            verseElement.classList.remove("bg-primary/10")
          }, 2000)
        }
      }, 300)
    }
  }

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1)
    } else {
      // Go to previous book
      const currentBookIndex = bibleBooks.findIndex((b) => b.id === selectedBook.id)
      if (currentBookIndex > 0) {
        const prevBook = bibleBooks[currentBookIndex - 1]
        setSelectedBook(prevBook)
        setSelectedChapter(prevBook.chapters) // Last chapter of previous book
      }
    }
    scrollToTop()
  }

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(selectedChapter + 1)
    } else {
      // Go to next book
      const currentBookIndex = bibleBooks.findIndex((b) => b.id === selectedBook.id)
      if (currentBookIndex < bibleBooks.length - 1) {
        setSelectedBook(bibleBooks[currentBookIndex + 1])
        setSelectedChapter(1) // First chapter of next book
      }
    }
    scrollToTop()
  }

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
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
          <div>
            <h1 className="text-3xl font-bold">Bible</h1>
            <p className="text-muted-foreground">Read, study, and engage with God's Word</p>
          </div>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {(isSidebarOpen || !isMobile()) && (
              <motion.div
                className={`w-full md:w-64 shrink-0 ${isMobile() ? "fixed inset-0 z-50 bg-background p-4" : ""}`}
                initial={isMobile() ? { x: "-100%" } : { opacity: 0 }}
                animate={isMobile() ? { x: 0 } : { opacity: 1 }}
                exit={isMobile() ? { x: "-100%" } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobile() && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Bible Navigation</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Search */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Search the Bible..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full"
                    />
                    <Button onClick={handleSearch} size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Book Selection */}
                <div className="mb-6">
                  <Label className="mb-2 block">Book</Label>
                  <Select
                    value={selectedBook.id}
                    onValueChange={(value) => {
                      const book = bibleBooks.find((b) => b.id === value)
                      if (book) {
                        setSelectedBook(book)
                        setSelectedChapter(1)
                        if (isMobile()) setIsSidebarOpen(false)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {bibleBooks.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chapter Selection */}
                <div className="mb-6">
                  <Label className="mb-2 block">Chapter</Label>
                  <Select
                    value={selectedChapter.toString()}
                    onValueChange={(value) => {
                      setSelectedChapter(Number.parseInt(value))
                      if (isMobile()) setIsSidebarOpen(false)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                        <SelectItem key={chapter} value={chapter.toString()}>
                          Chapter {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabs for mobile */}
                {isMobile() && (
                  <Tabs defaultValue="notes" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="highlights">Highlights</TabsTrigger>
                      <TabsTrigger value="labels">Labels</TabsTrigger>
                    </TabsList>

                    <TabsContent value="notes">
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                        {notes.length > 0 ? (
                          notes.map((note) => {
                            // Find verse info
                            const [bookId, chapterStr, verseStr] = note.verseId.split("-")
                            const bookName = bibleBooks.find((b) => b.id === bookId)?.name || bookId

                            return (
                              <div key={note.id} className="border-b pb-2 last:border-0">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm">
                                    {bookName} {chapterStr}:{verseStr}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const updatedNotes = notes.filter((n) => n.id !== note.id)
                                      setNotes(updatedNotes)
                                      localStorage.setItem("bible-notes", JSON.stringify(updatedNotes))
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">{note.text}</p>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-center text-muted-foreground text-sm">No notes yet</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="highlights">
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                        {highlights.length > 0 ? (
                          highlights.map((highlight) => {
                            // Find verse info
                            const [bookId, chapterStr, verseStr] = highlight.verseId.split("-")
                            const bookName = bibleBooks.find((b) => b.id === bookId)?.name || bookId

                            return (
                              <div key={highlight.id} className="border-b pb-2 last:border-0">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm">
                                    {bookName} {chapterStr}:{verseStr}
                                  </p>
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: highlight.color }} />
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-center text-muted-foreground text-sm">No highlights yet</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="labels">
                      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                        {labels.length > 0 ? (
                          labels.map((label) => (
                            <div key={label.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: label.color }} />
                              <span className="text-sm">{label.name}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground text-sm">No labels yet</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results */}
            {isSearching && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">
                      Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ""}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsSearching(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => navigateToSearchResult(result)}
                        >
                          <p className="font-medium text-sm">
                            {result.bookName} {result.chapter}:{result.verse}
                          </p>
                          <p
                            className="text-sm text-muted-foreground"
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchTerms(result.text, searchQuery),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No results found for "{searchQuery}"</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bible Content */}
            <Card className="relative">
              <CardContent className="p-6 max-h-[70vh] overflow-y-auto" ref={contentRef}>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedBook.name} {selectedChapter}
                  </h2>
                </div>

                <div className="space-y-4">
                  {verses.map((verse) => {
                    const verseHighlights = highlights.filter((h) => h.verseId === verse.id)
                    const verseNotes = notes.filter((n) => n.verseId === verse.id)
                    const highlightColor = verseHighlights.length > 0 ? verseHighlights[0].color : null

                    return (
                      <div
                        key={verse.id}
                        id={`verse-${verse.id}`}
                        className="group relative flex transition-colors duration-300 rounded-md p-2 -mx-2 hover:bg-muted/50"
                      >
                        <span className="text-sm font-bold text-muted-foreground mr-4 mt-1 w-6 shrink-0 text-right">
                          {verse.verse}
                        </span>
                        <div className="flex-1">
                          <p className="leading-relaxed">
                            <span
                              className={`relative ${highlightColor ? "px-1 py-0.5 rounded" : ""}`}
                              style={highlightColor ? { backgroundColor: `${highlightColor}30` } : {}}
                            >
                              {verse.text}
                            </span>
                          </p>

                          {/* Verse Actions */}
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 rounded-full">
                                  Highlight
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Choose Color</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {highlightColors.map((color) => (
                                      <button
                                        key={color}
                                        className={`w-8 h-8 rounded-full ${
                                          selectedColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                          setSelectedColor(color)
                                          handleHighlight(verse.id)
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-full"
                              onClick={() => {
                                setSelectedVerse(verse.id)
                                setIsAddingNote(true)
                              }}
                            >
                              Add Note
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-full"
                              onClick={() => handleShare(verse.id)}
                            >
                              Share
                            </Button>
                          </div>

                          {/* Notes Display */}
                          {verseNotes.length > 0 && (
                            <div className="mt-2 pl-4 border-l-2 border-primary/20 bg-muted/30 p-2 rounded">
                              {verseNotes.map((note) => (
                                <div key={note.id} className="text-sm mb-2 last:mb-0">
                                  <p>{note.text}</p>
                                  {note.labels.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {note.labels.map((labelId) => {
                                        const label = labels.find((l) => l.id === labelId)
                                        if (!label) return null
                                        return (
                                          <span
                                            key={label.id}
                                            className="px-2 py-0.5 rounded-full text-xs"
                                            style={{
                                              backgroundColor: `${label.color}30`,
                                              color: label.color,
                                            }}
                                          >
                                            {label.name}
                                          </span>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {verses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No verses available</h3>
                    <p className="text-muted-foreground">Try selecting a different book or chapter</p>
                  </div>
                )}
              </CardContent>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center p-4 border-t">
                <Button variant="outline" onClick={handlePreviousChapter} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  {selectedBook.name} {selectedChapter}
                </span>

                <Button variant="outline" onClick={handleNextChapter} className="flex items-center gap-1">
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
                  <Button variant="secondary" size="icon" className="rounded-full shadow-lg" onClick={scrollToTop}>
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Add Note Dialog */}
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Note Text</Label>
                <Textarea
                  placeholder="Enter your note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Labels</Label>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        selectedLabels.includes(label.id) ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                      onClick={() => {
                        setSelectedLabels((prev) =>
                          prev.includes(label.id) ? prev.filter((id) => id !== label.id) : [...prev, label.id],
                        )
                      }}
                    >
                      {label.name}
                      {selectedLabels.includes(label.id) && <Check className="h-3 w-3" />}
                    </button>
                  ))}

                  {labels.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No labels created yet. Create labels in the Labels tab.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote}>Save Note</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}

// Helper function to check if we're on mobile
function isMobile() {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}

