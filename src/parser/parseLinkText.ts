import { LoaderContext } from '../loader';

export type Link = {
  namespace: string;
  page: string;
  anchor: string | null;
};

export default function parseLinkText(context: LoaderContext, text: string): Link {
  let namespace;
  let tmp;
  if (text.includes(':')) {
    [namespace, tmp] = text.split(':', 2);
  } else {
    tmp = text;
  }

  let page;
  let anchor = null;
  if (tmp.includes('#')) {
    [page, anchor] = tmp.split('#', 2);
  } else {
    page = tmp;
  }

  return {
    namespace: namespace || context.name,
    page,
    anchor,
  };
}
