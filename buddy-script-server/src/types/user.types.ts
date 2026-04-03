import type { Document, Types } from "mongoose";

export interface ICloudinaryImage {
  url: string;
  publicId: string;
}

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage: ICloudinaryImage;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublicProfile {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: ICloudinaryImage;
  createdAt: Date;
}

export interface IJwtPayload {
  userId: string;
  email: string;
}
