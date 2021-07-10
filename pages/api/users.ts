import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';

type Data = {
  users: any;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  await dbConnect();
  if (req.method === `GET`) {
    const users = await User.find({});

    return res.status(200).send({ users });
  }

  return null;
};

export default handler;
