"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThumbsUp, MoreVertical, Flag, Reply, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  sermonId: string;
}

export default function CommentSection({ sermonId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "top">("top");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Mock user data - in a real app, this would come from authentication
  const currentUser = {
    name: "Current User",
    avatar: "",
    initials: "CU",
  };

  useEffect(() => {
    // Simulate fetching comments
    const fetchComments = async () => {
      // In a real app, this would be an API call
      const mockComments: Comment[] = [
        {
          id: "1",
          author: {
            name: "John Smith",
            initials: "JS",
          },
          content:
            "This sermon really spoke to me. I've been struggling with this exact issue in my life, and the scripture references were exactly what I needed to hear.",
          timestamp: "2 days ago",
          likes: 24,
          isLiked: false,
        },
        {
          id: "2",
          author: {
            name: "Sarah Johnson",
            initials: "SJ",
          },
          content:
            "I appreciate how the pastor broke down the scripture verse by verse. It made it much easier to understand the context and apply it to modern life.",
          timestamp: "1 week ago",
          likes: 18,
          isLiked: true,
          replies: [
            {
              id: "2-1",
              author: {
                name: "Michael Williams",
                initials: "MW",
              },
              content:
                "I agree! The historical context really helped me understand the passage better.",
              timestamp: "6 days ago",
              likes: 7,
              isLiked: false,
            },
          ],
        },
        {
          id: "3",
          author: {
            name: "David Thompson",
            initials: "DT",
          },
          content:
            "Does anyone know which translation of the Bible was used for this sermon? I'd like to study it more deeply.",
          timestamp: "3 days ago",
          likes: 5,
          isLiked: false,
        },
      ];

      setComments(mockComments);
    };

    fetchComments();
  }, [sermonId]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `new-${Date.now()}`,
        author: currentUser,
        content: newComment,
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setIsSubmitting(false);

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    }, 500);
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReply: Comment = {
        id: `reply-${Date.now()}`,
        author: currentUser,
        content: replyContent,
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
      };

      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyContent("");
      setReplyingTo(null);
      setIsSubmitting(false);

      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      });
    }, 500);
  };

  const handleLikeComment = (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    if (isReply && parentId) {
      // Handle liking a reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      });

      setComments(updatedComments);
    } else {
      // Handle liking a top-level comment
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      });

      setComments(updatedComments);
    }
  };

  const handleDeleteComment = (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    if (isReply && parentId) {
      // Handle deleting a reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== commentId),
          };
        }
        return comment;
      });

      setComments(updatedComments);

      toast({
        title: "Reply deleted",
        description: "Your reply has been deleted successfully.",
      });
    } else {
      // Handle deleting a top-level comment
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    }
  };

  const handleReportComment = (commentId: string) => {
    toast({
      title: "Comment reported",
      description:
        "Thank you for reporting this comment. Our team will review it.",
    });
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      // Simple sort by timestamp (in a real app, use actual dates)
      return a.timestamp > b.timestamp ? -1 : 1;
    } else {
      // Sort by likes
      return b.likes - a.likes;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant={sortBy === "top" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("top")}
          >
            Top
          </Button>
          <Button
            variant={sortBy === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("newest")}
          >
            Newest
          </Button>
        </div>
      </div>

      {/* Add comment form */}
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {sortedComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Be the first to comment on this sermon!
          </p>
        ) : (
          sortedComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={comment.author.avatar}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>{comment.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {comment.timestamp}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleReportComment(comment.id)}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                        {comment.author.name === currentUser.name && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${
                        comment.isLiked ? "text-primary" : ""
                      }`}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${
                          comment.isLiked ? "fill-primary" : ""
                        }`}
                      />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id
                        )
                      }
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="flex gap-4 ml-14">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={`Reply to ${comment.author.name}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim() || isSubmitting}
                      >
                        {isSubmitting ? "Posting..." : "Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reply.author.avatar}
                          alt={reply.author.name}
                        />
                        <AvatarFallback>{reply.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              {reply.author.name}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {reply.timestamp}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleReportComment(reply.id)}
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Report
                              </DropdownMenuItem>
                              {reply.author.name === currentUser.name && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteComment(
                                      reply.id,
                                      true,
                                      comment.id
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="mt-1">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1 ${
                              reply.isLiked ? "text-primary" : ""
                            }`}
                            onClick={() =>
                              handleLikeComment(reply.id, true, comment.id)
                            }
                          >
                            <ThumbsUp
                              className={`h-4 w-4 ${
                                reply.isLiked ? "fill-primary" : ""
                              }`}
                            />
                            <span>{reply.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
