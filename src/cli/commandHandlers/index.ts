import { GlobalState } from '../../models/oldGlobalState';
import staticRenderer from '../../staticRenderer';

export async function buildHandler(globalState: GlobalState) {
  return await staticRenderer(globalState);
}
