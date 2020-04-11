import React from 'react';
import { Popper, Fade, Card } from '@material-ui/core';
import { BufferInfo } from '@ckusro/ckusro-core';
import BufferInfoPanel from './BufferInfoPanel';
import useBufferInfoPopperStyles from './useBufferInfoPopperStyles';

type OwnProps = {
  bufferInfo: BufferInfo;
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
};

type StyleProps = {
  classes: ReturnType<typeof useBufferInfoPopperStyles>;
};

type BufferInfoPopperProps = OwnProps & StyleProps;

export function BufferInfoPopper({
  bufferInfo,
  isOpen,
  anchorEl,
  classes,
}: BufferInfoPopperProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Popper open={isOpen} anchorEl={anchorEl} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Card className={classes.container}>
            <BufferInfoPanel bufferInfo={bufferInfo} />
          </Card>
        </Fade>
      )}
    </Popper>
  );
}

export default function (ownProps: OwnProps) {
  const props = buildBufferInfoPopperProps(ownProps);

  return <BufferInfoPopper {...props} />;
}

export function buildBufferInfoPopperProps(
  ownProps: OwnProps,
): BufferInfoPopperProps {
  const styleProps: StyleProps = {
    classes: useBufferInfoPopperStyles(),
  };

  return {
    ...ownProps,
    ...styleProps,
  };
}
