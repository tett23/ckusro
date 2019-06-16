import { Text as DefaultText, View as DefaultView } from '../../shared/index';
import styled, { css } from '../../styled';

export const View = styled(DefaultView)``;
export const Text = styled(DefaultText)``;

export type MarkdownTheme = {};

export function markdownComponents(_: MarkdownTheme) {
  const StyledText = styled(Text)`
    color: #24292e;
    font-size: 1em;
    /* line-height: 1.5em; */
    word-wrap: break-word;
    /* margin: 0.67em 0; */
    flex-direction: row;
  `;

  const Block = styled(View)`
    flex-direction: column;
    display: inline;
  `;
  const Inline = styled(StyledText)`
    flex-direction: row;
  `;

  const headingMargin = css`
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 600;
  `;
  const Heading = styled(Block)`
    ${headingMargin}
  `;

  const TableCell = styled(Inline)`
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  `;

  const Toplevel = styled(Block)`
    margin-bottom: 16px;
    margin-top: 0;
  `;

  const list = css`
    padding-left: 2em;
  `;

  const nestedList = css`
    margin-bottom: 0;
    margin-top: 0;
  `;

  const Ul = styled(Toplevel)`
    ${list}
  `;
  const Ol = styled(Toplevel)`
    ${list}
  `;
  const Dl = styled(Toplevel)`
    ${list}
  `;

  // ${Ul.selector} ${Ol.selector} {
  //   ${nestedList}
  // }
  // ${Ul.selector} ${Ul.selector} {
  //   ${nestedList}
  // }
  // ${Ol.selector} ${Ul.selector} {
  //   ${nestedList}
  // }
  // ${Ol.selector} ${Ol.selector} {
  //   ${nestedList}
  // }

  const Li = styled(Block)`
    word-wrap: break-all;
    flex-direction: row;
  `;

  // .markdown-body ol ol,
  // .markdown-body ol ul,
  // .markdown-body ul ol,
  // .markdown-body ul ul {
  // }

  // .markdown-body li {
  //   word-wrap: break-all;
  // }

  // .markdown-body li>p {
  //   margin-top: 16px;
  // }

  // .markdown-body li+li {
  //   margin-top: .25em;
  // }

  const Code = styled(Inline)`
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: 0.2em 0.4em;
  `;

  return {
    Block,
    Inline,
    h1: styled(Heading)`
      font-size: 2em;
    `,
    h2: styled(Heading)`
      font-size: 1.5em;
    `,
    h3: styled(Heading)`
      font-size: 1.25em;
    `,
    h4: styled(Heading)`
      font-size: 1.25em;
    `,
    h5: styled(Heading)`
      font-size: 1em;
    `,
    h6: styled(Heading)`
      font-size: 1em;
    `,
    p: styled(Toplevel)`
      margin-top: 0;
    `,
    div: styled(Block)``,
    dl: styled(Dl)``,
    ul: styled(Ul)``,
    ol: styled(Ol)``,
    li: styled(Li)``,
    table: styled(Toplevel)`
      display: block;
      overflow: auto;
      width: 100%;
    `,
    tr: styled(Block)`
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
      display: flex;
      flex-direction: row;

      :nth-child(2n) {
        background-color: #f6f8fa;
      }
    `,
    th: styled(TableCell)`
      font-weight: 600;
      flex-direction: row;
    `,
    td: styled(TableCell)`
      flex-direction: row;
    `,
    strong: styled(Inline)`
      font-weight: 600;
    `,
    br: styled(Inline)`
      margin: 0;
      padding: 0;
      line-height: 0;
    `,
    code: styled(Code)``,
    pre: styled(Toplevel)`
      background-color: #f6f8fa;
      border-radius: 3px;
      font-size: 85%;
      line-height: 1.45;
      overflow: auto;
      padding: 16px;

      > ${Code.selector} {
        background: transparent;
        border: 0;
        font-size: 100%;
        margin: 0;
        padding: 0;
        white-space: pre;
        word-break: normal;
      }

      ${Code.selector} {
        background-color: transparent;
        border: 0;
        display: inline;
        line-height: inherit;
        margin: 0;
        max-width: auto;
        overflow: visible;
        padding: 0;
        word-wrap: normal;
      }
    `,
    blockquote: styled(Toplevel)`
      border-left: 0.25em solid #dfe2e5;
      color: #6a737d;
      padding: 0 1em;

      :first-child {
        margin-top: 0;
      }
      :last-child {
        margin-bottom: 0;
      }
    `,
    text: styled(Inline)`
      margin-bottom: 0;
      margin-top: 0;
    `,
  };
}
