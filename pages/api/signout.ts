import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.setHeader(
    `Set-Cookie`,
    serialize(`token`, ``, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== `development`,
      sameSite: `lax`,
      path: `/`,
    })
  );

  res.writeHead(302, { Location: `/` });
  res.end();
};

export default handler;
