import { makeStyles, createStyles } from '@material-ui/styles';

const objectViewFabStyles = makeStyles(() =>
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

export default objectViewFabStyles;
