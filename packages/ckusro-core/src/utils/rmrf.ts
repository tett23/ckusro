import FS from 'fs';
import rimraf from 'rimraf';
import { promisify, callbackify } from 'util';
import isExistFileOrDirectory from './isExistFileOrDirectory';

export default async function rmrf(
  fs: typeof FS,
  path: string,
): Promise<true | Error> {
  const isExist = await isExistFileOrDirectory(fs, path);
  if (!isExist) {
    return true;
  }

  const rmrfResult = await (async () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await promisify<any, any, any>(rimraf)(path, {
      ...fs,
      lstat: callbackify(fs.promises.stat) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    }))().catch((err: Error) => err);
  if (rmrfResult instanceof Error) {
    return rmrfResult;
  }

  return true;
}
