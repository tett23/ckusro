import React from 'react';
import {
  Block,
  Div as DivBase,
  ElementProps,
  Span as SpanBase,
} from './common';

export default function Div(props: ElementProps) {
  return <Block {...props} Outer={DivBase} TextElement={SpanBase} />;
}
