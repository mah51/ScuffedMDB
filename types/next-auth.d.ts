// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */

  interface User {
    avatar: string;
    createdAt: string;
    discriminator: string;
    email: string;
    exp: number;
    flags: number;
    iat: number;
    id: string;
    image: string;
    isAdmin: boolean;
    isBanned: boolean;
    isReviewer: boolean;
    locale: string;
    mfa_enabled: boolean;
    name: string;
    picture: string;
    premium_type: number;
    public_flags: number;
    sub: string;
    updatedAt: string;
    username: string;
  }

  interface Session {
    user: User;
  }
  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
}

export { User as UserAuthType };
