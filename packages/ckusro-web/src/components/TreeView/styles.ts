import {
  Text as DefaultText,
  toCssColor,
  View as DefaultView,
} from '../shared/index';
import styled, { css, StyledProps } from '../styled';

export const treeViewItem = css`
  margin: 0.1rem 0;
  height: 1.25em;
`;

export const View = styled(DefaultView)`
  color: ${({ theme }: StyledProps) => toCssColor(theme.colors.background)};
`;

export const Text = styled(DefaultText)`
  color: ${({ theme }: StyledProps) => toCssColor(theme.colors.background)};
`;
