import { OldGlobalState } from '../../models/OldGlobalState';
import staticRenderer from '../../staticRenderer';

export async function buildHandler(globalState: OldGlobalState) {
  return await staticRenderer(globalState);
}
