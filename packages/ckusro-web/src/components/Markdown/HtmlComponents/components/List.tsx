import React from 'react';
import styled from '../../../styled';
import { Block, Div, ElementProps, Inline, Span, topLevel } from './common';
import { paragraph } from './Paragraph';

const list = styled(topLevel)`
  padding-left: 2em;
`;

const ol = styled(list)`
  ${list.selector} {
    margin-bottom: 0;
    margin-top: 0;
    list-style-type: lower-roman;

    ${list.selector} {
      list-style-type: lower-alpha;
    }
  }
`;

const ul = styled(list)`
  ${ol.selector} {
    list-style-type: lower-roman;
  }

  div[data-tag='ul'] {
    margin-bottom: 0;
    margin-top: 0;
  }
  ${list.selector} {
    margin-bottom: 0;
    margin-top: 0;
  }
`;

const li = styled(Div)`
  display: list-item;
  word-wrap: break-all;

  > ${paragraph.selector} {
    margin-top: 16px;
  }
  div[data-tag='ul'] {
    margin-bottom: 0;
    margin-top: 0;
  }
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

  ${dt.selector} {
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
    margin-top: 16px;
    padding: 0;
  }

  ${dd.selector} {
    margin-bottom: 16px;
    padding: 0 16px;
  }
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
