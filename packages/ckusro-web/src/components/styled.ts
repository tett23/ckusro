import { ColorScheme } from '@ckusro/ckusro-core';
// @ts-ignore
import * as styledComponents from 'styled-components/primitives';

export type Theme = {
  colors: ColorScheme;
};

export type StyledProps = styledComponents.ReactNativeThemedStyledComponentsModule<
  Theme
>;

const { default: styled, css, ThemeProvider } = styledComponents as StyledProps;

export { css, ThemeProvider };
export default styled;
