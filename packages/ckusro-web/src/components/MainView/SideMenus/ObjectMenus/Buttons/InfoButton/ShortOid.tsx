import React from 'react';
import shortOid from '../../../../../../utils/shortOid';

export type ShortOidProps = {
  oid: string;
};

export default function ShortOid({ oid }: ShortOidProps) {
  return <>{shortOid(oid)}</>;
}
