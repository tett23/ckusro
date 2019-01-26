import chokidar from 'chokidar';
import { join } from 'path';
import { loaderContextMap } from '../../models/loaderContext';
import {
  OldGlobalState,
  outputDirectory,
  reloadFiles,
} from '../../models/OldGlobalState';
import staticRenderer from '../../staticRenderer';

export default async function watchHandler(
  globalState: OldGlobalState,
): Promise<boolean> {
  const paths = absolutePaths(globalState);
  const promise = new Promise((_, reject) => {
    const watcher = chokidar.watch(paths, {
      ignoreInitial: true,
      disableGlobbing: true,
      depth: 0,
    });
    let isRunning = false;
    watcher
      .on('add', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }

        // TODO: build CkusroFile from absolute path
        watcher.add(path);
      })
      .on('change', () => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }
      })
      .on('unlink', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }
        watcher.unwatch(path);
      })
      .on('addDir', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }
        watcher.add(path);
      })
      .on('unlinkDir', (path) => {
        if (!isRunning) {
          isRunning = true;
          handleChange(globalState, reject).then(() => (isRunning = false));
        }
        watcher.unwatch(path);
      })
      .on('ready', () => {
        console.info('ready');
      })
      .on('error', (err) => {
        console.error(err);
        reject();
      });
  })
    .then(() => true)
    .catch(() => false);
  return await promise;
}

function handleChange(globalState: OldGlobalState, reject: any) {
  console.time('handleChange');
  return reload(globalState)
    .then((res) => {
      if (res instanceof Error) {
        reject();
      }
      console.timeEnd('handleChange');
    })
    .catch(() => reject());
}

async function reload(state: OldGlobalState) {
  const newState = await reloadFiles(state);
  if (newState instanceof Error) {
    return newState;
  }
  return await staticRenderer(newState);
}

function absolutePaths(globalState: OldGlobalState): string[] {
  const contextMap = loaderContextMap(globalState.loaderContexts);
  const paths = globalState.files.map(({ namespace, path }) => {
    const context = contextMap[namespace];
    return join(context.path, path);
  });

  const outputDir = outputDirectory(globalState);
  return paths.filter((item) => {
    return !item.startsWith(outputDir);
  });
}
