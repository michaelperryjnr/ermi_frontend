"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Heart, Reply, MoreHorizontal } from "lucide-react";

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
    content:
      "This devotional really spoke to me today. I've been struggling with anxiety and the reminder that God's peace is available to me was exactly what I needed.",
    date: "2 hours ago",
    likes: 12,
  },
  {
    id: 2,
    author: "Michael Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MT",
    content:
      "I appreciate how this devotional connects scripture to our daily lives. The prayer points are especially helpful.",
    date: "Yesterday",
    likes: 8,
  },
  {
    id: 3,
    author: "Rebecca Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RL",
    content:
      "I've been reading these devotionals every morning for the past month, and they've really helped me start my day with the right perspective.",
    date: "3 days ago",
    likes: 15,
  },
];

export function DevotionalComments() {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);

  const handleSubmitComment = (e: any) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "YO",
      content: commentText,
      date: "Just now",
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Share your thoughts..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={!commentText.trim()}>
          Post Comment
        </Button>
      </form>

      <Separator />

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {comment.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm">{comment.content}</p>
                <div className="mt-2 flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                  >
                    <Heart className="mr-1 h-4 w-4" />
                    {comment.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground"
                  >
                    <Reply className="mr-1 h-4 w-4" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
