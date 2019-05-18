import { writeFile } from 'fs';
import { promisify } from 'util';
import { separateErrors } from '../../core/utils/errors';
import { isErrors } from '../../core/utils/types';
import { FileBuffersState } from '../../models/FileBuffersState';
import { GlobalState } from '../../models/GlobalState';
import staticRenderer from '../renderers/staticRenderer';

export async function buildHandler(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<void | Error[]> {
  const result = await staticRenderer(globalState, fileBuffersState);
  console.log(result);
  const [writeInfos, errors] = separateErrors(result);
  if (isErrors(errors)) {
    return errors;
  }

  const writeFileAsync = promisify(writeFile);
  console.log(writeInfos);
  const ps = writeInfos.map(({ path, content }) => {
    return writeFileAsync(path, content);
  });
  console.log(ps);
  await Promise.all(ps);

  return;
}
