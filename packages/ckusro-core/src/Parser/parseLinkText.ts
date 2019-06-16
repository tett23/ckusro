import { join as joinPath } from 'path';
import { FileBuffer, fileBufferName } from '../models/FileBuffer';
import { InternalPath } from '../models/InternalPath';
import { compareRepoPath, RepoPath } from '../models/RepoPath';

export type IncompletenessLink = {
  repoPath: RepoPath;
  name: string;
  anchor: string | null;
};

export type Link = {
  internalPath: InternalPath;
  anchor: string | null;
  isExist: boolean;
};

export default function parseLinkText(
  repoPath: RepoPath,
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
    repoPath,
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
  const repoPathItems = files.flatMap((f) =>
    compareRepoPath(link.repoPath, f.internalPath.repoPath) ? [f] : [],
  );

  // TODO: Implement anchor variable
  // TODO: It must consider the case where relative path

  switch (linkType(link.name)) {
    case LinkTypeAbsolute:
      return determineAbsoluteLink(link, repoPathItems);
    case LinkTypeName:
      return determineNameLink(link, repoPathItems);
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
  const ret: Link = {
    internalPath: {
      repoPath: link.repoPath,
      path: link.name,
    },
    anchor: link.anchor,
    isExist: false,
  };
  const file =
    files.find(({ internalPath: { path } }) => path === link.name) || null;
  if (file == null) {
    return ret;
  }

  return Object.assign(ret, { isExist: true });
}

function determineNameLink(
  link: IncompletenessLink,
  files: FileBuffer[],
): Link {
  const internalPath = {
    repoPath: link.repoPath,
    path: '',
  };
  const ret = {
    internalPath,
    anchor: link.anchor,
    isExist: false,
  };

  const file =
    files.find((fileBuffer) => fileBufferName(fileBuffer) === link.name) ||
    null;
  if (file == null) {
    return {
      ...ret,
      internalPath: { ...internalPath, path: joinPath('/', link.name) },
      isExist: false,
    };
  }

  return {
    ...ret,
    internalPath: { ...internalPath, path: file.internalPath.path },
    isExist: true,
  };
}
