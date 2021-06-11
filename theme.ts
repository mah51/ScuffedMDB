// 1. import `extendTheme` function
import { ColorMode, extendTheme, ThemeConfig } from '@chakra-ui/react';
// 2. Add your color mode config
interface CustomTheme extends ThemeConfig {
  initialColorMode: ColorMode;
  useSystemColorMode: boolean;
}

const config: CustomTheme = {
  initialColorMode: `dark`,
  useSystemColorMode: true,
};

// 3. extend the theme
const theme = extendTheme({ config });
export default theme;
