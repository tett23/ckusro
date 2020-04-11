import * as FS from 'fs';
import splitPath from './splitPath';
import isExistFileOrDirectory from './isExistFileOrDirectory';

export default async function (
  fs: typeof FS,
  path: string,
): Promise<true | Error> {
  return splitPath(path).reduce(async (acc: Promise<true | Error>, item) => {
    const prevResult = await acc;
    if (prevResult instanceof Error) {
      return prevResult;
    }

    if (await isExistFileOrDirectory(fs, item)) {
      return true;
    }

    const mkdirResult = await (async () => fs.promises.mkdir(path))().catch(
      (err: Error) => err,
    );
    if (mkdirResult instanceof Error) {
      return mkdirResult;
    }

    return true;
  }, Promise.resolve(true as const));
}
