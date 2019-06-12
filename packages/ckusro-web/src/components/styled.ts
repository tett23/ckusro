import { ColorScheme } from '@ckusro/ckusro-core';
import { DefaultTheme } from 'styled-components';
// @ts-ignore
import * as styledComponents from 'styled-components/primitives';

export type Theme = {
  colors: ColorScheme;
};

const {
  default: styled,
  css,
  ThemeProvider,
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<
  DefaultTheme
>;

export { css, ThemeProvider };
export default styled;
