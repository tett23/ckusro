import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

const objectViewFabStyles = makeStyles((theme: Theme) =>
  createStyles({
    exampleWrapper: {
      position: 'sticky',
      bottom: 0,
      height: '95%',
    },
    speedDial: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(3),
    },
  }),
);

export default objectViewFabStyles;
