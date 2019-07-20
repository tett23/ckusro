import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { red } from '@material-ui/core/colors';

const useDangerButtonsStyles = makeStyles((theme: Theme) =>
  createStyles({
    dangerButton: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700],
      },
    },
    grayButton: {
      color: theme.palette.grey[500],
    },
  }),
);

export default useDangerButtonsStyles;
