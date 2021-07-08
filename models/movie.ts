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
  }
);

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    movieID: { type: String },
    releaseDate: { type: String },
    revenue: { type: Number },
    budget: { type: Number },
    originalLanguage: { type: String },
    runtime: { type: Number },
    voteAverage: { type: Number },
    voteCount: { type: Number },
    imdbID: { type: String },
    image: { type: String },
    genres: { type: Array },
    description: { type: String },
    tagLine: { type: String },
    rating: { type: Number, required: true },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose?.models?.Movie ||
  mongoose.model<MovieType>(`Movie`, movieSchema);

export interface ReviewType<T = string> {
  user: T;
  comment?: string;
  rating: number;
}

export interface MovieType<T = ReviewType[]> extends Document {
  name: string;
  releaseDate: string;
  revenue: number;
  budget: number;
  originalLanguage: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  imdbID: string;
  image?: string;
  genres: string[];
  movieID: string;
  description?: string;
  tagLine?: string;
  rating: number;
  numReviews?: number;
  reviews: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MovieModel = Model<MovieType>;
