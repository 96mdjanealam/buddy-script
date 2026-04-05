"use client";

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Reply,
  Trash2,
  Send,
  Heart,
} from "lucide-react";
import { Comment, RepliesResponse } from "@/types/api";
import { postService } from "@/services/post.service";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string, deletedCount?: number) => void;
  onCommentsCountChange?: (delta: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  onCommentsCountChange,
}) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [latestLikers, setLatestLikers] = useState(comment.latestLikers || []);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (comment.isLiked !== undefined) setIsLiked(comment.isLiked);
    if (comment.likesCount !== undefined) setLikesCount(comment.likesCount);
    if (comment.latestLikers !== undefined)
      setLatestLikers(comment.latestLikers);
  }, [comment.isLiked, comment.likesCount, comment.latestLikers]);

  const [replyPage, setReplyPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(false);
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);

  const fetchReplies = async (isInitial = true) => {
    if (isInitial) {
      setLoadingReplies(true);
    } else {
      setLoadingMoreReplies(true);
    }

    try {
      const currentPage = isInitial ? 1 : replyPage;
      const response = await postService.getReplies(comment._id, {
        page: currentPage,
        limit: 10,
      });

      if (isInitial) {
        setReplies(response.data.replies);
        setReplyPage(2);
      } else {
        setReplies((prev) => [...prev, ...response.data.replies]);
        setReplyPage((prev) => prev + 1);
      }
      setHasMoreReplies(response.data.pagination.hasNextPage);
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    } finally {
      setLoadingReplies(false);
      setLoadingMoreReplies(false);
    }
  };

  const [localReplyCount, setLocalReplyCount] = useState(
    comment.replyCount || 0,
  );

  const handleToggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const response = await postService.addComment(
        comment.post,
        replyText,
        comment._id,
      );

      if (response.success) {
        setReplies((prev) => [response.data, ...prev]);
        setLocalReplyCount((prev) => prev + 1);
        onCommentsCountChange?.(1);
        setShowReplies(true);
        setReplyText("");
        setIsReplying(false);
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCommentLike = async (
    commentId: string,
    customIsLiked: boolean,
    customSetIsLiked: (v: boolean) => void,
    customSetLikesCount: (v: React.SetStateAction<number>) => void,
    customSetLatestLikers: (v: any[]) => void,
  ) => {
    if (isLiking) return;
    setIsLiking(true);

    const newIsLiked = !customIsLiked;
    customSetIsLiked(newIsLiked);
    customSetLikesCount((prev) =>
      typeof prev === "number" ? (newIsLiked ? prev + 1 : prev - 1) : prev,
    );

    try {
      const response = await postService.toggleCommentLike(commentId);
      if (response.success) {
        customSetIsLiked(response.data.liked);
        customSetLikesCount(response.data.likesCount);
        customSetLatestLikers(response.data.latestLikers || []);
      }
    } catch (error) {
      customSetIsLiked(!newIsLiked);
      customSetLikesCount((prev) =>
        typeof prev === "number" ? (!newIsLiked ? prev + 1 : prev - 1) : prev,
      );
      console.error("Failed to toggle comment like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeleteThisComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    setIsDeleting(true);
    try {
      const response = await postService.deleteComment(comment._id);
      if (response.success) {
        const deletedCount = response.data?.deletedCount || 1;
        onDelete?.(comment._id, deletedCount);
        onCommentsCountChange?.(-deletedCount);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const userInitial = comment?.author?.firstName?.charAt(0) || "U";

  return (
    <div className="group space-y-3">
      <div className="flex gap-3">
        <div className="relative h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 mt-0.5">
          {comment?.author?.profileImage?.url ? (
            <Image
              src={comment.author.profileImage.url}
              alt={`${comment.author.firstName} ${comment.author.lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-[12px] font-bold text-gray-600 uppercase">
              {userInitial}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="relative w-full">
            <div className="bg-[#f2f3f5] rounded-[20px] px-3.5 py-2 group-hover:bg-[#ebedf0] transition-colors duration-200 w-full">
              <div className="flex items-center justify-between gap-4 mb-0.5">
                <span className="text-[13px] font-bold text-gray-900 hover:underline cursor-pointer">
                  {comment?.author?.firstName} {comment?.author?.lastName}
                </span>
              </div>
              <p className="text-[14px] text-gray-800 leading-snug w-full whitespace-pre-wrap wrap-anywhere">
                {comment?.text}
              </p>
            </div>

            {likesCount > 0 && (
              <button
                onClick={() =>
                  handleCommentLike(
                    comment._id,
                    isLiked,
                    setIsLiked,
                    setLikesCount,
                    setLatestLikers,
                  )
                }
                className="absolute -bottom-2 -right-1 flex items-center gap-1 bg-white shadow-md border border-gray-100 rounded-full py-0.5 px-1 hover:scale-105 transition-transform duration-200 z-10"
              >
                <div className="flex items-center">
                  <div className="flex items-center -space-x-1.5 mr-1">
                    {latestLikers
                      .slice(0, 2)
                      .reverse()
                      .map((liker, idx) => (
                        <div
                          key={liker._id}
                          className="relative h-4 w-4 rounded-full border border-white overflow-hidden bg-gray-100"
                          style={{ zIndex: idx + 1 }}
                        >
                          {liker.profileImage?.url ? (
                            <Image
                              src={liker.profileImage.url}
                              alt={liker.firstName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-[6px] font-bold text-gray-500 uppercase">
                              {liker.firstName?.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  <div className="bg-red-500 rounded-full p-0.5 flex items-center justify-center">
                    <Heart size={8} className="text-white fill-current" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-600 pr-0.5">
                  {likesCount}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 pl-3 pt-0.5">
            <button
              onClick={() =>
                handleCommentLike(
                  comment._id,
                  isLiked,
                  setIsLiked,
                  setLikesCount,
                  setLatestLikers,
                )
              }
              disabled={isLiking}
              className={`text-[12px] font-semibold transition-all duration-200 hover:underline ${
                isLiked ? "text-red-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Like
            </button>
            <span className="text-gray-400 text-[10px]">·</span>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-[12px] font-semibold text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200"
            >
              Reply
            </button>

            {user?._id === comment?.author?._id && (
              <>
                <span className="text-gray-400 text-[10px]">·</span>
                <button
                  onClick={handleDeleteThisComment}
                  disabled={isDeleting}
                  className="text-[12px] font-semibold text-gray-500 hover:text-red-500 hover:underline transition-all duration-200 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}

            {localReplyCount > 0 && !showReplies ? (
              <>
                <span className="text-gray-400 text-[10px]">·</span>
                <button
                  onClick={handleToggleReplies}
                  className="text-[12px] font-semibold text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200 flex items-center gap-1"
                >
                  {localReplyCount}{" "}
                  {localReplyCount === 1 ? "Reply" : "Replies"}
                </button>
              </>
            ) : null}
            <span className="text-gray-400 text-[10px]">·</span>
            <span className="text-gray-400 text-[10px]">
              {comment?.createdAt
                ? formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: false,
                  })
                    .replace("about ", "")
                    .replace(" minutes", "m")
                    .replace(" hours", "h")
                    .replace(" days", "d")
                    .replace(" less than a minute", "1m")
                : "just now"}
            </span>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form
              onSubmit={handleReplySubmit}
              className="mt-3 flex items-center gap-2 bg-[#f2f3f5] rounded-full p-1 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all duration-200 ml-1"
            >
              <div className="relative h-7 w-7 flex items-center justify-center rounded-full bg-gray-200 overflow-hidden shrink-0">
                {user?.profileImage?.url ? (
                  <Image
                    src={user.profileImage.url}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-gray-600 uppercase">
                    {user?.firstName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <input
                autoFocus
                type="text"
                placeholder={`Reply to ${comment?.author?.firstName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-500 pl-1 py-1 text-gray-800"
              />
              <button
                type="submit"
                disabled={isSubmittingReply || !replyText.trim()}
                className="mr-2 text-gray-400 hover:text-[#0081ff] disabled:opacity-30 transition-colors"
              >
                <Send
                  size={16}
                  strokeWidth={2.5}
                  className={isSubmittingReply ? "animate-pulse" : ""}
                />
              </button>
            </form>
          )}
        </div>
      </div>

      {showReplies && (
        <div className="pl-6 ml-4 space-y-4 border-l border-gray-100 mt-4">
          {loadingReplies ? (
            <div className="space-y-3 pt-1">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onDelete={(id, deletedCount) => {
                    setReplies((prev) => prev.filter((r) => r._id !== id));
                    setLocalReplyCount((prev) =>
                      Math.max(0, prev - (deletedCount || 1)),
                    );
                  }}
                  onCommentsCountChange={onCommentsCountChange}
                />
              ))}

              {hasMoreReplies && (
                <button
                  onClick={() => fetchReplies(false)}
                  disabled={loadingMoreReplies}
                  className="w-full py-1.5 text-[11px] font-bold text-gray-500 hover:text-[#0081ff] transition-all duration-200 bg-gray-50/30 rounded-md border border-transparent hover:border-gray-50 disabled:opacity-50 mt-1"
                >
                  {loadingMoreReplies ? "Loading..." : "Load More Replies"}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
