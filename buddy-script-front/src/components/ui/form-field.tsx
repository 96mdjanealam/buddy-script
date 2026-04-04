import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      <label className="text-[14px] font-medium text-gray-700 block">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export { FormField };
