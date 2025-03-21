"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Sermon } from "@/types"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SermonMediaProps {
  sermon: Sermon
  isWatchMode: boolean
  isListenMode: boolean
}

export default function SermonMedia({ sermon, isWatchMode, isListenMode }: SermonMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const initialTab = isWatchMode ? "video" : isListenMode ? "audio" : "video"
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if ((isWatchMode || isListenMode) && (videoRef.current || audioRef.current)) {
      handlePlay()
    }
  }, [isWatchMode, isListenMode])

  const handlePlay = () => {
    if (activeTab === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    } else if (activeTab === "audio" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    const media = activeTab === "video" ? videoRef.current : audioRef.current
    if (media) {
      setCurrentTime(media.currentTime)
      setDuration(media.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    const media = activeTab === "video" ? videoRef.current : audioRef.current
    if (media) {
      media.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const media = activeTab === "video" ? videoRef.current : audioRef.current
    if (media) {
      media.volume = value[0]
      setVolume(value[0])
      setIsMuted(value[0] === 0)
    }
  }

  const toggleMute = () => {
    const media = activeTab === "video" ? videoRef.current : audioRef.current
    if (media) {
      media.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <motion.div
      className="rounded-lg overflow-hidden shadow-lg bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Tabs defaultValue={initialTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="m-0">
          <div className="relative aspect-video bg-black">
            {sermon.videoUrl ? (
              <video
                ref={videoRef}
                src={sermon.videoUrl}
                poster={typeof sermon.image === "string" ? sermon.image : ""}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() => setIsMuted(videoRef.current?.muted || false)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={sermon.image || "/placeholder.svg?height=400&width=600"}
                  alt={sermon.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-center px-4">Video not available</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-card">
            <div className="flex items-center mb-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1 mr-4"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handlePlay} disabled={!sermon.videoUrl}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeControl(true)}
                    disabled={!sermon.videoUrl}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>

                  {showVolumeControl && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-popover shadow-lg rounded-lg z-10 w-32"
                      onMouseEnter={() => setShowVolumeControl(true)}
                      onMouseLeave={() => setShowVolumeControl(false)}
                    >
                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        orientation="vertical"
                        className="h-24"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={handleFullscreen} disabled={!sermon.videoUrl}>
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audio" className="m-0">
          <div className="relative aspect-[3/1] bg-gradient-to-r from-primary/10 to-primary/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={sermon.image || "/placeholder.svg?height=400&width=600"}
                alt={sermon.title}
                fill
                className="object-cover opacity-20"
              />
              <div className="z-10 text-center px-4">
                <h3 className="text-xl font-bold mb-2">{sermon.title}</h3>
                <p className="text-muted-foreground">{sermon.speaker}</p>
              </div>
            </div>

            {sermon.videoUrl && (
              <audio
                ref={audioRef}
                src={sermon.videoUrl}
                className="hidden"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() => setIsMuted(audioRef.current?.muted || false)}
              />
            )}
          </div>

          <div className="p-4 bg-card">
            <div className="flex items-center mb-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1 mr-4"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handlePlay} disabled={!sermon.videoUrl}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeControl(true)}
                    disabled={!sermon.videoUrl}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>

                  {showVolumeControl && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-popover shadow-lg rounded-lg z-10 w-32"
                      onMouseEnter={() => setShowVolumeControl(true)}
                      onMouseLeave={() => setShowVolumeControl(false)}
                    >
                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        orientation="vertical"
                        className="h-24"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

