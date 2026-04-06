"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsUp,
  MessageSquare,
  MoreVertical,
  Trash2,
  Lock,
  Globe,
  MessageCircleMore,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Post } from "@/types/types";
import { postService } from "@/services/post.service";
import Image from "next/image";
import CommentSection from "./CommentSection";
import Link from "next/link";
import toast from "react-hot-toast";

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
  hideOnMakePrivate?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostDeleted,
  hideOnMakePrivate = true,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [latestLikers, setLatestLikers] = useState(post.latestLikers || []);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [postVisibility, setPostVisibility] = useState<"public" | "private">(
    post.visibility || "public",
  );
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

  useEffect(() => {
    if (post.isLiked !== undefined) setIsLiked(post.isLiked);
    if (post.likesCount !== undefined) setLikesCount(post.likesCount);
    if (post.latestLikers !== undefined) setLatestLikers(post.latestLikers);
    if (post.visibility !== undefined) setPostVisibility(post.visibility);
    if (post.commentsCount !== undefined) setCommentsCount(post.commentsCount);
  }, [
    post.isLiked,
    post.likesCount,
    post.latestLikers,
    post.visibility,
    post.commentsCount,
  ]);

  const handleCommentsCountChange = (delta: number) => {
    setCommentsCount((prev) => Math.max(0, prev + delta));
  };

  // Click outside listener for dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleToggleVisibility = async () => {
    const newVisibility = postVisibility === "public" ? "private" : "public";
    setIsUpdatingVisibility(true);
    try {
      const response = await postService.toggleVisibility(
        post._id,
        newVisibility,
      );
      if (response.success) {
        setPostVisibility(newVisibility);

        // Optimistically remove the post from the public feed view, if configured
        if (hideOnMakePrivate && newVisibility === "private" && onPostDeleted) {
          setTimeout(() => onPostDeleted(post._id), 300); // Small delay for smooth animation out
        }
      }
    } catch (error) {
      console.error("Failed to update visibility:", error);
      toast.error("Failed to update post visibility. Please try again.");
    } finally {
      setIsUpdatingVisibility(false);
      setShowMenu(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      const response = await postService.toggleLike(post._id);
      if (response.success) {
        // Update from server response to ensure consistency
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
        setLatestLikers(response.data.latestLikers || []);
      }
    } catch (error) {
      // Rollback on error
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeleteClick = () => {
    if (isDeleting) return;
    setShowMenu(false);

    toast(
      (t) => (
        <div className="flex flex-col gap-2.5 min-w-[240px] p-1">
          <p className="font-semibold text-[14px] text-gray-900">
            Delete this post?
          </p>
          <p className="text-[13px] text-gray-500 leading-snug">
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3.5 py-1.5 text-[13px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete();
              }}
              className="px-3.5 py-1.5 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm tracking-wide"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000, id: `delete-confirm-${post._id}` },
    );
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    const deleteToastId = toast.loading("Deleting post...");

    try {
      await postService.deletePost(post._id);
      if (onPostDeleted) {
        onPostDeleted(post._id);
      }
      toast.success("Post deleted successfully", { id: deleteToastId });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post. Please try again.", {
        id: deleteToastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user?._id === post.author._id;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 mb-6 overflow-hidden transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2">
      <div className="p-4">
        {/* PostHeader */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <Link
            href={`/profile/${post.author._id}`}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
              {post?.author?.profileImage?.url ? (
                <Image
                  src={post.author.profileImage.url}
                  alt={`${post?.author?.firstName} ${post?.author?.lastName}`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <span className="text-[14px] font-bold text-gray-600 uppercase">
                  {post?.author?.firstName?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none group-hover:text-[#0081ff] transition-colors">
                {post?.author?.firstName} {post?.author?.lastName}
              </h3>
              <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
                {post?.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt))
                  : "just now"}{" "}
                ago
                <span className="mx-0.5">·</span>
                <span className="flex items-center gap-1">
                  {postVisibility === "public" ? (
                    <Globe size={12} />
                  ) : (
                    <Lock size={12} />
                  )}
                  <span className="capitalize">{postVisibility}</span>
                </span>
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 relative" ref={menuRef}>
            {isAuthor && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none"
              >
                <MoreVertical size={20} />
              </button>
            )}

            {showMenu && isAuthor && (
              <div className="absolute right-0 top-8 w-44 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={handleToggleVisibility}
                  disabled={isUpdatingVisibility}
                  className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                >
                  {postVisibility === "public" ? (
                    <Lock size={16} />
                  ) : (
                    <Globe size={16} />
                  )}
                  {isUpdatingVisibility
                    ? "Updating..."
                    : postVisibility === "public"
                      ? "Make Private"
                      : "Make Public"}
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete post"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PostContent */}
        <div className="space-y-3">
          {post.text && (
            <p className="text-[14px] text-gray-800 leading-normal whitespace-pre-wrap">
              {post.text}
            </p>
          )}

          {post.image?.url && (
            <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
              <img
                src={post.image.url}
                alt="Post image"
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-between py-2.5 mt-1 px-1">
          <div className="flex items-center h-6">
            {likesCount > 0 && (
              <div className="flex items-center -space-x-1">
                {[...latestLikers].reverse().map((liker, idx) => (
                  <div
                    key={liker._id}
                    className="relative h-[22px] w-[22px] rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm"
                    style={{ zIndex: idx + 1 }}
                  >
                    {liker.profileImage?.url ? (
                      <Image
                        src={liker.profileImage.url}
                        alt={liker.firstName}
                        fill
                        sizes="22px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 text-[8px] font-bold text-gray-500 uppercase">
                        {liker.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {likesCount > latestLikers.length && (
                  <div
                    className="relative h-[22px] w-[22px] rounded-full border-2 border-white bg-[#0081ff] flex items-center justify-center shadow-sm"
                    style={{ zIndex: 10 }}
                  >
                    <span className="text-[9px] font-bold text-white">
                      +{likesCount - latestLikers.length}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className="text-[13px] text-gray-500 hover:underline cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            {commentsCount} Comment
          </div>
        </div>

        {/* PostActions */}
        <div className="flex items-center justify-between pt-1 pb-1 border-t border-gray-100 mt-1 gap-1">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium text-[14px] transition-colors ${
              isLiked
                ? "bg-[#eef5fd] text-[#0081ff]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ThumbsUp
              size={18}
              className={isLiked ? "fill-[#0081ff] text-[#0081ff]" : ""}
              strokeWidth={2}
            />
            Like
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium text-[14px] text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <MessageCircleMore size={18} strokeWidth={2} />
            Comment
          </button>
        </div>

        {showComments && (
          <CommentSection
            postId={post._id}
            commentsCount={commentsCount}
            onCommentsCountChange={handleCommentsCountChange}
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
