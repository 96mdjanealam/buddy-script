"use client";

import React, { useState } from "react";
import PostUpload from "@/components/feed/PostUpload";
import PostList from "@/components/feed/PostList";
import SidebarSkeleton from "@/components/feed/SidebarSkeleton";
import LeftSidebar from "@/components/feed/LeftSidebar";

export default function Home() {
  const [feedKey, setFeedKey] = useState(0);

  const handlePostCreated = () => {
    setFeedKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - 25% */}
          <aside className="hidden lg:block lg:w-[25%] sticky top-24 self-start">
            <LeftSidebar />
          </aside>

          {/* Main Feed - Center */}
          <section className="flex-1 w-full max-w-2xl mx-auto lg:max-w-none">
            <PostUpload onPostCreated={handlePostCreated} />
            <PostList key={feedKey} />
          </section>

          {/* Right Sidebar - 25% */}
          <aside className="hidden lg:block lg:w-[25%] sticky top-24 self-start">
            <SidebarSkeleton />
          </aside>
        </div>
      </div>
    </main>
  );
}
