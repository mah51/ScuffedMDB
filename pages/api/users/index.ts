import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/user';
import { DiscordUser } from '../../../types/generalTypes';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== `POST`) return res.redirect(`/`);
};
