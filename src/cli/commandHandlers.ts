import { GlobalState } from '../models/globalState';
import staticRenderer from '../staticRenderer';

export async function buildHandler(globalState: GlobalState) {
  return await staticRenderer(globalState);
}
