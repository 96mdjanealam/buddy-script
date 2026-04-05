"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Post, User } from "@/types/api";
import { userService } from "@/services/user.service";
import PostCard from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

interface UserPostListProps {
  userId: string;
}

const UserPostList: React.FC<UserPostListProps> = ({ userId }) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProfileAndPosts = useCallback(async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    setError(null);
    try {
      const response = await userService.getPublicProfile(userId, { page: isInitial ? 1 : page, limit: 10 });
      
      if (isInitial) {
        setProfileUser(response.data.user);
        setPosts(response.data.posts);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
        setPage(prev => prev + 1);
      }
      setHasMore(response.data.pagination.hasNextPage);
    } catch (err: any) {
      setError(err.message || "Failed to load profile and posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, userId]);

  useEffect(() => {
    fetchProfileAndPosts(true);
  }, [userId]);

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-md shadow-sm border border-gray-100 p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
               <Skeleton className="h-8 w-16" />
               <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-sm border border-red-100 p-8 text-center space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => fetchProfileAndPosts(true)}
          className="flex items-center gap-2 mx-auto text-[#0081ff] font-bold hover:underline"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} hideOnMakePrivate={false} />
          ))}
          
          {hasMore && (
             <button
               onClick={() => fetchProfileAndPosts(false)}
               disabled={refreshing}
               className="w-full py-4 text-sm font-bold text-gray-500 hover:text-[#0081ff] transition-all duration-300 flex items-center justify-center gap-2 bg-white rounded-md border border-gray-100 shadow-sm disabled:opacity-50"
             >
               {refreshing ? (
                 <RefreshCw size={18} className="animate-spin" />
               ) : (
                 "Load More Posts"
               )}
             </button>
          )}
        </>
      ) : (
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-12 text-center space-y-3">
           <h3 className="text-lg font-bold text-gray-800">No posts yet</h3>
           <p className="text-gray-500">You haven't shared any posts.</p>
        </div>
      )}
    </div>
  );
};

export default UserPostList;
