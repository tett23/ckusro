import merge from 'lodash.merge';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import rehypeParse from 'rehype-parse';
import unified from 'unified';

export type Options = {
  components: any;
};

const defaultOptions: Options = {
  components: {},
};

type JSXNode = {
  type: 'jsx';
  value: string;
  data: {
    component: string;
    props: { [key in string]: any } | null;
  };
};

export default function transform(
  options: DeepPartial<Options>,
  node: JSXNode,
) {
  const merged: Options = merge(defaultOptions, options);

  const { component, props } = (node as JSXNode).data;
  const Component = merged.components[component];
  if (Component == null) {
    return node;
  }

  const html = ReactDOMServer.renderToString(<Component {...props || {}} />);
  const hast: any = unified()
    .use(rehypeParse)
    .parse(html);
  const body = hast.children[0].children[1].children;

  return body;
}
