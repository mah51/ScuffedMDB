import { Session } from 'next-auth';
/* eslint-disable no-console */
import { MongoUser } from './../../../models/user';
import NextAuth, { User } from 'next-auth';
import Providers from 'next-auth/providers';
import Models from '../../../models';
//@ts-ignore
import { TypeORMLegacyAdapter } from '@next-auth/typeorm-legacy-adapter';
import dbConnect from '../../../utils/dbConnect';
import user from '../../../models/user';
import { JWT } from 'next-auth/jwt';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Discord({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      async profile(profile: any): Promise<any> {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile?.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          discord_id: profile.id,
          name: profile.username,
          image: profile.image_url,
          avatar: profile.avatar,
          discriminator: profile.discriminator,
          public_flags: profile.public_flags,
          flags: profile.flags,
          email: profile.email,
          locale: profile.locale,
          mfa_enabled: profile.mfa_enabled,
          premium_type: profile.premium_type,
          isAdmin: false,
          isReviewer: false,
          isBanned: false,
          banReason: '',
          username: profile.username,
        };
      },
    }),
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  adapter: TypeORMLegacyAdapter(process.env.MONGODB_URI, {
    models: {
      User: Models.User,
    },
  }),

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.JWT_CODE,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    secret: process.env.JWT_CODE,
    signingKey: process.env.JWT_HS512,
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn(user, account, profile) {
      const ALLOWED_USERS = process.env.ALLOWED_USERS;
      if (ALLOWED_USERS) {
        if (
          ALLOWED_USERS.replace(/\s/, '')
            .split(',')
            .includes(profile?.id as string)
        ) {
          console.log('ALLOWED_USERS', ALLOWED_USERS);
          console.log('profile', profile);
          return true;
        }
        return false;
      }
      return true;
    },
    // async redirect(url, baseUrl) { return baseUrl },
    async session(session, token: User): Promise<Session> {
      //TODO fix session func types in next auth. This type isn't done correctly, but I don't know how to do it :/.
      if (session?.user) {
        try {
          await dbConnect();
          const findUser: MongoUser = await user.findById(
            token.sub || session.user.id
          );

          if (!findUser) {
            console.log(token.sub || session.user.id);
            console.error('User not found in session callback');
            //@ts-ignore - return null to throw error and log the user out.
            return null;
          }

          if (findUser) {
            let changesMade = false;
            if (token.image && token.image !== findUser.image) {
              findUser.image = token.image;
              changesMade = true;
            }
            if (token?.name && token.name !== findUser.name) {
              findUser.username = token.name;
              findUser.name = token.name;
              changesMade = true;
            }

            if (
              token?.discriminator &&
              token.discriminator !== findUser.discriminator
            ) {
              findUser.discriminator = token.discriminator;
              changesMade = true;
            }
            if (findUser.isImageHidden) {
              findUser.image = `https://cdn.discordapp.com/embed/avatars/${
                parseInt(findUser.discriminator) % 5
              }.png`;
              changesMade = true;
            }
            if (changesMade) {
              await findUser.save();
            }
            token.banReason = findUser.banReason;
            token.isBanned = findUser.isBanned;
            token.isReviewer = findUser.isReviewer;
            token.isAdmin = findUser.isAdmin;
            token.image = findUser.image;
          }
        } catch (e) {
          console.error(e);
        }
        session.user = { ...session.user, ...token };
      }

      return session;
    },
    async jwt(
      token: { name: string; iat: number; exp: number; picture: string },
      user: User,
      acount: any,
      profile: any
    ): Promise<JWT> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { picture, ...restToken } = token;
      if (profile) {
        profile.image = profile?.image_url;
        profile.discord_id = profile?.id;
        delete profile.image_url;
        delete profile.id;
      }
      if (user) {
        user._id = user.id;
      }

      //@ts-ignore
      return { ...restToken, ...user, ...profile };
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},
  theme: 'auto',
  // Enable debug messages in the console if you are having problems
  debug: false,
});
