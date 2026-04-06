"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Comment, CommentsResponse } from "@/types/types";
import { postService } from "@/services/post.service";
import { useAuth } from "@/context/auth-context";
import CommentItem from "./CommentItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface CommentSectionProps {
  postId: string;
  commentsCount: number;
  onCommentsCountChange?: (delta: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  commentsCount,
  onCommentsCountChange,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchComments = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentPage = isInitial ? 1 : page;
      const response = await postService.getComments(postId, {
        page: currentPage,
        limit: 10,
      });

      if (isInitial) {
        setComments(response.data.comments);
        setPage(2);
      } else {
        setComments((prev) => [...prev, ...response.data.comments]);
        setPage((prev) => prev + 1);
      }
      setHasMore(response.data.pagination.hasNextPage);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments(true);
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await postService.addComment(postId, newComment);
      setComments([response.data, ...comments]);
      setNewComment("");
      onCommentsCountChange?.(1);
    } catch (err: any) {
      setError(err.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-50 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-[#f2f3f5] rounded-full p-1 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all duration-200"
      >
        <div className="relative h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 overflow-hidden shrink-0">
          {user?.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[12px] font-bold text-gray-600 uppercase">
              {user?.firstName?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment"
          className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-500 pl-1 py-1 text-gray-800"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="mr-2 text-gray-400 hover:text-[#0081ff] disabled:opacity-30 transition-colors"
        >
          <Send size={18} strokeWidth={2.5} />
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-500 font-medium px-1">{error}</p>
      )}

      <div className="space-y-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              onCommentsCountChange={onCommentsCountChange}
            />
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400 font-medium">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}

        {hasMore && (
          <button
            onClick={() => fetchComments(false)}
            disabled={loadingMore}
            className="text-[13px] font-bold text-gray-700 hover:underline transition-all duration-200 flex items-center gap-1.5 py-1 px-1"
          >
            {loadingMore ? "Loading..." : "View previous comments"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentSection;


