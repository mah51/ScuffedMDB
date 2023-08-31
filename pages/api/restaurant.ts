import Restaurant, { RestaurantType } from '../../models/restaurant';
import dbConnect from '../../utils/dbConnect';
import { YelpMatchResponse } from './restaurant-api'
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void | NextApiResponse<any>> {
    await dbConnect();
    if (req.method === `POST`) {
        try {
            const body: YelpMatchResponse = JSON.parse(req.body)
            const exists = await Restaurant.findOne({ alias: body.alias })
            if (exists) {
                return res.status(400).send({ message: "Restaurant already exists" })
            }
            const newRestaurant: RestaurantType = new Restaurant({
                alias: body.alias,
                name: body.name,
                image_url: body.image_url,
                is_closed: body.is_closed,
                url: body.url,
                phone: body.phone,
                display_phone: body.display_phone,
                review_count: body.review_count,
                rating: body.rating,
                categories: body.categories,
                address: body?.location?.display_address,
                photos: body?.photos,
                price: body.price,
                numReviews: 0,
                reviews: []
            })
            await newRestaurant.save();

            return res.status(200).send({ data: newRestaurant, type: 'addition' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal servor error" })
        }
    }
    else if (req.method === `GET`) {
        try {
            const restaurants = await fetchAllRestaurants();
            return res.status(200).send({ data: restaurants });
        } catch (err) {
            console.error(err);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    return res.status(405).json({ message: "Method not supported" });
}



export const fetchAllRestaurants = async (): Promise<RestaurantType[]> => {
    const restaurants = Restaurant.find({})
        .populate(`reviews.user`, `username discord_id image discriminator`)
        .sort({ createdAt: -1 });
    return restaurants;
};