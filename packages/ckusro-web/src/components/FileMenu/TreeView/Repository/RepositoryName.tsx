import { RepoPath, RepositoryInfo } from '@ckusro/ckusro-core';
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
import {
  cloneRepository,
  pullRepository,
} from '../../../../modules/thunkActions';
import ObjectLink from '../../../shared/ObjectLinkText';
import { createBufferInfo } from '../../../../models/BufferInfo';
import { updateRepoPath } from '../../../../modules/ui/mainView/repositoryView';
import { updateMainViewType } from '../../../../modules/ui/mainView/mainViewMisc';

type OwnProps = {
  repository: RepositoryInfo;
  headOid: string | null;
  onClick?: () => void;
};

type StateProps = {
  repoPath: RepoPath;
  headOid: string | null;
};

type DispatchProps = {
  onClick: () => void;
  onClickClone: () => void;
  onClickPull: () => void;
};

export type RepositoryNameProps = StateProps & DispatchProps;

function RepositoryName({
  repoPath,
  headOid,
  onClick,
  onClickClone,
  onClickPull,
}: RepositoryNameProps) {
  const popoverId = `repository-popover-${repoPath.name}`;
  const [anchorEl, setAnchorEl] = React.useState(
    null as HTMLButtonElement | null,
  );

  const handleClick = (
    event: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
  ) => {
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
          <ObjectLink
            bufferInfo={createBufferInfo('commit', headOid || '', repoPath)}
          >
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

export default function (ownProps: OwnProps) {
  const dispatch = useDispatch();
  const {
    repository: { url, repoPath },
    headOid,
    onClick,
  } = ownProps;
  const dispatchProps: DispatchProps = {
    onClick: () => {
      dispatch(updateRepoPath({ url, repoPath }));
      dispatch(updateMainViewType('repository'));
      if (onClick != null) {
        onClick();
      }
    },
    onClickClone: () => dispatch(cloneRepository(url)),
    onClickPull: () => dispatch(pullRepository(repoPath)),
  };
  const stateProps: StateProps = {
    headOid,
    repoPath,
  };

  return <RepositoryName {...stateProps} {...dispatchProps} />;
}
