import { NextApiRequest } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { DiscordUser } from '../types/generalTypes';
import User, { UserType } from '../models/user';

async function useAPIAuth(
  req: NextApiRequest,
  JWT_SECRET = process.env.JWT_CODE
): Promise<UserType | false> {
  if (!req.headers.cookie) {
    return null;
  }

  const { token } = parse(req.headers.cookie);
  if (!token) {
    return null;
  }

  try {
    const { ...user } = verify(
      token,
      JWT_SECRET || `This is not for production`
    ) as DiscordUser;

    const discUser = await User.findOne({ id: user.id });
    if (!discUser) {
      return false;
    }
    return discUser;
  } catch (e) {
    return false;
  }
}

export { useAPIAuth };
