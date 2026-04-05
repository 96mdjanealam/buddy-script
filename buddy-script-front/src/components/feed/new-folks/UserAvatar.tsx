import React from "react";
import Image from "next/image";
import { NewFolksUser } from "@/types/api";

interface UserAvatarProps {
  user: Pick<NewFolksUser, "firstName" | "lastName" | "profileImage">;
  size?: number;
}

const UserAvatar = ({ user, size = 36 }: UserAvatarProps) => {
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  const hasImage = !!user.profileImage?.url;

  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden bg-[#e8f1ff] flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {hasImage ? (
        <Image
          src={user.profileImage!.url}
          alt={`${user.firstName} ${user.lastName}`}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <span
          className="font-semibold text-[#0081ff] select-none"
          style={{ fontSize: size * 0.38 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
