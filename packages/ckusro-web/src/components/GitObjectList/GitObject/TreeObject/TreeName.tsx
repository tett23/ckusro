import { ListSubheader, Typography } from '@material-ui/core';
import React from 'react';
import ObjectLinkView from '../../../shared/ObjectLinkView';
import useGitObjectListStyles from '../../useGitObjectListStyles';

type OwnProps = {
  oid: string;
  name: string;
};

type StyleProps = Pick<
  ReturnType<typeof useGitObjectListStyles>,
  'borderBottomClass'
>;

export type TreeNameProps = OwnProps & StyleProps;

export function TreeName({ oid, name, borderBottomClass }: TreeNameProps) {
  return (
    <ObjectLinkView oid={oid}>
      <ListSubheader className={borderBottomClass}>
        <Typography align="center" variant="body2">
          {name}
        </Typography>
      </ListSubheader>
    </ObjectLinkView>
  );
}

export default function(props: OwnProps) {
  const styles = useGitObjectListStyles();

  return <TreeName {...props} {...styles} />;
}
