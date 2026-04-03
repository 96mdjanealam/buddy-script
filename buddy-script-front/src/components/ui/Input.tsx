import React, { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {/* Input Label */}
        <label className="block text-color4 font-medium mb-2 text-base">
          {label}
        </label>

        {/* Input Field Wrapper for Relative Positioning */}
        <div className="relative">
          {/* Input Field with Inline Styling for Border to ensure design consistency */}
          <input
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={`w-full px-4 h-12 bg-white border border-input-border ${
              error ? "border-red-500 text-red-500" : ""
            } rounded-md focus:outline-none focus:border-primary text-sm transition-all placeholder:text-zinc-400 ${className} ${
              isPassword ? "pr-12" : ""
            }`}
            {...props}
          />

          {/* Password Visibility Toggle Button */}
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-primary transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff size={20} className="stroke-[1.5px]" />
              ) : (
                <Eye size={20} className="stroke-[1.5px]" />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
