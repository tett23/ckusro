import 'styled-components';

type Colors = {
  main: number;
  accent: number;
  background: number;
  base: number;
  text: number;
};

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors;
  }
}
