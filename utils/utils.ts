import { UserType } from '../models/user';

export const getTotalCharCode = (phrase: string): number => {
  return phrase.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
};

export const getUserAvatar = (user: UserType): string => {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}`
    : `https://cdn.discordapp.com/embed/avatars/${
        Number(user.discriminator) % 5
      }.png`;
};
