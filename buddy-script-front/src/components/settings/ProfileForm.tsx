"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Camera, User as UserIcon } from "lucide-react";
import Image from "next/image";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type ProfileValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user, setUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage?.url || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  React.useEffect(() => {
    if (user?.profileImage?.url && !selectedImage) {
      setPreviewUrl(user.profileImage.url);
    }
  }, [user?.profileImage?.url, selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (values: ProfileValues) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateProfile({
        ...values,
        image: selectedImage || undefined,
      });

      if (response.success) {
        setUser(response.data);
        setSuccess("Profile updated successfully!");
        setSelectedImage(null);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center sm:items-start gap-4">
        <label className="text-sm font-semibold text-gray-700">Profile Image</label>
        <div className="relative group">
          <div className="relative h-28 w-28 rounded-3xl overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-inner group-hover:border-[#0081ff]/30 transition-colors">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">
                <UserIcon size={40} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-[-8px] right-[-8px] p-2.5 bg-[#0081ff] text-white rounded-md shadow-sm hover:bg-[#006bd4] hover:scale-110 active:scale-95 transition-all duration-200"
            title="Upload new photo"
          >
            <Camera size={18} strokeWidth={2.5} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
          JPG, PNG or SVG. Max size 2MB.
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <FormField label="First Name" error={errors.firstName?.message}>
          <Input
            {...register("firstName")}
            placeholder="John"
            className="h-12"
          />
        </FormField>
        <FormField label="Last Name" error={errors.lastName?.message}>
          <Input
            {...register("lastName")}
            placeholder="Doe"
            className="h-12"
          />
        </FormField>
      </div>

      <FormField label="Email Address">
        <Input
          value={user?.email || ""}
          disabled
          className="bg-gray-50/50 text-gray-400 cursor-not-allowed h-12 border-gray-100"
        />
        <p className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">
          Registered email cannot be changed.
        </p>
      </FormField>

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
          className="w-full sm:w-auto min-w-[160px] h-12 shadow-sm"
        >
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;


