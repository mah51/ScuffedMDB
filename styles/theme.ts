// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { Button, Switch } from './component_styles';

// 2. Add your color mode config

interface CustomTheme extends ThemeConfig {
  useSystemColorMode: boolean;
}

const breakpoints = createBreakpoints({
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em', //1280px
  '2xl': '96em',
  '3xl': '120em', //1920px
  '4xl': '160em', // 2560px
});

const config: CustomTheme = {
  useSystemColorMode: true,
};

const components = {
  Button,
  Switch,
};

// 3. extend the theme
const theme = extendTheme({
  config,
  breakpoints,
  components,
  colors: {
    brand: {
      300: `#84C9FB`,
    },
  },
});
export default theme;
