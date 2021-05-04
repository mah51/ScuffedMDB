import { serialize } from 'cookie';

export default async (req, res) => {
  res.setHeader(
    `Set-Cookie`,
    serialize(`token`, ``, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== `development`,
      sameSite: `lax`,
      path: `/`,
    }),
  );

  res.writeHead(302, { Location: `/` });
  res.end();
};
