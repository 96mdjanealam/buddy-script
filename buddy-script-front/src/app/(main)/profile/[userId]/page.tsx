"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { userService } from "@/services/user.service";
import { User } from "@/types/api";
import UserPostList from "@/components/feed/UserPostList";
import Image from "next/image";
import { Calendar, Globe, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { user: authUser, isLoading: authLoading } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = authUser?._id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getPublicProfile(userId, { page: 1, limit: 1 });
        setProfileUser(response.data.user);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#f8fbff] pt-6 pb-12">
        <div className="container mx-auto max-w-2xl px-4 flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0081ff]"></div>
        </div>
      </main>
    );
  }

  if (error || !profileUser) {
    return (
      <main className="min-h-screen bg-[#f8fbff] pt-6 pb-12">
        <div className="container mx-auto max-w-2xl px-4 text-center mt-20 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {error || "User not found."}
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#0081ff] font-medium hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Feed
          </Link>
        </div>
      </main>
    );
  }

  const userInitial = profileUser.firstName?.charAt(0)?.toUpperCase() || "U";
  const fullName = `${profileUser.firstName} ${profileUser.lastName}`;
  const joinDate = profileUser.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#f8fbff] pt-6 pb-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Back to Feed */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0081ff] font-medium mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Feed
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden shrink-0 shadow-sm">
              {profileUser.profileImage?.url ? (
                <Image
                  src={profileUser.profileImage.url}
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <span className="text-xl font-bold text-gray-600 uppercase">
                  {userInitial}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight truncate">
                {fullName}
              </h1>
              {joinDate && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <Calendar size={14} className="shrink-0" />
                  Joined {joinDate}
                </p>
              )}
            </div>
          </div>

          {/* Subtitle bar */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">
              {isOwnProfile ? "My Posts" : `${profileUser.firstName}'s Posts`}
            </h2>
            {isOwnProfile ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  <Globe size={14} className="text-gray-500" />
                  <span>Public</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  <Lock size={14} className="text-gray-500" />
                  <span>Private</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <Globe size={14} className="text-gray-500" />
                <span>Public posts only</span>
              </div>
            )}
          </div>
        </div>

        {/* Post List */}
        <UserPostList userId={userId} isOwnProfile={isOwnProfile} />
      </div>
    </main>
  );
}
