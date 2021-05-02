import mongoose from 'mongoose';

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
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Movie || mongoose.model(`Movie`, movieSchema);
