import ckusroCore from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import console = require('console');
import FS from 'fs';
import { State } from '../modules/index';

export type PersistedState = Pick<
  State,
  'config' | 'objectView' | 'gitObjectList'
> & {
  oids: string[];
};

const PersistedStatePath = '/state.json';

export async function readPersistedState(
  coreId: string,
): Promise<true | Error> {
  if (coreId == null || coreId === '') {
    return new Error('');
  }

  const fs = await getFsInstance(coreId);
  if (fs instanceof Error) {
    return fs;
  }

  console.log(
    await fs.promises.readdir('/repositories/github.com/tett23/ckusro'),
  );

  const stateJson = await fs.promises
    .readFile(PersistedStatePath, 'utf8')
    .catch((err: Error) => err);
  if (stateJson instanceof Error) {
    return stateJson;
  }
  const persistedState: PersistedState = JSON.parse(stateJson);
  const core = ckusroCore(persistedState.config, fs);

  const ps = persistedState.oids.map(core.repositories.fetchObject);

  console.log('len', persistedState.oids.length);
  console.time('fetch objects');
  await Promise.all(ps);
  console.timeEnd('fetch objects');

  return true;
}

export async function writePersistedState(
  state: PersistedState,
): Promise<true | Error> {
  const coreId = state.config.coreId;
  if (coreId == null || coreId === '') {
    return new Error('');
  }

  const fs = await getFsInstance(coreId);
  if (fs instanceof Error) {
    return fs;
  }

  const result = await fs.promises
    .writeFile(PersistedStatePath, JSON.stringify(state), 'utf8')
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  return true;
}

async function getFsInstance(coreId: string): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}

export function serializeState(state: State): PersistedState {
  const oids = Object.keys(state.domain.objectManager);

  return {
    config: state.config,
    oids,
    objectView: state.objectView,
    gitObjectList: state.gitObjectList,
  };
}
