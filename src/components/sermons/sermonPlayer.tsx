"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Sermon } from "@/types";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface SermonPlayerProps {
  sermon: Sermon;
  mode: "video" | "audio";
}

// YouTube Player interface
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            rel?: 0 | 1;
            showinfo?: 0 | 1;
            mute?: 0 | 1;
            modestbranding?: 0 | 1;
            playsinline?: 0 | 1;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => void;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

function loadYouTubeIframeAPI(): Promise<void> {
  return new Promise((resolve) => {
    // If the API is already loaded, resolve immediately
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    // If the script is already being loaded, wait for it to complete
    if (document.getElementById("youtube-iframe-api")) {
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
      return;
    }

    // Load the script
    const tag = document.createElement("script");
    tag.id = "youtube-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}

export default function SermonPlayer({ sermon, mode }: SermonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [isYouTubeAPIReady, setIsYouTubeAPIReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if the video URL is from YouTube
  useEffect(() => {
    if (sermon.videoUrl && typeof window !== "undefined") {
      const isYouTube = /youtube\.com|youtu\.be/.test(sermon.videoUrl);
      setIsYouTubeVideo(isYouTube);
    } else {
      setIsYouTubeVideo(false);
    }
  }, [sermon.videoUrl]);

  // Load YouTube API
  useEffect(() => {
    if (sermon.videoUrl && isYouTubeVideo && typeof window !== "undefined") {
      let isMounted = true;

      const initYouTubePlayer = async () => {
        try {
          await loadYouTubeIframeAPI();

          if (!isMounted) return;

          setIsYouTubeAPIReady(true);
        } catch (error) {
          console.error("Failed to load YouTube API:", error);
        }
      };

      initYouTubePlayer();

      return () => {
        isMounted = false;
      };
    }
  }, [sermon.videoUrl, isYouTubeVideo]);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    // Handle different YouTube URL formats
    let videoId = null;

    // Standard YouTube URL format: https://www.youtube.com/watch?v=VIDEO_ID
    const standardMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    if (standardMatch && standardMatch[1]) {
      videoId = standardMatch[1];
    }

    // Short YouTube URL format: https://youtu.be/VIDEO_ID
    if (!videoId) {
      const shortMatch = url.match(/youtu\.be\/([^"&?/\s]{11})/);
      if (shortMatch && shortMatch[1]) {
        videoId = shortMatch[1];
      }
    }

    // Embedded YouTube URL format: https://www.youtube.com/embed/VIDEO_ID
    if (!videoId) {
      const embedMatch = url.match(/youtube\.com\/embed\/([^"&?/\s]{11})/);
      if (embedMatch && embedMatch[1]) {
        videoId = embedMatch[1];
      }
    }

    return videoId;
  };

  // Initialize YouTube player
  useEffect(() => {
    if (
      !isYouTubeVideo ||
      !isYouTubeAPIReady ||
      !youtubeContainerRef.current ||
      !sermon.videoUrl ||
      typeof window === "undefined"
    ) {
      return;
    }

    const videoId = getYouTubeVideoId(sermon.videoUrl);
    if (!videoId) return;

    // Clear any existing player
    if (youtubeContainerRef.current) {
      youtubeContainerRef.current.innerHTML =
        '<div id="youtube-player" style="width:100%;height:100%;"></div>';
    }

    try {
      const player = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setYoutubePlayer(event.target);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });

      return () => {
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current);
        }
      };
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  }, [isYouTubeVideo, isYouTubeAPIReady, sermon.videoUrl]);

  // Set up interval to update current time for YouTube videos
  useEffect(() => {
    if (youtubePlayer && isPlaying) {
      timeUpdateIntervalRef.current = setInterval(() => {
        setCurrentTime(youtubePlayer.getCurrentTime());
      }, 1000);
    } else if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [youtubePlayer, isPlaying]);

  useEffect(() => {
    // Reset player state when mode changes
    setIsPlaying(false);
    setCurrentTime(0);
  }, [mode]);

  const mediaRef = mode === "video" ? videoRef : audioRef;

  const handlePlay = () => {
    if (isYouTubeVideo && youtubePlayer) {
      if (isPlaying) {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    } else if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (!isYouTubeVideo && mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (isYouTubeVideo && youtubePlayer) {
      youtubePlayer.seekTo(value[0]);
      setCurrentTime(value[0]);
    } else if (mediaRef.current) {
      mediaRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (isYouTubeVideo && youtubePlayer) {
      youtubePlayer.setVolume(value[0] * 100);
      setIsMuted(value[0] === 0);
    } else if (mediaRef.current) {
      mediaRef.current.volume = value[0];
      setIsMuted(value[0] === 0);
    }
    setVolume(value[0]);
  };

  const toggleMute = () => {
    if (isYouTubeVideo && youtubePlayer) {
      if (isMuted) {
        youtubePlayer.unMute();
        youtubePlayer.setVolume(volume * 100);
      } else {
        youtubePlayer.mute();
      }
      setIsMuted(!isMuted);
    } else if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = (seconds: number) => {
    if (isYouTubeVideo && youtubePlayer) {
      const newTime = youtubePlayer.getCurrentTime() + seconds;
      youtubePlayer.seekTo(newTime);
      setCurrentTime(newTime);
    } else if (mediaRef.current) {
      mediaRef.current.currentTime += seconds;
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (isYouTubeVideo && youtubePlayer) {
      youtubePlayer.setPlaybackRate(rate);
    } else if (mediaRef.current) {
      mediaRef.current.playbackRate = rate;
    }
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleFullscreen = () => {
    if (isYouTubeVideo && youtubeContainerRef.current) {
      if (youtubeContainerRef.current.requestFullscreen) {
        youtubeContainerRef.current.requestFullscreen();
      }
    } else if (mode === "video" && videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleLike = () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed like" : "Added like",
      description: isLiked
        ? "You've removed your like from this sermon"
        : "You've liked this sermon",
    });
  };

  const handleDislike = () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);
    toast({
      title: isDisliked ? "Removed dislike" : "Added dislike",
      description: isDisliked
        ? "You've removed your dislike from this sermon"
        : "You've disliked this sermon",
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved",
      description: isSaved
        ? "Removed from your saved sermons"
        : "Added to your saved sermons",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Sermon link copied to clipboard",
    });
  };

  const handleWatchLater = () => {
    toast({
      title: "Added to Watch Later",
      description: "This sermon has been added to your Watch Later list",
    });
  };

  const handleAddToPlaylist = () => {
    toast({
      title: "Add to Playlist",
      description: "Choose a playlist to add this sermon to",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your sermon download will begin shortly",
    });
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border">
      <div>
        {mode === "video" ? (
          <div className="relative aspect-video bg-black">
            {isYouTubeVideo ? (
              <div
                ref={youtubeContainerRef}
                className="w-full h-full"
                style={{
                  position: "relative",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {isYouTubeAPIReady ? (
                  <div
                    id="youtube-player"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  ></div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-white">Loading YouTube player...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : sermon.videoUrl ? (
              <video
                ref={videoRef}
                src={sermon.videoUrl}
                poster={typeof sermon.image === "string" ? sermon.image : ""}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() =>
                  setIsMuted(videoRef.current?.muted || false)
                }
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
                  <p className="text-white text-center px-4">
                    Video not available
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={sermon.image || "/placeholder.svg?height=400&width=600"}
                alt={sermon.title}
                fill
                className="object-cover opacity-20"
              />
              <div className="z-10 text-center px-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  {isPlaying ? (
                    <Pause className="h-10 w-10 text-primary" />
                  ) : (
                    <Play className="h-10 w-10 text-primary ml-1" />
                  )}
                </div>
                <h3 className="text-xl font-bold">{sermon.title}</h3>
                <p className="text-muted-foreground">{sermon.speaker}</p>
              </div>
            </div>

            {sermon.videoUrl && !isYouTubeVideo && (
              <audio
                ref={audioRef}
                src={sermon.videoUrl}
                className="hidden"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() =>
                  setIsMuted(audioRef.current?.muted || false)
                }
              />
            )}
          </div>
        )}

        <div className="p-4 bg-card">
          <div className="flex items-center mb-2">
            <span className="text-sm text-muted-foreground mr-2 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1 mx-2"
            />
            <span className="text-sm text-muted-foreground ml-2 w-12">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSkip(-10)}
                disabled={!sermon.videoUrl}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlay}
                disabled={!sermon.videoUrl}
                className="text-foreground"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSkip(10)}
                disabled={!sermon.videoUrl}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="relative ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeControl(true)}
                  onMouseLeave={() => setShowVolumeControl(false)}
                  disabled={!sermon.videoUrl}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                {showVolumeControl && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    onMouseEnter={() => setShowVolumeControl(true)}
                    onMouseLeave={() => setShowVolumeControl(false)}
                  >
                    <div className="h-12 flex flex-col items-center">
                      <span className="text-xs mb-1">
                        {Math.round(volume * 100)}%
                      </span>
                      <Slider
                        value={[volume]}
                        max={1}
                        min={0}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        orientation="horizontal"
                        className="h-20"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!sermon.videoUrl}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={playbackRate === rate ? "bg-accent" : ""}
                    >
                      {rate === 1 ? "Normal" : `${rate}x`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {mode === "video" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullscreen}
                  disabled={!sermon.videoUrl}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
