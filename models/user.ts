import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    discriminator: { type: String, required: true },
    public_flags: { type: Number, required: true },
    flags: { type: Number, required: true },
    locale: { type: String, required: true },
    mfa_enabled: { type: Boolean, required: true },
    premium_type: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
    isReviewer: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model(`User`, userSchema);
