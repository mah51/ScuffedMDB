import { mode, transparentize } from '@chakra-ui/theme-tools';
type Dict = Record<string, any>;
// eslint-disable-next-line import/no-anonymous-default-export
const Button = {
  variants: {
    IMDB: (props: Dict): Dict => ({
      color: '#F5C518',
      bg: 'transparent',
      _hover: {
        bg: mode(
          transparentize(`#F5C518`, 0.25)(props.theme),
          transparentize(`#F5C518`, 0.12)(props.theme)
        )(props),
      },
    }),
  },
};

export default Button;
