import React from 'react';
import { BlobTreeEntry } from '@ckusro/ckusro-core';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import useFileMenuStyles from '../useFileMenuStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type OwnProps = {
  path: string;
  blobEntry: BlobTreeEntry;
};

type StateProps = {};

type StyleProps = {
  classes: ReturnType<typeof useFileMenuStyles>;
};

export type StageEntryProps = OwnProps & StateProps & StyleProps;

export function StageEntry({ path, classes }: StageEntryProps) {
  return (
    <ListItem>
      <ListItemIcon className={classes.fileTypeIcon}>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText primary={path} />
    </ListItem>
  );
}

const Memoized = React.memo(
  StageEntry,
  (prev, next) =>
    prev.path === next.path && prev.blobEntry.oid === next.blobEntry.oid,
);

export default function(props: OwnProps) {
  const styleProps = { classes: useFileMenuStyles() };

  return <Memoized {...props} {...styleProps} />;
}
