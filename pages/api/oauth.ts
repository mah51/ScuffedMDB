import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { DiscordUser } from '../../types/generalTypes';
import User, { UserType } from '../../models/user';
import dbConnect from '../../utils/dbConnect';

const scope = [`identify`, `email`].join(` `);
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URI}/api/oauth`;

const OAUTH_QS = new URLSearchParams({
  client_id: process.env.CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: `code`,
  scope,
}).toString();

const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method !== `GET`) return res.redirect(`/`);

  const { code = null, error = null } = req.query;

  if (error) {
    return res.redirect(`/?error=${req.query.error}`);
  }

  if (!code || typeof code !== `string`) return res.redirect(OAUTH_URI);

  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: `authorization_code`,
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  const { access_token = null, token_type = `Bearer` } = await fetch(
    `https://discord.com/api/oauth2/token`,
    {
      headers: { 'Content-Type': `application/x-www-form-urlencoded` },
      method: `POST`,
      body,
    },
  ).then((re) => re.json());

  if (!access_token || typeof access_token !== `string`) {
    return res.redirect(OAUTH_URI);
  }

  const me: DiscordUser | { unauthorized: true } = await fetch(
    `http://discord.com/api/users/@me`,
    {
      headers: { Authorization: `${token_type} ${access_token}` },
    },
  ).then((r) => r.json());

  if (!(`id` in me)) {
    return res.redirect(OAUTH_URI);
  }

  const count: UserType = await User.findOne({ id: me.id });

  let newUser: UserType;
  if (!count?.id) {
    newUser = new User({
      id: me.id,
      username: me.username,
      avatar: me.avatar,
      discriminator: me.discriminator,
      public_flags: me.public_flags,
      flags: me.flags,
      locale: me.locale,
      mfa_enabled: me.mfa_enabled,
      premium_type: me.premium_type,
    });
    await newUser.save();
  } else {
    count.id = me.id;
    count.username = me.username;
    count.avatar = me.avatar;
    count.discriminator = me.discriminator;
    count.public_flags = me.public_flags;
    count.flags = me.flags;
    count.locale = me.locale;
    count.mfa_enabled = me.mfa_enabled;
    count.premium_type = me.premium_type;
    await count.save();
  }

  const token = sign(
    count ? count.toJSON() : newUser.toJSON(),
    process.env.JWT_CODE,
    { expiresIn: `30d` },
  );
  res.setHeader(
    `Set-Cookie`,
    serialize(`token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== `development`,
      sameSite: `lax`,
      path: `/`,
    }),
  );

  return res.redirect(`/`);
};
