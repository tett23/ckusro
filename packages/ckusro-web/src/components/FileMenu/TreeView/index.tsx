import { RepoPath, url2RepoPath, RepositoryInfo } from '@ckusro/ckusro-core';
import { List, ListSubheader, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  createObjectManager,
  ObjectManager,
} from '../../../models/ObjectManager';
import { createRefManager, RefManager } from '../../../models/RefManager';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import RepositoryComponent from './Repository';

type TreeViewStates = {
  repositories: RepositoryInfo[];
  objectManager: ObjectManager;
  refManager: RefManager;
};

export type TreeViewProps = TreeViewStates;

export function TreeView({
  repositories,
  objectManager,
  refManager,
}: TreeViewProps) {
  const classes = useStyles();

  const repos = repositories.map((item) => {
    const oid = createRefManager(refManager).headOid(url2RepoPath(
      item.url,
    ) as RepoPath);
    const commitObject =
      oid == null
        ? null
        : createObjectManager(objectManager).fetch(oid, 'commit');

    return (
      <FetchObjects key={item.url} oids={oid == null ? [] : [oid]}>
        <RepositoryComponent repository={item} commitObject={commitObject} />
      </FetchObjects>
    );
  });

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      dense={true}
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Repositories
        </ListSubheader>
      }
      className={classes.root}
    >
      {repos}
    </List>
  );
}

export default function() {
  const state = useSelector(
    ({
      config: { repositories },
      domain: {
        repositories: { objectManager, refManager },
      },
    }: State) => {
      return { repositories, objectManager, refManager };
    },
  );

  return <TreeView {...state} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
);
