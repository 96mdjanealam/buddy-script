"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Lock, Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type PasswordValues = z.infer<typeof passwordSchema>;

const PasswordForm = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const togglePasswordVisibility = (key: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (values: PasswordValues) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.changePassword(values);

      if (response.success) {
        setSuccess("Password changed successfully!");
        reset();
      } else {
        setError(response.message || "Failed to change password");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      <div className="flex items-center gap-3 mb-6 p-4 rounded-md bg-amber-50/50 border border-amber-100/50">
        <div className="h-10 w-10 flex items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-amber-100">
          <Lock className="text-amber-500" size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-amber-900 tracking-tight">Security Tip</h4>
          <p className="text-[11px] text-amber-700/80 font-semibold uppercase tracking-wider mt-0.5">
            Min 6 characters
          </p>
        </div>
      </div>

      <FormField label="Current Password" error={errors.currentPassword?.message}>
        <div className="relative">
          <Input
            {...register("currentPassword")}
            type={showPasswords.current ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 pr-12"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("current")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormField>

      <div className="space-y-6 pt-6 border-t border-gray-100 mt-8">
        <FormField label="New Password" error={errors.newPassword?.message}>
          <div className="relative">
            <Input
              {...register("newPassword")}
              type={showPasswords.new ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 pr-12"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm New Password" error={errors.confirmNewPassword?.message}>
          <div className="relative">
            <Input
              {...register("confirmNewPassword")}
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 pr-12"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>
      </div>

      <div className="flex flex-col gap-3">
        {error && (
          <div className="px-4 py-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-md bg-green-50 border border-green-100 text-sm text-green-600 font-medium animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full sm:w-auto min-w-[170px] h-12 shadow-sm"
        >
          Set New Password
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;
