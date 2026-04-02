import type { Document, Types } from "mongoose";

export interface ILike {
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

export interface ILikeDocument extends ILike, Document {
  _id: Types.ObjectId;
}
