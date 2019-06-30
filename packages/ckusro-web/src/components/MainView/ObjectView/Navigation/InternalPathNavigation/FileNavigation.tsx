import React from 'react';
import { Breadcrumbs, Link } from '@material-ui/core';
import { InternalPath } from '@ckusro/ckusro-core';
import { useDispatch } from 'react-redux';
import { updateCurrentInternalPath } from '../../../../../modules/ui/uiMisc';

type OwnProps = {
  internalPath: InternalPath;
};

type DispatchProps = {
  onClick: (internalPath: InternalPath) => void;
};

export type RepoPathNavigationProps = OwnProps & DispatchProps;

export function FileNavigation({
  internalPath,
  onClick,
}: RepoPathNavigationProps) {
  const paths = internalPath.path.split('/').map((item, i) => (
    <Link
      key={item}
      color="inherit"
      onClick={() =>
        onClick({
          ...internalPath,
          path: internalPath.path
            .split('/')
            .slice(0, i + 1)
            .join('/'),
        })
      }
    >
      {item}
    </Link>
  ));

  return (
    <Breadcrumbs separator="/" aria-label="Breadcrumb">
      {paths}
    </Breadcrumbs>
  );
}

export default function(props: OwnProps) {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: (internalPath: InternalPath) => {
      dispatch(updateCurrentInternalPath(internalPath));
    },
  };

  return <FileNavigation {...props} {...dispatchProps} />;
}
