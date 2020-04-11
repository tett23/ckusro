import React from 'react';
import { Typography } from '@material-ui/core';
import useBufferInfoPopperStyles from './useBufferInfoPopperStyles';

type OwnProps = {
  count: number;
  label: string;
};

type StyleProps = {
  classes: ReturnType<typeof useBufferInfoPopperStyles>;
};

type StatItemProps = OwnProps & StyleProps;

export function StatItem({ count, label, classes }: StatItemProps) {
  return (
    <div className={classes.textStatItem}>
      <Typography color="textSecondary" variant="h5">
        {count}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        {label}
      </Typography>
    </div>
  );
}

export default function (ownProps: OwnProps) {
  const props = buildStatItemProps(ownProps);

  return <StatItem {...props} />;
}

export function buildStatItemProps(ownProps: OwnProps): StatItemProps {
  const styleProps: StyleProps = {
    classes: useBufferInfoPopperStyles(),
  };

  return {
    ...ownProps,
    ...styleProps,
  };
}
