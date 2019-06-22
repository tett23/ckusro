import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../../models/ObjectManager';
import { State } from '../../../../modules';
import FetchObjects from '../../../FetchObject';
import ObjectLinkView from '../../../shared/ObjectLinkView';
import useGitObjectListStyles from '../useGitObjectListStyles';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  blobObject: BlobObjectType;
};

type StyleProps = Pick<
  ReturnType<typeof useGitObjectListStyles>,
  'borderBottomClass'
>;

export type BlobObjectProps = OwnProps & StateProps & StyleProps;

export function BlobObject({
  oid,
  path,
  blobObject,
  borderBottomClass,
}: BlobObjectProps) {
  if (blobObject == null) {
    return null;
  }
  const content = new TextDecoder().decode(blobObject.content);
  const headline = content.slice(0, 200).replace(/(\r\n|\r|\n)/g, ' ');
  const primary = <Typography>{path}</Typography>;
  const secondary = (
    <Typography
      style={{ height: '3em', overflow: 'hidden' }}
      color="textSecondary"
      variant="body2"
    >
      {headline}
    </Typography>
  );

  return (
    <ListItem className={borderBottomClass}>
      <ObjectLinkView oid={oid}>
        <ListItemText primary={primary} secondary={secondary} />
      </ObjectLinkView>
    </ListItem>
  );
}

const Memoized = React.memo(BlobObject, (prev, next) => prev.oid === next.oid);

export default function(ownProps: OwnProps) {
  const styles = useGitObjectListStyles();
  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<BlobObjectType>(
      ownProps.oid,
    ),
  );

  if (gitObject == null) {
    return <FetchObjects oids={[ownProps.oid]} />;
  }

  return <Memoized {...ownProps} blobObject={gitObject} {...styles} />;
}
