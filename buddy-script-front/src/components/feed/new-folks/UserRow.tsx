import React from "react";
import Link from "next/link";
import { NewFolksUser } from "@/types/types";
import UserAvatar from "./UserAvatar";

interface UserRowProps {
  user: NewFolksUser;
}

const formatJoinDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const UserRow = ({ user }: UserRowProps) => {
  return (
    <Link
      href={`/profile/${user._id}`}
      className="flex items-center justify-between gap-2 py-2.5 rounded-md px-1 -mx-1 hover:bg-slate-50 transition-colors group"
    >
      {/* Left: avatar + name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <UserAvatar user={user} size={36} />
        <span className="text-sm font-medium text-slate-800 truncate leading-tight group-hover:text-[#0081ff] transition-colors">
          {user.firstName} {user.lastName}
        </span>
      </div>

      {/* Right: join date */}
      <span className="shrink-0 text-[11px] text-slate-400 whitespace-nowrap">
        {formatJoinDate(user.createdAt)}
      </span>
    </Link>
  );
};

export default UserRow;


