import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { DiscordUser } from '../types/generalTypes';
import User, { UserType } from '../models/user';

export async function parseUser(
  ctx: GetServerSidePropsContext,
): Promise<UserType | null> {
  if (!ctx.req.headers.cookie) {
    return null;
  }

  const { token } = parse(ctx.req.headers.cookie);
  if (!token) {
    return null;
  }

  try {
    const { iat, exp, ...user } = verify(
      token,
      process.env.JWT_CODE,
    ) as DiscordUser & { iat: number; exp: number };

    const mongooseUser = await User.findOne({ id: user.id }).lean();
    mongooseUser._id = mongooseUser.toString();
    mongooseUser.createdAt = mongooseUser.createdAt.getTime();
    mongooseUser.updatedAt = mongooseUser.updatedAt.getTime();
    return mongooseUser;
  } catch (e) {
    return null;
  }
}
