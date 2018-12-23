import fs from 'fs';
import mkdirp from 'mkdirp';
import { dirname, join as joinPath } from 'path';
import { promisify } from 'util';

const asyncWriteFile = promisify(fs.writeFile);
const asyncMkdirP = promisify(mkdirp);

export default async function writeFile(
  outputDir: string,
  namespace: string,
  filePath: string,
  content: string | Buffer,
): Promise<boolean> {
  const path = determineAbsolutePath(outputDir, namespace, filePath);
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

export function determineAbsolutePath(
  outputDir: string,
  contextName: string,
  filePath: string,
): string {
  if (!outputDir.startsWith('/')) {
    throw new Error('outputDir must start with `/`');
  }
  if (!filePath.startsWith('/')) {
    throw new Error('filePath must start with `/`');
  }

  return joinPath(outputDir, contextName, filePath);
}
