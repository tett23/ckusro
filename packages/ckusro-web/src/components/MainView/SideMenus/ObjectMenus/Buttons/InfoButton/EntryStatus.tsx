import React, { ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import { MergedPathManagerItem } from '../../../../../../models/FilesStatus';
import ShortOid from './ShortOid';
import useBufferInfoPopperStyles from './useBufferInfoPopperStyles';

type OwnProps = {
  entryStatus: MergedPathManagerItem;
};

type StyleProps = {
  classes: ReturnType<typeof useBufferInfoPopperStyles>;
};

export type EntryStatusProps = OwnProps & StyleProps;

export function EntryStatus({ entryStatus, classes }: EntryStatusProps) {
  switch (entryStatus.flag) {
    case 'nochanged':
      return <Container className={classes.entryStatus}>nochanged</Container>;
    case 'added':
      return (
        <Container className={classes.entryStatus}>
          added(
          <ShortOid oid={entryStatus.changedOid} />)
        </Container>
      );
    case 'changed':
      return (
        <Container className={classes.entryStatus}>
          changed (
          <ShortOid oid={entryStatus.originalOid} />
          &nbsp;-&gt;&nbsp;
          <ShortOid oid={entryStatus.changedOid} />)
        </Container>
      );
    default:
      return null;
  }
}

export default function (ownProps: OwnProps) {
  const props = buildEntryStatusProps(ownProps);

  return <EntryStatus {...props} />;
}

export function buildEntryStatusProps(ownProps: OwnProps): EntryStatusProps {
  const styleProps: StyleProps = {
    classes: useBufferInfoPopperStyles(),
  };

  return {
    ...ownProps,
    ...styleProps,
  };
}

type ContainerProps = {
  className: string;
  children: ReactNode;
};

function Container({ children, className }: ContainerProps) {
  return (
    <Typography color="textSecondary" variant="body2" className={className}>
      {children}
    </Typography>
  );
}
