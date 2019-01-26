import { GlobalState } from '../../models/OldGlobalState';
import staticRenderer from '../../staticRenderer';

export async function buildHandler(globalState: GlobalState) {
  return await staticRenderer(globalState);
}
