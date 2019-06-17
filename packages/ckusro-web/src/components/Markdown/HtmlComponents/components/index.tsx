import { MarkdownTheme } from '../styles';
import Div from './Div';
import { H1, H2, H3, H4, H5, H6 } from './Heading';
import { Li, Ul } from './List';
import { Paragraph } from './Paragraph';
import Span from './Span';

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
    ul: Ul,
    li: Li,
    p: Paragraph,
  };
}
