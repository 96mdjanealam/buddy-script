import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className={cn("flex items-center gap-2 cursor-pointer")}>
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              "w-4 h-4 rounded border-gray-300 text-[#0081ff] focus:ring-[#0081ff]/20 transition-all cursor-pointer accent-[#0081ff]",
              error && "border-red-500",
              className
            )}
            {...props}
          />
          <span className="text-[14px] text-gray-600 select-none">
            {label}
          </span>
        </label>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };


