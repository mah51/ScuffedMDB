const Switch = {
  variants: {
    square: (): Record<string, any> => ({
      track: {
        borderRadius: 'md',
        bg: 'whiteAlpha.200',
      },
      thumb: {
        borderRadius: 'md',
        position: 'relative',
      },
    }),
  },
};

export default Switch;
