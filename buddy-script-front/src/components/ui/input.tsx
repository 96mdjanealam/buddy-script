import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0081ff]/20 focus:border-[#0081ff] transition-all duration-200",
          error ? "border-red-500" : "border-gray-200 hover:border-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
