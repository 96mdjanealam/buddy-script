"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import UserPostList from "@/components/feed/UserPostList";
import { Home, Lock, Globe } from "lucide-react";

export default function MyPostsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8fbff] pt-6 pb-12">
        <div className="container mx-auto max-w-2xl px-4 flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0081ff]"></div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f8fbff] pt-6 pb-12">
        <div className="container mx-auto max-w-2xl px-4 text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-800">Please log in to view your posts.</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] pt-6 pb-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-6 bg-white p-6 rounded-md shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Posts</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all your public and private posts</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
             <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
               <Globe size={14} className="text-gray-500"/>
               <span>Public</span>
             </div>
             <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
               <Lock size={14} className="text-gray-500"/>
               <span>Private</span>
             </div>
          </div>
        </div>
        
        <UserPostList userId={user._id} />
      </div>
    </main>
  );
}
