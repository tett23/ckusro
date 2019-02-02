import { separateErrors } from '../../core/utils/errors';
import { isErrors } from '../../core/utils/types';
import { FileBuffersState } from '../../models/FileBuffersState';
import { GlobalState } from '../../models/GlobalState';
import staticRenderer from '../../staticRenderer';

export async function buildHandler(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<void | Error[]> {
  const result = await staticRenderer(globalState, fileBuffersState);
  const [, errors] = separateErrors(result);
  if (isErrors(errors)) {
    return errors;
  }

  return;
}
