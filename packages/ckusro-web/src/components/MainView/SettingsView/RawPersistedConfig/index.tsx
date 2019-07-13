import React, { useEffect, useState } from 'react';
import FS from 'fs';
import LightningFs from '@isomorphic-git/lightning-fs';
import {
  PersistedState,
  PersistedStatePath,
} from '../../../../models/PersistedState';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';

type RawConfigProps = {
  persisted: PersistedState | null;
};

export function RawPersistedConfig({ persisted }: RawConfigProps) {
  if (persisted == null) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      <h2>persisted config</h2>
      <pre>{JSON.stringify(persisted, null, 2)}</pre>
    </div>
  );
}

export default function() {
  const { config } = useSelector(({ config }: State) => ({
    config,
  }));
  const [persisted, setPersisted] = useState<PersistedState | null>(null);
  const stateProps: RawConfigProps = {
    persisted,
  };

  useEffect(() => {
    (async () => {
      const fs = await getFsInstance(config.coreId);
      if (fs instanceof Error) {
        return;
      }

      const readResult = await (async () =>
        fs.promises.readFile(PersistedStatePath, 'utf8'))().catch((err) => err);
      if (readResult instanceof Error) {
        return;
      }

      setPersisted(JSON.parse(readResult));
    })();
  }, []);

  return <RawPersistedConfig {...stateProps} />;
}

async function getFsInstance(coreId: string): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}
