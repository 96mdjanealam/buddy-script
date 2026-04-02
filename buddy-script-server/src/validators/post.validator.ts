import { z } from "zod";

export const createPostSchema = z.object({
  text: z
    .string()
    .trim()
    .max(5000, "Text cannot exceed 5000 characters")
    .optional(),
  visibility: z.enum(["public", "private"]).default("public"),
});

export const updatePostSchema = z.object({
  text: z
    .string()
    .trim()
    .max(5000, "Text cannot exceed 5000 characters")
    .optional(),
  visibility: z.enum(["public", "private"]).optional(),
});

export const toggleVisibilitySchema = z.object({
  visibility: z.enum(["public", "private"]),
});
