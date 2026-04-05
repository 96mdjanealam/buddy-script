"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import UserNav from "@/components/UserNav";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <Image
            src="/assets/logo.svg"
            alt="BuddyScript Logo"
            width={140}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            aria-label="Home Feed"
            className={`flex items-center justify-center h-16 w-12 transition-all duration-200 ${
              isActive("/")
                ? "text-[#0081ff] border-b-2 border-[#0081ff]"
                : "text-gray-500 hover:bg-gray-50 hover:text-[#0081ff]"
            }`}
          >
            <Home size={22} />
          </Link>

          <div className="h-6 w-px bg-gray-100 mx-1 hidden sm:block"></div>

          <UserNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
