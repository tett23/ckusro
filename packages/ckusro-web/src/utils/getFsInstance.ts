import LightningFs from '@isomorphic-git/lightning-fs';
import FS from 'fs';

export default function getFsInstance(coreId: string): typeof FS {
  const fs = new LightningFs(coreId);

  return fs;
}
