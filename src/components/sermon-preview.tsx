import Link from "next/link"
import Image from "next/image"
import { Calendar, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SermonPreviewProps {
  title: string
  preacher: string
  date: string
  imageUrl: string
}

export default function SermonPreview({ title, preacher, date, imageUrl }: SermonPreviewProps) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48 group">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="rounded-full bg-white/20 hover:bg-white/30">
            <Play className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-2">{preacher}</p>
        <div className="flex items-center text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{date}</span>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/sermons/${encodeURIComponent(title.toLowerCase().replace(/ /g, "-"))}`}>Watch Sermon</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

