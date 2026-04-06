"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

const DropdownMenu = ({ trigger, children, align = "right", className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-48 rounded-md bg-white shadow-sm ring-1 ring-black/5 focus:outline-none overflow-hidden animate-in fade-in zoom-in duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
}

const DropdownItem = ({ children, onClick, href, className, icon }: DropdownItemProps) => {
  const content = (
    <div className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0081ff] transition-colors duration-150">
      {icon && <span className="mr-3 text-gray-400 group-hover:text-[#0081ff] transition-colors">{icon}</span>}
      <span className="font-medium">{children}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn("block w-full text-left group", className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn("block w-full text-left focus:outline-none group", className)}
      role="menuitem"
    >
      {content}
    </button>
  );
};

export { DropdownMenu, DropdownItem };


