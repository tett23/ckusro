import { RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import { faBars, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Repository } from '../../../../models/Repository';
import {
  cloneRepository,
  pullRepository,
} from '../../../../modules/thunkActions';
import ObjectLink from '../../../shared/ObjectLinkText';

type OwnProps = {
  repoPath: RepoPath;
  headOid: string | null;
  onClick: () => void;
};

type DispatchProps = {
  onClickClone: () => void;
  onClickPull: () => void;
};

export type RepositoryNameProps = OwnProps & DispatchProps;

function RepositoryName({
  repoPath,
  headOid,
  onClick,
  onClickClone,
  onClickPull,
}: RepositoryNameProps) {
  const popoverId = `repository-popover-${repoPath.name}`;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const isOpenMenu = Boolean(anchorEl);

  return (
    <>
      <ListItem dense={true} button onClick={onClick}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faDatabase} />
        </ListItemIcon>
        <ListItemText secondary={(headOid || 'None').slice(0, 7)}>
          <ObjectLink oid={headOid}>
            <Typography>{repoPath.name}</Typography>
          </ObjectLink>
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleClick}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Popover
        id={popoverId}
        open={isOpenMenu}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ListItem button onClick={onClickClone}>
          <Typography>Clone</Typography>
        </ListItem>
        <ListItem button onClick={onClickPull}>
          <Typography>Pull</Typography>
        </ListItem>
      </Popover>
    </>
  );
}

export default function(ownProps: {
  repository: Repository;
  headOid: string | null;
  onClick: () => void;
}) {
  const dispatch = useDispatch();
  const {
    repository: { url },
    headOid,
  } = ownProps;
  const repoPath = url2RepoPath(url) as RepoPath;

  return (
    <RepositoryName
      repoPath={repoPath}
      headOid={headOid}
      onClick={ownProps.onClick}
      onClickClone={() => dispatch(cloneRepository(url))}
      onClickPull={() => dispatch(pullRepository(repoPath))}
    />
  );
}
