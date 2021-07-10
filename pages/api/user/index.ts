import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/user';
import dbConnect from '../../../utils/dbConnect';
import { getSession } from 'next-auth/client';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await dbConnect();
  if (req.method === `PUT`) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = await getSession({ req });
    if (!session?.user?.isAdmin) {
      return res
        .status(401)
        .json({ message: `You are not authorized to do that :(` });
    }
    const { user: usrID, promotion } = JSON.parse(req.body);
    const user = await User.findOne({ _id: usrID });

    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }
    let update = ``;
    if (promotion === `admin`) {
      update = user.isAdmin ? `admin demotion` : `admin promotion`;
      user.isAdmin = !user.isAdmin;
    }
    if (promotion === `reviewer`) {
      update = user.isReviewer ? `reviewer demotion` : `reviewer promotion`;
      user.isReviewer = !user.isReviewer;
    }

    const updatedUser = await user.save();

    return res.status(200).json({ update, ...updatedUser });
  }
  if (req.method === `DELETE`) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = await getSession({ req });
    if (!session?.user?.isAdmin) {
      return res
        .status(401)
        .json({ message: `You are not authorized to do that :(` });
    }
    const { user: usrID, reason } = JSON.parse(req.body);
    const user = await User.findOne({ _id: usrID });
    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }
    if (!user.isBanned) {
      user.banReason = reason;
    } else {
      user.banReason = ``;
    }
    user.isBanned = !user.isBanned;

    const updatedUser = await user.save();
    return res.status(200).json({
      message: `user banned successfully`,
      user: updatedUser,
    });
  }
  return res.status(405).json({ message: `method not allowed` });
};

export default handler;
