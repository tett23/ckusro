import { join as joinPath } from 'path';
import { LoaderContext } from '../loader';
import { CkusroFile } from '../models/ckusroFile';

export type IncompletenessLink = {
  namespace: string;
  name: string;
  anchor: string | null;
};

export type Link = {
  namespace: string;
  path: string;
  anchor: string | null;
  isExist: boolean;
};

export default function parseLinkText(
  context: LoaderContext,
  text: string,
): IncompletenessLink {
  let namespace;
  let tmp;
  if (text.includes(':')) {
    [namespace, tmp] = text.split(':', 2);
  } else {
    tmp = text;
  }

  let name;
  let anchor = null;
  if (tmp.includes('#')) {
    [name, anchor] = tmp.split('#', 2);
  } else {
    name = tmp;
  }

  return {
    namespace: namespace || context.name,
    name,
    anchor,
  };
}

const LinkTypeAbsolute: 'absolute' = 'absolute';
const LinkTypeName: 'name' = 'name';
type LinkTypes = typeof LinkTypeAbsolute | typeof LinkTypeName;

export function determineLinkFile(
  link: IncompletenessLink,
  files: CkusroFile[],
): Link {
  const namespaceItems = files.flatMap((f) =>
    link.namespace === f.namespace ? [f] : [],
  );

  // TODO: Implement anchor variable
  // TODO: It must consider the case where relative path

  switch (linkType(link.name)) {
    case LinkTypeAbsolute:
      return determineAbsoluteLink(link, namespaceItems);
    case LinkTypeName:
      return determineNameLink(link, namespaceItems);
  }
}

function linkType(name: string): LinkTypes {
  if (name.startsWith('/')) {
    return LinkTypeAbsolute;
  }

  return LinkTypeName;
}

function determineAbsoluteLink(
  link: IncompletenessLink,
  files: CkusroFile[],
): Link {
  const ret = {
    namespace: link.namespace,
    path: link.name,
    anchor: link.anchor,
    isExist: false,
  };
  const file = files.find(({ path }) => path === link.name) || null;
  if (file == null) {
    return ret;
  }

  return Object.assign(ret, { isExist: true });
}

function determineNameLink(
  link: IncompletenessLink,
  files: CkusroFile[],
): Link {
  const ret = {
    namespace: link.namespace,
    anchor: link.anchor,
    isExist: false,
  };
  const file = files.find(({ name }) => name === link.name) || null;
  if (file == null) {
    return Object.assign(ret, { path: joinPath('/', link.name) });
  }

  return Object.assign(ret, { path: file.path, isExist: true });
}
