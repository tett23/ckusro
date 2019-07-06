import ckusroCore, { InternalPath, gitDir } from '@ckusro/ckusro-core';
import FS from 'fs';
import LightningFs from '@isomorphic-git/lightning-fs';
import { BlobBufferInfo } from './BufferInfo';
import * as Git from '@isomorphic-git';

export type EditorManager = {
  internalPath: InternalPath;
};

export function createEditorManager(
  coreId: string,
  internalPath: InternalPath,
) {
  return {
    write: (content: Buffer | string) => write(core, internalPath, content),
  };
}

export async function write(
  fs: typeof FS,
  manager: EditorManager,
  content: Buffer | string,
): Promise<BlobBufferInfo | Error> {
  const fs = await getFsInstance(coreId);
  if (fs instanceof Error) {
    return fs;
  }

  // write blob object
  // write tree object
  // write commit object
  // update ref
}

const StagePath = '/stage';

async function prepareRepository(fs: typeof FS, manager: EditorManager) {
  const statResult = await fs.promises
    .stat(StagePath)
    .catch((err: Error) => err);
  if (statResult instanceof Error) {
    const mkdirResult = await fs.promises
      .mkdir(StagePath)
      .catch((err: Error) => err);
    if (mkdirResult instanceof Error) {
      return mkdirResult;
    }

    const initResult = await Git.init({
      core: coreId,
      gitDir: StagePath,
      bare: true,
    }).catch((err) => err);
    if (initResult instanceof Error) {
      return initResult;
    }
  }

  // create parent tree
}

async function getFsInstance(coreId: string): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}
