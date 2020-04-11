import React from 'react';
import { Breadcrumbs, Link } from '@material-ui/core';
import { InternalPath } from '@ckusro/ckusro-core';
import { useDispatch } from 'react-redux';
import { updateByInternalPath } from '../../../../../modules/thunkActions';

type OwnProps = {
  internalPath: InternalPath;
};

type DispatchProps = {
  onClick: () => void;
};

export type RepoPathNavigationProps = OwnProps & DispatchProps;

export function RepoPathNavigation({
  internalPath,
  onClick,
}: RepoPathNavigationProps) {
  return (
    <Breadcrumbs separator=":" aria-label="Breadcrumb">
      <Link color="inherit">{internalPath.repoPath.domain}</Link>
      <Link color="inherit">{internalPath.repoPath.user}</Link>
      <Link color="inherit" onClick={onClick}>
        {internalPath.repoPath.name}
      </Link>
    </Breadcrumbs>
  );
}

export default function (props: OwnProps) {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => {
      dispatch(updateByInternalPath({ ...props.internalPath, path: '/' }));
    },
  };

  return <RepoPathNavigation {...props} {...dispatchProps} />;
}
