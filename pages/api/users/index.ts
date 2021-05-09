import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/user';
import dbConnect from '../../../utils/dbConnect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `GET`) {
    const users = await User.find({});

    return res.status(200).send({ users });
  }

  return null;
};
