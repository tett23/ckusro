import React from 'react';
import { SpeedDial } from '@material-ui/lab';
import { faEdit, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../modules';
import {
  updateViewMode,
  ViewModes,
} from '../../../modules/ui/mainView/objectView';
import useObjectViewFabStyles from './useObjectViewFabStyles';

type StateProps = {
  viewMode: ViewModes;
};

type DispatchProps = {
  onClickViewMode: (mode: ViewModes) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useObjectViewFabStyles>;
};

type ObjectViewFabProps = StateProps & DispatchProps & StyleProps;

export function ObjectViewFab({
  viewMode,
  onClickViewMode,
  classes,
}: ObjectViewFabProps) {
  const onClick = () => {
    const next: ViewModes = viewMode === 'View' ? 'Edit' : 'View';

    onClickViewMode(next);
  };
  const icon = viewMode === 'View' ? faEdit : faFile;

  return (
    <div className={classes.fabWrapper}>
      <SpeedDial
        ariaLabel="ObjectView menu"
        className={classes.fab}
        icon={<FontAwesomeIcon icon={icon} />}
        onClick={onClick}
        open={false}
      >
        {[]}
      </SpeedDial>
    </div>
  );
}

export default function() {
  const stateProps: StateProps = useSelector((state: State) => ({
    viewMode: state.ui.mainView.objectView.viewMode,
  }));
  const dispatch = useDispatch();
  const dispatchProps: DispatchProps = {
    onClickViewMode: (mode: ViewModes) => dispatch(updateViewMode(mode)),
  };
  const styleProps: StyleProps = {
    classes: useObjectViewFabStyles(),
  };

  return <ObjectViewFab {...stateProps} {...dispatchProps} {...styleProps} />;
}
