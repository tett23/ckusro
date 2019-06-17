import styled, { css } from '../../../styled';
import { HastElement } from '../../Hast';

const base = css`
  white-space: normal;
`;

export const bold = css`
  font-weight: 600;
`;

export const Div = styled.View`
  ${base}
  display: block;
`;

export const Span = styled.Text`
  ${base}
  display: inline;

  color: #24292e;
  font-size: 1em;
  line-height: 1.5em;
  word-wrap: break-word;
  margin: 0.67em 0;
`;

export type ElementProps = {
  components: any;
  hast: HastElement;
};
