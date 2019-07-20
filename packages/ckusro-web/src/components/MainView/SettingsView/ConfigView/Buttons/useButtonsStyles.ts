import { makeStyles, createStyles } from '@material-ui/core';

const useButtonsStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  }),
);

export default useButtonsStyles;
