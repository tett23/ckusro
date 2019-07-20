import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

const useDangerButtonsStyles = makeStyles((theme: Theme) =>
  createStyles({
    grayButton: {
      color: theme.palette.grey[500],
    },
  }),
);

export default useDangerButtonsStyles;
