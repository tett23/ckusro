import fs from 'fs';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import { promisify } from 'util';

const asyncWriteFile = promisify(fs.writeFile);
const asyncMkdirP = promisify(mkdirp);

export type WriteInfo = {
  path: string;
  content: string | Buffer;
};

export default async function writeFile({
  path,
  content,
}: WriteInfo): Promise<boolean> {
  const mkdirResult = await asyncMkdirP(dirname(path))
    .then(() => true)
    .catch(() => false);
  if (!mkdirResult) {
    return false;
  }

  return await asyncWriteFile(path, content)
    .then(() => true)
    .catch(() => false);
}
