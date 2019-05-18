import { join as joinPath } from 'path';
import { FileBuffer, fileBufferName } from '../models/FileBuffer';

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
  namespace: string,
  text: string,
): IncompletenessLink {
  let tmp;
  if (text.includes(':')) {
    [, tmp] = text.split(':', 2);
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
    namespace,
    name,
    anchor,
  };
}

const LinkTypeAbsolute: 'absolute' = 'absolute';
const LinkTypeName: 'name' = 'name';
type LinkTypes = typeof LinkTypeAbsolute | typeof LinkTypeName;

export function determineLinkFile(
  link: IncompletenessLink,
  files: FileBuffer[],
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
  files: FileBuffer[],
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
  files: FileBuffer[],
): Link {
  const ret = {
    namespace: link.namespace,
    anchor: link.anchor,
    isExist: false,
  };
  const file =
    files.find((fileBuffer) => fileBufferName(fileBuffer) === link.name) ||
    null;
  if (file == null) {
    return Object.assign(ret, { path: joinPath('/', link.name) });
  }

  return Object.assign(ret, { path: file.path, isExist: true });
}
