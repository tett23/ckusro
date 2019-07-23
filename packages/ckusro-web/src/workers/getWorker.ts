import { WorkerInstances } from './index';

export default function getWorker<WorkerType extends keyof WorkerInstances>(
  workerInstances: WorkerInstances,
  workerType: WorkerType,
): WorkerInstances[WorkerType] {
  return workerInstances[workerType];
}
