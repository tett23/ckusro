import { PromisifiedFS } from '../core/types';
import { LoaderContext } from './loaderContext';
import { FileModeFile, FileModes } from './StatType';

export type UnloadedFile = {
  loaderContext: LoaderContext;
  absolutePath: string;
  mode: FileModes;
};

export async function loadContent(
  readFile: PromisifiedFS['readFile'],
  unloadedFile: UnloadedFile,
): Promise<Buffer | string | null | Error> {
  if (unloadedFile.mode !== FileModeFile) {
    return null;
  }

  return readFile(unloadedFile.absolutePath).catch((err: Error) => err);
}
