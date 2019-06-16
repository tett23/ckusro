import { Text as DefaultText, View as DefaultView } from '../../shared/index';
import styled, { css } from '../../styled';

export const View = styled(DefaultView)``;
export const Text = styled(DefaultText)``;

export type MarkdownTheme = {};

export function markdownComponents(markdownTheme: MarkdownTheme) {
  const StyledText = styled(Text)`
    color: #24292e;
    font-size: 1em;
    /* line-height: 1.5em; */
    word-wrap: break-word;
    /* margin: 0.67em 0; */
    flex-direction: row;
  `;

  const headingMargin = css`
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 600;
  `;
  const Heading = styled(StyledText)`
    ${headingMargin}
  `;

  return {
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
    p: styled(StyledText)`
      margin-top: 0;
    `,
    pre: styled(StyledText)``,
    code: styled(StyledText)``,
    div: styled(StyledText)``,
    br: styled(StyledText)`
      margin: 0;
      padding: 0;
      line-height: 0;
    `,
    text: styled(StyledText)`
      margin-bottom: 0;
      margin-top: 0;
    `,
  };
}
