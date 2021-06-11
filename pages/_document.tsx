import { ColorModeScript } from '@chakra-ui/color-mode';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

import theme from '../theme';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): any {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): any {
    return (
      <Html>
        <Head />
        <body style={{ width: `100vw`, height: `100vh` }}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
