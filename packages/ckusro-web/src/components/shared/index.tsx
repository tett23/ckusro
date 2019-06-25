import { Theme } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
import React, { ReactNode } from 'react';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ViewBase(props: any) {
  return <div {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextBase(props: any) {
  return <span {...props} />;
}

export const Text = styled(TextBase)(({ theme }: { theme: Theme }) => ({
  lineHeight: '1.3em',
  fontSize: '1rem',
  color: theme.palette.text.primary,
}));

export const styles = makeStyles((theme: Theme) => ({
  small: {
    fontSize: '0.8rem',
  },
  muted: {
    color: theme.palette.text.hint,
  },
  borderTop: {
    borderTop: 'solid 1px ' + theme.palette.primary.main,
  },
  borderRight: {
    borderRight: 'solid 1px ' + theme.palette.primary.main,
  },
  borderBottom: {
    borderBottom: 'solid 1px ' + theme.palette.primary.main,
  },
  borderLeft: {
    borderLeft: 'solid 1px ' + theme.palette.primary.main,
  },
  border: {
    border: 'solid 1px ' + theme.palette.primary.main,
  },
  drawer: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const SmallText = styled(Text)(() => ({
  fontSize: '0.8rem',
}));

export const MutedText = styled(Text)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.hint,
}));

export const SmallAndMutedText = styled(Text)(
  ({ theme }: { theme: Theme }) => ({
    fontSize: '0.8rem',
    color: theme.palette.text.hint,
  }),
);

export const BoldText = styled(Text)(() => ({
  fontWeight: 'bold',
}));

export const View = styled(ViewBase)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const TouchableWithoutFeedback = ({
  children,
  onPress,
}: {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPress: () => any;
}) => {
  return <View onClick={onPress}>{children}</View>;
};
