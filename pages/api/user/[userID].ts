import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await dbConnect();
  switch (req.method) {
    case 'GET':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const session = await getSession({ req });
      if (!session?.user) {
        return res
          .status(401)
          .json({ message: `You are not authorized to do that :(` });
      }
      const { userID } = req.query;
      const foundUser: any = await User.findById(userID).lean();

      if (!foundUser) {
        return res.status(404).json({ message: `User not found` });
      }
      foundUser._id = foundUser.toString();
      foundUser.createdAt = foundUser.createdAt.getTime();
      foundUser.updatedAt = foundUser.updatedAt.getTime();
      return res.status(200).json(foundUser);
    case 'PUT':
      await updateUser(req, res);

      break;
    default:
      return res.status(405).json({ message: `Method not allowed` });
  }
};

export default handler;

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query;
  const session = await getSession({ req });
  if (!session?.user || !session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ message: `You are not authorized to do that :(` });
  }
  try {
    const foundUser: any = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: `User not found` });
    }
    const data = JSON.parse(req.body);
    for (const k in data) foundUser[k] = data[k];
    if (foundUser.isImageHidden) {
      foundUser.image = `https://cdn.discordapp.com/embed/avatars/${
        parseInt(foundUser.discriminator) % 5
      }.png`;
    }
    await foundUser.save();

    return res.status(200).json(foundUser);
  } catch (err) {
    return res.status(400).json({ message: err?.message });
  }
};
