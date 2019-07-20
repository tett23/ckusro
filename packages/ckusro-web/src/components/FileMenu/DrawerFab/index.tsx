import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { faCog, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { updateMainViewType } from '../../../modules/ui/mainView/mainViewMisc';
import AddRepositoryDialog from '../../AddRepositoryDialog';

const useStyles = makeStyles(() =>
  createStyles({
    fabWrapper: {
      position: 'sticky',
      right: 0,
      bottom: 0,
    },
    fab: {
      position: 'absolute',
      right: '1rem',
      bottom: '2rem',
    },
  }),
);

type ButtonActions = 'Config' | 'AddRepo';

const actions = [
  { icon: faCog, name: 'Config' as const },
  { icon: faPlus, name: 'AddRepo' as const },
];

type StateProps = {
  isOpen: boolean;
  isAddRepositoryDialogOpen: boolean;
};

type DispatchProps = {
  onClickConfig: () => void;
  onClickAddRepo: () => void;
  setIsOpen: (value: boolean) => void;
  setIsAddRepositoryDialogOpen: (value: boolean) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useStyles>;
};

type DrawerFabProps = StateProps & DispatchProps & StyleProps;

export function DrawerFab({
  isOpen,
  isAddRepositoryDialogOpen,
  onClickConfig,
  onClickAddRepo,
  setIsOpen,
  setIsAddRepositoryDialogOpen,
  classes,
}: DrawerFabProps) {
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleClick = (name: ButtonActions | null) => {
    switch (name) {
      case 'Config':
        onClickConfig();
        break;
      case 'AddRepo':
        onClickAddRepo();
        break;
      default:
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={classes.fabWrapper}>
      <SpeedDial
        ariaLabel="Repositories menu"
        className={classes.fab}
        icon={<FontAwesomeIcon icon={faEllipsisH} />}
        onBlur={handleClose}
        onClick={() => handleClick(null)}
        onClose={handleClose}
        onFocus={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        open={isOpen}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={<FontAwesomeIcon icon={action.icon} />}
            tooltipTitle={action.name}
            onClick={() => handleClick(action.name)}
          />
        ))}
      </SpeedDial>
      <AddRepositoryDialog
        isOpen={isAddRepositoryDialogOpen}
        setIsOpen={setIsAddRepositoryDialogOpen}
      />
    </div>
  );
}

export default function() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddRepositoryDialogOpen, setIsAddRepositoryDialogOpen] = useState(
    false,
  );
  const dispatch = useDispatch();
  const dispatchProps: DispatchProps = {
    onClickConfig: () => dispatch(updateMainViewType('config')),
    onClickAddRepo: () => {
      setIsAddRepositoryDialogOpen(true);
    },
    setIsOpen: (value: boolean) => setIsOpen(value),
    setIsAddRepositoryDialogOpen: (value: boolean) =>
      setIsAddRepositoryDialogOpen(value),
  };
  const stateProps: StateProps = {
    isOpen,
    isAddRepositoryDialogOpen,
  };
  const styleProps: StyleProps = {
    classes: useStyles(),
  };

  return <DrawerFab {...stateProps} {...dispatchProps} {...styleProps} />;
}
