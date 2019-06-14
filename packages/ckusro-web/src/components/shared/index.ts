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

function toCssColor(rgb: RGB | number, alpha?: number) {
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
