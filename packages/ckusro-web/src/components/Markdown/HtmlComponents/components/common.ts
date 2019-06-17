import styled, { css } from '../../../styled';
import { HastElement } from '../../Hast';

const base = css`
  white-space: normal;
`;

export const Div = styled.View`
  ${base}
  display: block;
`;

export const Span = styled.Text`
  ${base}
  display: inline;
`;

export type ElementProps = {
  components: any;
  hast: HastElement;
};
