import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { DiscordUser } from '../types/generalTypes';
import User, { UserType } from '../models/user';
import dbConnect from './dbConnect';

export async function parseUser(
  ctx: GetServerSidePropsContext
): Promise<UserType | null> {
  if (!ctx.req.headers.cookie) {
    return null;
  }

  const { token } = parse(ctx.req.headers.cookie);
  if (!token) {
    return null;
  }

  try {
    const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
      iat: number;
      exp: number;
    };
    await dbConnect();
    const mongooseUser: UserType = await User.findOne({ id: user.id }).lean();
    if (!mongooseUser) {
      return null;
    }
    mongooseUser._id = mongooseUser.toString();
    return mongooseUser;
  } catch (e) {
    console.error(e);
    return null;
  }
}
