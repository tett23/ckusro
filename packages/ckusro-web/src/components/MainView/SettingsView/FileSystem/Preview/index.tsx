import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FS from 'fs';
import LightningFs from '@isomorphic-git/lightning-fs';
import { State } from '../../../../../modules';

export type PreviewProps = {
  content: string | null;
};

export function Preview({ content }: PreviewProps) {
  return <div>{content}</div>;
}

export default function() {
  const [content, setContent] = useState<string | null>(null);
  const state = useSelector((state: State) => ({
    coreId: state.config.coreId,
    preview: state.ui.mainView.settingsView.fileSystem.preview,
  }));
  useEffect(() => {
    (async () => {
      if (state.preview == null) {
        return;
      }

      const fs = await getFsInstance(state.coreId);
      if (fs instanceof Error) {
        return;
      }

      const a = await fs.promises.readFile(state.preview, 'utf8');
      setContent(a);
    })().catch((err) => err);
  }, [state.preview]);

  return <Preview content={content} />;
}

async function getFsInstance(coreId: string): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}
