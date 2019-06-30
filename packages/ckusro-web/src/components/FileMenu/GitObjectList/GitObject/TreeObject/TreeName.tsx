import { ListSubheader, Typography } from '@material-ui/core';
import React from 'react';
import ObjectLinkView from '../../../../shared/ObjectLinkView';
import useGitObjectListStyles from '../../useGitObjectListStyles';
import { InternalPath, createInternalPath } from '@ckusro/ckusro-core';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type StyleProps = Pick<
  ReturnType<typeof useGitObjectListStyles>,
  'borderBottomClass'
>;

export type TreeNameProps = OwnProps & StyleProps;

export function TreeName({
  oid,
  internalPath,
  borderBottomClass,
}: TreeNameProps) {
  return (
    <ObjectLinkView internalPath={internalPath} oid={oid}>
      <ListSubheader className={borderBottomClass}>
        <Typography align="center" variant="body2">
          {createInternalPath(internalPath).basename()}
        </Typography>
      </ListSubheader>
    </ObjectLinkView>
  );
}

export default function(props: OwnProps) {
  const styles = useGitObjectListStyles();

  return <TreeName {...props} {...styles} />;
}
