import mongoose, { Document, Model } from 'mongoose';

const userSchema = new mongoose.Schema<UserType, UserModel>(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    discriminator: { type: String, required: true },
    public_flags: { type: Number, required: true },
    flags: { type: Number, required: true },
    email: { type: String },
    locale: { type: String, required: true },
    mfa_enabled: { type: Boolean, required: true },
    premium_type: { type: Number, default: 0 },
    last_updated: { type: Number, default: Date.now() },
    isAdmin: { type: Boolean, default: false },
    isReviewer: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    bio: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model(`User`, userSchema);

export interface UserType extends Document {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type?: number;
  last_updated?: number;
  email?: string;
  isAdmin?: boolean;
  isReviewer?: boolean;
  createdAt?: string;
  isBanned?: boolean;
  banReason?: string;
  updatedAt?: string;
  bio?: string;
}

type UserModel = Model<UserType>;
