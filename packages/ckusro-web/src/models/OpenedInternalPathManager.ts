import { InternalPath, compareInternalPath } from '@ckusro/ckusro-core';

export type OpenedInternalPathManager = InternalPath[];

export function createOpenedInternalPathManager(
  manager: OpenedInternalPathManager,
) {
  return {
    update: (internalPath: InternalPath, value: boolean) =>
      update(manager, internalPath, value),
    open: (internalPath: InternalPath) => open(manager, internalPath),
    close: (internalPath: InternalPath) => close(manager, internalPath),
    isOpened: (internalPath: InternalPath) => isOpened(manager, internalPath),
  };
}

export function update(
  manager: OpenedInternalPathManager,
  internalPath: InternalPath,
  value: boolean,
): OpenedInternalPathManager {
  if (value) {
    return open(manager, internalPath);
  } else {
    return close(manager, internalPath);
  }
}

export function open(
  manager: OpenedInternalPathManager,
  internalPath: InternalPath,
): OpenedInternalPathManager {
  if (isOpened(manager, internalPath)) {
    return manager;
  }

  return [...manager, internalPath];
}

export function close(
  manager: OpenedInternalPathManager,
  internalPath: InternalPath,
): OpenedInternalPathManager {
  const idx = manager.findIndex((item) =>
    compareInternalPath(item, internalPath),
  );
  if (idx === -1) {
    return manager;
  }

  return [...manager.slice(0, idx), ...manager.slice(idx + 1)];
}

export function isOpened(
  manager: OpenedInternalPathManager,
  internalPath: InternalPath,
): boolean {
  return manager.some((item) => compareInternalPath(item, internalPath));
}
