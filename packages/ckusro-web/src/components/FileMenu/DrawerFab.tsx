import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { Theme } from '@material-ui/core';
import { faCog, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { updateMainViewType } from '../../modules/ui/mainView/mainViewMisc';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exampleWrapper: {
      position: 'relative',
      height: 380,
    },
    speedDial: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(3),
    },
  }),
);

const actions = [
  { icon: faCog, name: 'Config' },
  { icon: faPlus, name: 'Add repository' },
];

type DispatchProps = Record<'onClickConfig', () => void>;

type DrawerFabProps = DispatchProps;

export function DrawerFab({ onClickConfig }: DrawerFabProps) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
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
    <div className={classes.exampleWrapper}>
      <SpeedDial
        ariaLabel="Repositories menu"
        className={classes.speedDial}
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
  const dispatch = useDispatch();
  const dispatchProps = {
    onClickConfig: () => dispatch(updateMainViewType('config')),
  };

  return <DrawerFab {...dispatchProps} />;
}
