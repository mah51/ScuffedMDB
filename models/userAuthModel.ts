import { Models } from '@next-auth/typeorm-legacy-adapter';
// Extend the built-in models using class inheritance
//@ts-ignore
export default class User extends Models.User.model {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

  username: string;
  image: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  email: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  isAdmin: boolean;
  isReviewer: boolean;
  isBanned: boolean;
  banReason?: string;
  discord_id: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(profile: any) {
    super(profile);
    this.discord_id = profile?.id;
    this.image = profile?.image;
    this.username = profile?.username;
    this.avatar = profile?.avatar;
    this.discriminator = profile?.discriminator;
    this.public_flags = profile?.public_flags;
    this.flags = profile?.flags;
    this.email = profile?.email;
    this.locale = profile?.locale;
    this.mfa_enabled = profile?.mfa_enabled;
    this.premium_type = profile?.premium_type;
    this.isAdmin = profile?.isAdmin;
    this.isReviewer = profile?.isReviewer;
    this.isBanned = profile?.isBanned;
    this.banReason = profile?.banReason;
  }
}

export const UserSchema = {
  name: 'User',
  target: User,
  columns: {
    //@ts-ignore
    ...Models.User.schema.columns,
    image: {
      type: 'varchar',
    },
    discord_id: {
      type: 'varchar',
    },
    username: {
      type: 'varchar',
      nullable: false,
    },
    avatar: {
      type: 'varchar',
      nullable: false,
    },
    discriminator: {
      type: 'varchar',
      nullable: true,
    },
    public_flags: {
      type: 'int',
      nullable: true,
    },

    flags: {
      type: 'int',
      nullable: true,
    },
    email: {
      type: 'varchar',
    },
    locale: {
      type: 'varchar',
    },
    mfa_enabled: {
      type: 'boolean',
    },
    premium_type: {
      type: 'int',
    },
    banReason: {
      type: 'varchar',
      nullable: true,
    },

    isBanned: {
      type: 'boolean',
      default: false,
    },
    isReviewer: {
      type: 'boolean',
      default: false,
    },
    isAdmin: {
      type: 'boolean',
      default: false,
    },
  },
};
