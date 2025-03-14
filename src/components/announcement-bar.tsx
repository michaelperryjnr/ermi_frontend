"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock announcements - in production, these would come from your CMS
const announcements = [
  {
    id: 1,
    message: "Join us this Sunday for our special Thanksgiving Service at 10:00 AM",
    link: "/events/thanksgiving-service",
  },
  {
    id: 2,
    message: "Youth Conference 2025 registration is now open!",
    link: "/events/youth-conference",
  },
]

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <button onClick={handlePrevious} className="text-primary-foreground/80 hover:text-primary-foreground">
              ‹
            </button>

            <motion.div
              key={announcements[currentIndex].id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex-1 text-center px-4"
            >
              <a href={announcements[currentIndex].link} className="text-sm hover:underline">
                {announcements[currentIndex].message}
              </a>
            </motion.div>

            <div className="flex items-center gap-2">
              <button onClick={handleNext} className="text-primary-foreground/80 hover:text-primary-foreground">
                ›
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

