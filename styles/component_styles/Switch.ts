const Switch = {
  variants: {
    square: (props: Record<string, any>): Record<string, any> => ({
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
