import React from "react";
import Link from "next/link";
import {
  PlayCircle,
  BarChart2,
  UserPlus,
  Bookmark,
  Users,
  Gamepad2,
  Settings,
  Save,
} from "lucide-react";

const LeftSidebar = () => {
  const menuItems = [
    { icon: PlayCircle, label: "Learning", href: "/learning", isNew: true },
    { icon: BarChart2, label: "Insights", href: "/insights" },
    { icon: UserPlus, label: "Find friends", href: "/find-friends" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: Users, label: "Group", href: "/group" },
    { icon: Gamepad2, label: "Gaming", href: "/gaming", isNew: true },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Save, label: "Save post", href: "/saved-posts" },
  ];

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-slate-100 p-5">
      <h2 className="text-lg font-semibold text-slate-900 mb-5 pl-1 tracking-tight">
        Explore{" "}
        <span className="italic text-xs text-slate-400 font-normal ml-2">
          Coming soon
        </span>
      </h2>

      <nav className="flex flex-col space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className="group flex items-center justify-between p-2.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors stroke-[1.5]" />
                <span className="font-medium text-[15px] text-[#334155] group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </div>
              {item.isNew && (
                <span className="bg-[#1cdb94] text-white text-[11px] font-bold px-2.5 py-[2px] rounded-md tracking-wide">
                  New
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default LeftSidebar;


