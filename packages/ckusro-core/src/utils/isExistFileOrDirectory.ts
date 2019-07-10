import * as FS from 'fs';

export default async function(fs: typeof FS, path: string): Promise<boolean> {
  return !(
    (await (async () => fs.promises.stat(path))().catch(
      (err: Error) => err,
    )) instanceof Error
  );
}
