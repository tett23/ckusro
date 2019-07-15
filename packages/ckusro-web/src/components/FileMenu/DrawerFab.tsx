import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { faCog, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { updateMainViewType } from '../../modules/ui/mainView/mainViewMisc';

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

const actions = [
  { icon: faCog, name: 'Config' },
  { icon: faPlus, name: 'Add repository' },
];

type StateProps = {
  isOpen: boolean;
};

type DispatchProps = {
  onClickConfig: () => void;
  setIsOpen: (value: boolean) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useStyles>;
};

type DrawerFabProps = StateProps & DispatchProps & StyleProps;

export function DrawerFab({
  isOpen,
  onClickConfig,
  setIsOpen,
  classes,
}: DrawerFabProps) {
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleClick = (name: string | null) => {
    switch (name) {
      case 'Config':
        onClickConfig();
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
    </div>
  );
}

export default function() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const dispatchProps = {
    onClickConfig: () => dispatch(updateMainViewType('config')),
    setIsOpen: (value: boolean) => setIsOpen(value),
  };
  const classes = useStyles();

  return <DrawerFab isOpen={isOpen} {...dispatchProps} classes={classes} />;
}
