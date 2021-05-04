import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { DiscordUser } from '../types/generalTypes';

export function parseUser(ctx: GetServerSidePropsContext): DiscordUser | null {
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
    return user;
  } catch (e) {
    return null;
  }
}
