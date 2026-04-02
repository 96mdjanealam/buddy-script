import type { Document, Types } from "mongoose";
import type { ICloudinaryImage } from "./user.types.js";

export type PostVisibility = "public" | "private";

export interface IPost {
  author: Types.ObjectId;
  text?: string;
  image?: ICloudinaryImage;
  visibility: PostVisibility;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends IPost, Document {
  _id: Types.ObjectId;
}
