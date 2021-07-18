// 1. import `extendTheme` function
import { ColorMode, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { Button, Switch } from './component_styles';

// 2. Add your color mode config
interface CustomTheme extends ThemeConfig {
  initialColorMode: ColorMode;
  useSystemColorMode: boolean;
}

const config: CustomTheme = {
  initialColorMode: `dark`,
  useSystemColorMode: true,
};

const components = {
  Button,
  Switch,
};

// 3. extend the theme
const theme = extendTheme({
  config,
  components,
  colors: {
    brand: {
      300: `#84C9FB`,
    },
  },
});
export default theme;
