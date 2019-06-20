import React, { ReactNode } from 'react';
import styled, { css, StyledProps } from '../styled';

type RGB = [number, number, number];

function toRGBTriple(color: number): RGB {
  const hex = ('000000' + color.toString(16)).substr(-6);

  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

export function toCssColor(rgb: RGB | number, alpha?: number) {
  let triple: RGB;
  if (typeof rgb === 'number') {
    triple = toRGBTriple(rgb);
  } else {
    triple = rgb;
  }
  const [r, g, b] = triple;

  return `rgba(${r}, ${g}, ${b}, ${alpha || 1.0})`;
}

export const Text = styled.Text`
  line-height: 1.3em;
  font-size: 1rem;
  color: ${({ theme }: StyledProps) => toCssColor(theme.colors.text)};
`;

export const small = css`
  font-size: 0.8rem;
`;

export const SmallText = styled(Text)`
  ${small}
`;

export const muted = css`
  color: ${({ theme }: StyledProps) => toCssColor(theme.colors.text, 0.75)};
`;

export const MutedText = styled(Text)`
  ${muted}
`;

export const SmallAndMutedText = styled(Text)`
  ${small}
  ${muted}
`;

export const BoldText = styled(Text)`
  font-weight: bold;
`;

export const View = styled.View``;

export const borderTop = css`
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: ${(props: StyledProps) => {
    return `#${props.theme.colors.base.toString(16)}`;
  }};
`;

export const borderRight = css`
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: ${(props: StyledProps) => {
    return `#${props.theme.colors.base.toString(16)}`;
  }};
`;

export const borderBottom = css`
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: StyledProps) => {
    return `#${props.theme.colors.base.toString(16)}`;
  }};
`;

export const borderLeft = css`
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: ${(props: StyledProps) => {
    return `#${props.theme.colors.base.toString(16)}`;
  }};
`;

export const border = css`
  ${borderTop}
  ${borderRight}
  ${borderBottom}
  ${borderLeft}
`;

export const drawer = css`
  background-color: ${({ theme }: StyledProps) =>
    toCssColor(theme.colors.base)};
`;

export const TouchableWithoutFeedback = ({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => any;
}) => {
  return <View onClick={onPress}>{children}</View>;
};
