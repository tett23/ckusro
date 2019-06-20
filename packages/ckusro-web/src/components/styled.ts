import { ColorScheme } from '@ckusro/ckusro-core';
// @ts-ignore
import * as styledComponents from 'styled-components';

export type Theme = {
  colors: ColorScheme;
};

const { default: styled, css, ThemeProvider } = styledComponents;

export { css, ThemeProvider };
export default styled;
