import { WithRequestId } from './withRequestId';
import { WithConfig } from './withConfig';
export type WorkerRequest<Action extends FSAction> = Action &
  WithConfig<Action> &
  WithRequestId<Action>;
