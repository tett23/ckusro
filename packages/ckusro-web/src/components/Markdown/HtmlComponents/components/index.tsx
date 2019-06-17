import Blockquote from './Blockquote';
import Code from './Code';
import { MarkdownTheme } from './common';
import Div from './Div';
import { H1, H2, H3, H4, H5, H6 } from './Heading';
import { Hr } from './Hr';
import { Dd, Dl, Dt, Li, Ol, Ul } from './List';
import { Paragraph } from './Paragraph';
import Pre from './Pre';
import Span from './Span';
import {
  Caption,
  Col,
  ColGroup,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from './Table';
import { Emphasis, Strike, Strong } from './TextStyles';

export default function components(_: MarkdownTheme) {
  return {
    Span,
    Div,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    ol: Ol,
    ul: Ul,
    li: Li,
    dl: Dl,
    dt: Dt,
    dd: Dd,
    p: Paragraph,
    blockquote: Blockquote,
    code: Code,
    pre: Pre,
    caption: Caption,
    col: Col,
    colgroup: ColGroup,
    table: Table,
    tbody: Tbody,
    td: Td,
    tfoot: Tfoot,
    th: Th,
    thead: Thead,
    tr: Tr,
    hr: Hr,
    strike: Strike,
    s: Strike,
    del: Strike,
    strong: Strong,
    b: Strong,
    i: Emphasis,
    em: Emphasis,
  };
}
