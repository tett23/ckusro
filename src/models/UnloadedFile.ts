import { PromisifiedFS } from '../core/types';
import { Namespace } from './Namespace';
import { FileModeFile, FileModes } from './StatType';

export type UnloadedFile = {
  namespace: Namespace;
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
