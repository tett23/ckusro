import React from 'react';
import { Typography } from '@material-ui/core';
import { InternalPath, createInternalPath } from '@ckusro/ckusro-core';
import ShortOid from './ShortOid';
import useBufferInfoPopperStyles from './useBufferInfoPopperStyles';

type OwnProps = {
  internalPath: InternalPath;
  oid: string;
};

type StyleProps = {
  classes: ReturnType<typeof useBufferInfoPopperStyles>;
};

export type FilenameAndShortOidProps = OwnProps & StyleProps;

export function FilenameAndShortOid({
  internalPath,
  oid,
  classes,
}: FilenameAndShortOidProps) {
  return (
    <>
      <Typography variant="h6" className={classes.filename}>
        {createInternalPath(internalPath).basename()}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        <ShortOid oid={oid} />
      </Typography>
    </>
  );
}

export default function(ownProps: OwnProps) {
  const props = buildFilenameAndShortOidProps(ownProps);

  return <FilenameAndShortOid {...props} />;
}

export function buildFilenameAndShortOidProps(
  ownProps: OwnProps,
): FilenameAndShortOidProps {
  const styleProps: StyleProps = {
    classes: useBufferInfoPopperStyles(),
  };

  return {
    ...ownProps,
    ...styleProps,
  };
}
