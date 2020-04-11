import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';
import { DomainState } from '../../../../modules/domain';

type RawUIDomainProps = {
  domain: DomainState;
};

export function RawUIDomain({ domain }: RawUIDomainProps) {
  return (
    <div>
      <h2>Domain state</h2>
      <pre>{JSON.stringify(convert(domain), null, 2)}</pre>
    </div>
  );
}

export default function () {
  const stateProps = useSelector(({ domain }: State) => ({
    domain,
  }));

  return <RawUIDomain {...stateProps} />;
}

function convert(obj: unknown[] | Record<string, unknown>): unknown {
  const conv = tryConvOrRaw(obj);
  if (conv == null || typeof conv !== 'object') {
    return conv;
  }

  if (Array.isArray(conv)) {
    return conv.map((item) => {
      if (isContainerLike(item)) {
        return convert(item);
      }

      return tryConvOrRaw(item);
    });
  }

  if (conv == null) {
    return conv;
  }

  return Object.entries(conv).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      if (isContainerLike(value)) {
        acc[key] = convert(value);
      } else {
        acc[key] = tryConvOrRaw(value);
      }
      return acc;
    },
    {},
  );
}

function isContainerLike(
  item: unknown,
): item is unknown[] | Record<string, unknown> {
  return Array.isArray(item) || item instanceof Object;
}

function tryConvOrRaw(item: unknown) {
  if (item instanceof Buffer || item instanceof Uint8Array) {
    return `[Blob:length=${item.length}]`;
  }

  return item;
}
