import type { Document, Types } from "mongoose";

export interface IComment {
  post: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  parentComment: Types.ObjectId | null;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDocument extends IComment, Document {
  _id: Types.ObjectId;
}
