import { WithRequestId } from './wrapAction/withRequestId';
import { WithConfig } from './wrapAction/withConfig';

export type WorkerRequest<Action extends FSAction> = Action &
  WithConfig<Action> &
  WithRequestId<Action>;
