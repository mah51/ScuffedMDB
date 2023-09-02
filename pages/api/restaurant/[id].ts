import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'utils/dbConnect';
import Restaurant from 'models/restaurant';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
    if (req.method === 'GET') {
        await dbConnect();
        try {
            const { isLean, id } = req.query;

            const data: any = isLean
                ? await Restaurant.findById(id)
                    .populate(`reviews.user`, `username discord_id image discriminator`)
                    .lean()
                : await Restaurant.findById(id).populate(
                    `reviews.user`,
                    `username discord_id image discriminator`
                );

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ message: 'Could not find movie' });
        }
    }
    else {
        return res.status(405).json({message: "Method not supported"});
    }
}

export default handler;