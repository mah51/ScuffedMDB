import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { MovieEndpointBodyType } from '../types/APITypes';
import { DiscordUser } from '../types/generalTypes';
import User from '../models/user';

async function useAPIAuth(req, res, JWT_SECRET = process.env.JWT_CODE) {
    if (!req.headers.cookie) {
        return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
        return null;
    }
    try {
        const { iat, exp, ...user } = verify(
            token,
            JWT_SECRET || `This is not for production`,
        ) as DiscordUser & { iat: number; exp: number };

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
