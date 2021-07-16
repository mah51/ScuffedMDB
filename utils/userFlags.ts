const flags: { [key: string]: number } = {
  DISCORD_EMPLOYEE: 1 << 0,
  PARTNERED_SERVER_OWNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUGHUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  TEAM_USER: 1 << 10,
  BUGHUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getFlags = (int: number): string[] => {
  const userFlags: string[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const flag in flags) {
    if (int & flags[flag]) {
      const arr = flag.toLowerCase().split(`_`);
      const push = `${
        arr[0].slice(0, 1).toUpperCase() + arr[0].slice(1)
      } ${arr[1].slice(0, 1).toUpperCase()}${arr[1].slice(1)}`;
      userFlags.push(push);
    }
  }
  return userFlags;
};
