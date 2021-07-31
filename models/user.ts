import mongoose, { Document, Model, ObjectId } from 'mongoose';

const userSchema = new mongoose.Schema<MongoUser, UserModel>(
  {
    discord_id: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String },
    emailVerified: { type: String, default: null },
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
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model(`User`, userSchema);
export interface LeanMongoUser {
  _id: ObjectId;
  name: string;
  discord_id: string;
  username: string;
  image: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type?: number;
  email: string;
  isAdmin: boolean;
  isReviewer: boolean;
  createdAt: Date;
  isBanned: boolean;
  banReason?: string;
  updatedAt: Date;
}

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type SerializedUser = Overwrite<
  LeanMongoUser,
  {
    createdAt: string;
    updatedAt: string;
    _id: string;
  }
>;

export interface PopulatedUserType {
  _id: string;
  discord_id: string;
  image: string;
  username: string;
  discriminator: string;
}

export type MongoUser = Document & LeanMongoUser;

type UserModel = Model<MongoUser>;
