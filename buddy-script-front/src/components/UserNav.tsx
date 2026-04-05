"use client";

import React from "react";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";

import { useRouter } from "next/navigation";

const UserNav = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userInitial = user?.firstName?.charAt(0) || "U";

  const trigger = (
    <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded-md hover:bg-gray-50/80 transition-all duration-200 group border border-transparent hover:border-gray-100 cursor-pointer">
      <div className="relative h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
        {user?.profileImage?.url ? (
          <Image
            src={user.profileImage.url}
            alt={`${user.firstName} ${user.lastName}`}
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <span className="text-[13px] font-bold text-gray-600 transition-colors uppercase">
            {userInitial}
          </span>
        )}
      </div>
      <div className="hidden md:flex items-center gap-1.5 ml-0.5 pr-1">
        <span className="text-sm font-bold text-gray-700 tracking-tight group-hover:text-gray-900 transition-colors">
          {user?.firstName} {user?.lastName}
        </span>
        <ChevronDown
          size={14}
          className="text-gray-400 group-hover:text-[#0081ff] transition-all duration-300"
          strokeWidth={3}
        />
      </div>
    </div>
  );

  return (
    <DropdownMenu trigger={trigger}>
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <p className="text-sm font-bold text-gray-900 truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
          {user?.email}
        </p>
      </div>

      <DropdownItem href="/settings" icon={<Settings size={18} />}>
        Settings
      </DropdownItem>

      <div className="border-t border-gray-100 my-1"></div>

      <DropdownItem
        onClick={handleLogout}
        icon={<LogOut size={18} />}
        className="text-red-500 hover:bg-red-50/80 transition-colors"
      >
        Logout
      </DropdownItem>
    </DropdownMenu>
  );
};

export default UserNav;
