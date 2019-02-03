import chokidar from 'chokidar';
import { join } from 'path';
import { isErrors } from '../../core/utils/types';
import { FileBuffer } from '../../models/FileBuffer';
import { FileBuffersState } from '../../models/FileBuffersState';
import {
  GlobalState,
  outputDirectory,
  reloadFiles,
} from '../../models/GlobalState';
import { namespaceMap } from '../../models/Namespace';
import staticRenderer from '../staticRenderer';

export default async function watchHandler(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<void | Error[]> {
  const paths = absolutePaths(globalState, fileBuffersState.fileBuffers);
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
    .then(() => {
      return;
    })
    .catch((err: Error | Error[]): Error[] => [err].flat());
  return await promise;
}

function handleChange(globalState: GlobalState, reject: any) {
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

async function reload(state: GlobalState) {
  const newFileBuffersState = await reloadFiles(state);
  if (isErrors(newFileBuffersState)) {
    return newFileBuffersState;
  }

  return await staticRenderer(state, newFileBuffersState);
}

function absolutePaths(
  globalState: GlobalState,
  fileBuffers: FileBuffer[],
): string[] {
  const nsm = namespaceMap(globalState.namespaces);
  const paths = fileBuffers.map(({ namespace, path }) => {
    const ns = nsm[namespace];
    return join(ns.loaderContext.path, path);
  });

  const outputDir = outputDirectory(globalState);
  return paths.filter((item) => {
    return !item.startsWith(outputDir);
  });
}
