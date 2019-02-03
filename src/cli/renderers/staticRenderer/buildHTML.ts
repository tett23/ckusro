import { Props } from './assets/components';
import render from './render';

export default function buildHTML(props: Props) {
  const { html, styles } = render(props);
  return `
<html>
  <head>
    ${styles}
  </head>
  <body>
    ${html}
  </body>
</html>
  `;
}
