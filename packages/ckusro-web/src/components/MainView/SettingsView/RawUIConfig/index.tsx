import React from 'react';
import { CkusroConfig } from '@ckusro/ckusro-core';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';

type RawConfigProps = {
  config: CkusroConfig;
};

export function RawConfig({ config }: RawConfigProps) {
  return (
    <div>
      <h2>UI config</h2>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
}

export default function() {
  const stateProps = useSelector(({ config }: State) => ({
    config,
  }));

  return <RawConfig {...stateProps} />;
}
