import { serialize } from 'cookie';
import { config } from '../../utils/config';

export default async (req, res) => {
  res.setHeader(
    `Set-Cookie`,
    serialize(config.cookieName, ``, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== `development`,
      sameSite: `lax`,
      path: `/`,
    }),
  );

  res.writeHead(302, { Location: `/` });
  res.end();
};
