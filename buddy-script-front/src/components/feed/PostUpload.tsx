"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Image as ImageIcon, X, Send, Pencil } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { postService } from "@/services/post.service";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const postSchema = z
  .object({
    text: z.string().max(5000, "Post cannot exceed 5000 characters").optional(),
  })
  .refine((data) => data.text?.trim() !== "", {
    message: "Post must have at least text or an image",
    path: ["text"],
  });

type PostFormValues = z.infer<typeof postSchema>;

interface PostUploadProps {
  onPostCreated?: () => void;
}

const PostUpload: React.FC<PostUploadProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: PostFormValues) => {
    if (!values.text && !selectedImage) {
      setError("Please provide text or an image");
      return;
    }

    setError(null);
    try {
      const formData = new FormData();
      if (values.text) formData.append("text", values.text);
      if (selectedImage) formData.append("image", selectedImage);

      await postService.createPost(formData);
      reset();
      removeImage();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create post. Please try again.");
    }
  };

  const userInitial = user?.firstName?.charAt(0) || "U";

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top Content Area */}
        <div className="p-4 flex gap-3 items-start">
          <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
            {user?.profileImage?.url ? (
              <Image
                src={user.profileImage.url}
                alt={`${user.firstName} ${user.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-[14px] font-bold text-gray-600 uppercase">
                {userInitial}
              </span>
            )}
          </div>

          <div className="flex-1 pt-1 min-w-0">
            <div className="relative flex items-start gap-2 text-gray-500 group focus-within:text-gray-800">
              <textarea
                {...register("text")}
                placeholder="Write something ..."
                className="w-full min-h-[40px] px-0 py-1 bg-transparent resize-none outline-none text-[15px] font-medium text-gray-800 placeholder:text-gray-500 placeholder:font-normal placeholder:transition-colors transition-colors focus:placeholder:text-gray-400"
                rows={1}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height =
                    e.currentTarget.scrollHeight + "px";
                }}
              />
              <Pencil
                size={18}
                strokeWidth={1.5}
                className="mt-1 flex-shrink-0 text-gray-400"
              />
            </div>

            {previewUrl && (
              <div className="relative rounded-md overflow-hidden border border-gray-100 mt-3">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full max-h-[300px] object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-gray-900/50 hover:bg-gray-900/70 text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 font-medium mt-2">{error}</p>
            )}
            {errors.text && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.text.message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4">
          <div className="bg-[#f8fbff] p-2 flex items-center justify-between border-t border-blue-50/40 rounded-md">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-[14.5px] text-gray-600 hover:text-[#0081ff] hover:bg-[#0081ff]/10 p-2 rounded-md transition-colors"
              >
                <ImageIcon size={19} strokeWidth={1.5} />
                Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="h-[38px] px-6 bg-[#0081ff] hover:bg-[#0073e6] text-white font-medium rounded-md gap-2"
            >
              <Send size={15} strokeWidth={2} />
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostUpload;
