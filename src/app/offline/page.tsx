import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <WifiOff className="h-16 w-16 mb-6 text-muted-foreground" />
      <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        It looks like you're currently offline. Please check your internet connection and try again.
      </p>
      <Button asChild>
        <Link href="/">Try Again</Link>
      </Button>
    </div>
  )
}

