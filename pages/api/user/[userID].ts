import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { useAPIAuth } from '../../../utils/useAPIAuth';
import User from '../../../models/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const user = await useAPIAuth(req, res);
  if (!user) {
    return res.status(401).json({
      message: `You are unauthorized to view this page, please login first!`,
    });
  }
  const { uID } = req.query;
  const foundUser: any = User.findOne({ _id: uID }).lean();

  if (!foundUser) {
    return res.status(400).json({ message: `User not found` });
  }
  foundUser._id = foundUser.toString();
  foundUser.createdAt = foundUser.createdAt.getTime();
  foundUser.updatedAt = foundUser.updatedAt.getTime();

  return res.status(200).json(foundUser);
};
