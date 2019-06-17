import React from 'react';
import styled from '../../../styled';
import { Block, Div, ElementProps, Inline, Span, topLevel } from './common';

const list = styled(topLevel)`
  padding-left: 2em;
`;

const ol = styled(list)``;

const ul = styled(list)``;

const li = styled(Div)`
  display: list-item;
`;

export function Ol(props: ElementProps) {
  return <Block {...props} Outer={ol} TextElement={Span} />;
}

export function Ul(props: ElementProps) {
  return <Block {...props} Outer={ul} TextElement={Span} />;
}

export function Li(props: ElementProps) {
  return <Inline {...props} TextElement={li} />;
}

const dt = styled(Div)`
  padding: 0;
`;

const dd = styled(Div)`
  padding: 0;
`;

const dl = styled(list)`
  padding: 0;
`;

export function Dl(props: ElementProps) {
  return <Block {...props} Outer={dl} TextElement={Span} />;
}

export function Dt(props: ElementProps) {
  return <Block {...props} Outer={dt} TextElement={Span} />;
}

export function Dd(props: ElementProps) {
  return <Block {...props} Outer={dd} TextElement={Span} />;
}
