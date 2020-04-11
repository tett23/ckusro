import merge from 'lodash.merge';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import rehypeParse from 'rehype-parse';
import unified from 'unified';

export type Options = {
  components: Record<string, React.FunctionComponent | React.ComponentClass>;
};

const defaultOptions: Options = {
  components: {},
};

type JSXNode<P extends Record<string, unknown>> = {
  type: 'jsx';
  value: string;
  data: {
    component: string;
    props: P | null;
  };
};

export default function renderJSXComponent<P extends Record<string, unknown>>(
  options: DeepPartial<Options>,
  node: JSXNode<P>,
) {
  const merged: Options = merge(defaultOptions, options);

  const { component, props } = node.data;
  const Component = merged.components[component];
  if (Component == null) {
    return node;
  }

  React.createElement;
  const html = ReactDOMServer.renderToString(<Component {...(props || {})} />);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hast: any = unified().use(rehypeParse).parse(html);
  const body = hast.children[0].children[1].children;

  return body;
}
