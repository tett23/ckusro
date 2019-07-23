import withConfig from './withConfig';
import withRequestId from './withRequestId';
import { State } from '../../modules';
import { WorkerRequest } from '../WorkerRequest';

export default function wrapMessage<T extends FSAction>(
  state: State,
  action: T,
): WorkerRequest<T> {
  return withConfig(withRequestId(action), state);
}
