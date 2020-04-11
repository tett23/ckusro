import {
  BlobObject as BlobObjectType,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../../models/ObjectManager';
import { State } from '../../../../modules';
import FetchObjects from '../../../FetchObject';
import ObjectLinkView from '../../../shared/ObjectLinkView';
import useGitObjectListStyles from '../useGitObjectListStyles';
import { createBufferInfo } from '../../../../models/BufferInfo';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type StateProps = {
  blobObject: BlobObjectType;
};

type StyleProps = {
  classes: ReturnType<typeof useGitObjectListStyles>;
};

export type BlobObjectProps = OwnProps & StateProps & StyleProps;

export function BlobObject({
  oid,
  internalPath,
  blobObject,
  classes,
}: BlobObjectProps) {
  if (blobObject == null) {
    return null;
  }
  const content = new TextDecoder().decode(blobObject.content);
  const headline = content.slice(0, 200).replace(/(\r\n|\r|\n)/g, ' ');
  const primary = (
    <Typography noWrap variant="subtitle1" className={classes.filename}>
      {createInternalPath(internalPath).basename()}
    </Typography>
  );
  const secondary = (
    <Typography
      style={{ height: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}
      color="textSecondary"
      variant="body2"
    >
      {headline}
    </Typography>
  );

  return (
    <ListItem className={classes.borderBottomClass}>
      <ObjectLinkView bufferInfo={createBufferInfo('blob', oid, internalPath)}>
        <ListItemText primary={primary} secondary={secondary} />
      </ObjectLinkView>
    </ListItem>
  );
}

const Memoized = React.memo(BlobObject, (prev, next) => prev.oid === next.oid);

export default function (ownProps: OwnProps) {
  const styles = useGitObjectListStyles();
  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.repositories.objectManager).fetch(
      ownProps.oid,
      'blob',
    ),
  );

  if (gitObject == null) {
    return <FetchObjects oids={[ownProps.oid]} />;
  }

  return <Memoized {...ownProps} blobObject={gitObject} classes={styles} />;
}
