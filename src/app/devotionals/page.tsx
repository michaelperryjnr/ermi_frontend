"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronLeft, ChevronRight, Share2, BookOpen } from "lucide-react"
import Link from "next/link"

// Mock data - would come from your API/database in production
const devotionals = [
  {
    id: 1,
    title: "Finding Peace in Troubled Times",
    date: "2025-03-13",
    verse: "John 14:27",
    verseText:
      "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    content:
      "In a world filled with uncertainty and chaos, Jesus offers us a peace that transcends all understanding. This is not a temporary peace that depends on our circumstances, but a lasting peace that comes from knowing that God is in control. When we trust in Him, we can find calm in the midst of any storm.",
    author: "Pastor Johnson",
  },
  {
    id: 2,
    title: "The Power of Gratitude",
    date: "2025-03-12",
    verse: "1 Thessalonians 5:16-18",
    verseText:
      "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    content:
      "Gratitude has the power to transform our perspective. When we choose to be thankful, even in difficult situations, we acknowledge God's sovereignty and goodness. This practice of thanksgiving helps us to focus on what we have rather than what we lack, bringing joy and contentment to our hearts.",
    author: "Elder Smith",
  },
  {
    id: 3,
    title: "Walking in Faith",
    date: "2025-03-11",
    verse: "Hebrews 11:1",
    verseText: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    content:
      "Faith is the foundation of our Christian walk. It is believing in God's promises even when we cannot see the outcome. When we step out in faith, we demonstrate our trust in God's character and His word. This kind of faith pleases God and opens the door for Him to work miracles in our lives.",
    author: "Deacon Williams",
  },
  {
    id: 4,
    title: "The Importance of Community",
    date: "2025-03-10",
    verse: "Hebrews 10:24-25",
    verseText:
      "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another—and all the more as you see the Day approaching.",
    content:
      "God created us for community. We are not meant to walk this Christian journey alone. When we gather together, we can encourage one another, share our burdens, and grow in our faith. In a world that promotes individualism, let us remember the value of genuine Christian fellowship.",
    author: "Sister Mary",
  },
  {
    id: 5,
    title: "Overcoming Temptation",
    date: "2025-03-09",
    verse: "1 Corinthians 10:13",
    verseText:
      "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.",
    content:
      "Temptation is a reality that every Christian faces. However, God promises that He will never allow us to be tempted beyond what we can bear. He always provides a way of escape. When we rely on His strength and stay grounded in His word, we can overcome any temptation that comes our way.",
    author: "Pastor Johnson",
  },
]

export default function DevotionalsPage() {
  const [currentDevotionalIndex, setCurrentDevotionalIndex] = useState(0)
  const currentDevotional = devotionals[currentDevotionalIndex]

  const handlePrevious = () => {
    setCurrentDevotionalIndex((prev) => (prev === 0 ? devotionals.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentDevotionalIndex((prev) => (prev === devotionals.length - 1 ? 0 : prev + 1))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Daily Devotionals</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start your day with spiritual guidance and inspiration from God's Word
          </p>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="today">Today's Devotional</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-8">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(currentDevotional.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl mt-2">{currentDevotional.title}</CardTitle>
                <CardDescription>By {currentDevotional.author}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md flex items-start">
                  <BookOpen className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">{currentDevotional.verse}</p>
                    <p className="italic text-muted-foreground">{currentDevotional.verseText}</p>
                  </div>
                </div>
                <div className="prose max-w-none dark:prose-invert">
                  <p>{currentDevotional.content}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button>Read More Devotionals</Button>
              </CardFooter>
            </Card>

            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Prayer for Today</h2>
              <p className="text-muted-foreground italic">
                "Heavenly Father, thank you for your word that guides and comforts us. Help us to apply the lessons from
                today's devotional in our lives. May we walk in your peace, trust in your promises, and share your love
                with others. In Jesus' name, Amen."
              </p>
            </div>
          </TabsContent>

          <TabsContent value="archive">
            <motion.div className="grid gap-6 md:grid-cols-2" variants={container} initial="hidden" animate="show">
              {devotionals.map((devotional) => (
                <motion.div key={devotional.id} variants={item}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="text-sm text-muted-foreground mb-2">{formatDate(devotional.date)}</div>
                      <CardTitle>{devotional.title}</CardTitle>
                      <CardDescription>By {devotional.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{devotional.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/devotionals/${devotional.id}`}>Read Full Devotional</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

