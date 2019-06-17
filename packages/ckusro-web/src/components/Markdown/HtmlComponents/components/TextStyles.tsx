import React from 'react';
import styled from '../../../styled';
import { bold, ElementProps, Inline, Span } from './common';

const strike = styled(Span)`
  text-decoration-line: line-through;
  text-decoration-style: solid;
`;

export function Strike(props: ElementProps) {
  return <Inline {...props} TextElement={strike} />;
}

const strong = styled(Span)`
  font-weight: inherit;
  font-weight: bolder;
  ${bold}
`;

export function Strong(props: ElementProps) {
  return <Inline {...props} TextElement={strong} />;
}

const emphasis = styled(Span)`
  font-style: italic;
`;

export function Emphasis(props: ElementProps) {
  return <Inline {...props} TextElement={emphasis} />;
}
