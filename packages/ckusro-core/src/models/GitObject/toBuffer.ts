import {
  GitObject,
  TreeObject,
  BlobObject,
  TagObject,
  CommitObject,
} from './index';
import formatAuthor from './formatAuthor';

const NullTree = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

export function toBuffer<T extends GitObject>(gitObject: T): Buffer | Error {
  switch (gitObject.type) {
    case 'blob':
      return blobObjectToBuffer(gitObject as BlobObject);
    case 'commit':
      return commitObjectToBuffer(gitObject as CommitObject);
    case 'tag':
      return tagObjectToBuffer(gitObject as TagObject);
    case 'tree':
      return treeObjectToBuffer(gitObject as TreeObject);
    default:
      throw new Error();
  }
}

function blobObjectToBuffer(blobObject: BlobObject): Buffer {
  return blobObject.content;
}

function treeObjectToBuffer(treeObject: TreeObject): Buffer {
  return treeObject.content
    .map((entry) => {
      const mode = Buffer.from(entry.mode.replace(/^0/, ''));
      const space = Buffer.from(' ');
      const path = Buffer.from(entry.path, 'utf8');
      const nullchar = Buffer.from([0]);
      const oid = Buffer.from(entry.oid, 'hex');
      return Buffer.concat([mode, space, path, nullchar, oid]);
    })
    .reduce((acc, item) => Buffer.concat([acc, item]), Buffer.from(''));
}

function commitObjectToBuffer({
  content: { tree, parent, author, committer, gpgsig, message },
}: CommitObject): Buffer | Error {
  if (parent == null) {
    return new Error();
  }

  const bufText = [
    `tree ${tree == null ? NullTree : tree}`,
    ...parent.map((p) => `parent ${p}`),
    `author ${formatAuthor(author)}`,
    `comitter ${formatAuthor(author || committer)}`,
    gpgsig == null ? null : `pgpsig` + indent(gpgsig),
    ``,
    `${normalizeNewlines(message)}`,
  ]
    .filter((item) => item != null)
    .join('\n');

  return Buffer.from(bufText, 'utf8');
}

function tagObjectToBuffer({
  content: { object, type, tag, tagger, message, signature },
}: TagObject): Buffer | Error {
  const bufText = [
    `object ${object}`,
    `type ${type}`,
    `tag ${tag}`,
    `tagger ${formatAuthor(tagger)}`,
    ``,
    `${message}`,
    `${signature ? signature : ''}`,
  ].join('\n');

  return Buffer.from(bufText, 'utf8');
}

function indent(str: string): string {
  return (
    str
      .trim()
      .split('\n')
      .map((x) => ' ' + x)
      .join('\n') + '\n'
  );
}

// original code
// https://github.com/isomorphic-git/isomorphic-git/blob/00d9155c17f51667697200486e22dca09364c1d1/src/utils/normalizeNewlines.js#L1
export function normalizeNewlines(str: string): string {
  // remove all <CR>
  str = str.replace(/\r/g, '');
  // no extra newlines up front
  str = str.replace(/^\n+/, '');
  // and a single newline at the end
  str = str.replace(/\n+$/, '') + '\n';

  return str;
}
