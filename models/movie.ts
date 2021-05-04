import mongoose, { Document, Model } from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
      required: true,
    },
    comment: { type: String },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    tagLine: { type: String },
    rating: { type: Number, required: true },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Movie ||
  mongoose.model<MovieType>(`Movie`, movieSchema);

export interface ReviewType {
  user: string;
  comment?: string;
  rating: number;
}

export interface MovieType extends Document {
  name: string;
  image?: string;
  description?: string;
  tagLine?: string;
  rating: number;
  numReviews?: number;
  reviews: ReviewType[];
}

export type MovieModel = Model<MovieType>;
