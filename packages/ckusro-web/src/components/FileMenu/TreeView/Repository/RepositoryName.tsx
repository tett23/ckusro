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

export default function(ownProps: {
  repository: RepositoryInfo;
  headOid: string | null;
  onClick: () => void;
}) {
  const dispatch = useDispatch();
  const {
    repository: { url },
    headOid,
  } = ownProps;
  const {
    repository: { repoPath },
  } = ownProps;

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
