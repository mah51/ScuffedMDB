import mongoose, { Document, Model } from 'mongoose';
import { Overwrite, PopulatedUserType } from './user';

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

const categorySchema = new mongoose.Schema({
    alias: { type: String, required: true },
    title: { type: String, required: true }
})

const restaurantSchema = new mongoose.Schema(
    {
        alias: { type: String, required: true },
        name: { type: String },
        image_url: { type: String },
        is_closed: { type: Boolean },
        url: { type: String },
        phone: { type: String },
        display_phone: { type: String },
        review_count: { type: Number },
        categories: [categorySchema],
        rating: { type: Number },
        yelp_rating: {type: Number},
        address: [{ type: String }],
        photos: [{type: String}],
        price: { type: String },
        numReviews: { type: Number, default: 0 },
        reviews: [reviewSchema]
    },
    { timestamps: true }
)


export interface ReviewType<T = PopulatedUserType> {
    _id: string;
    user: T extends string ? T : T | null;
    comment?: string;
    rating: number;
}


export interface CategoryType {
    alias: string,
    title: string
}

export interface RestaurantType<T = ReviewType[]> extends Document {
    alias: string;
    name: string;
    image_url: string;
    is_closed: boolean;
    url: string;
    phone: string;
    display_phone: string;
    review_count: number;
    rating: number;
    categories?: CategoryType[];
    address: string[];
    photos: string[];
    price: string;
    numReviews: number;
    yelp_rating: number;
    reviews: T;
    createdAt: Date;
    updatedAt: Date;
}

export default mongoose?.models?.Restaurant ||
    mongoose.model<RestaurantType>(`Restaurant`, restaurantSchema);

export type SerializedRestaurantType<T = ReviewType[]> = Overwrite<
    RestaurantType<T>,
    { createdAt: string; updatedAt: string; _id: string }
>;

export type RestaurantModel = Model<RestaurantType>;
