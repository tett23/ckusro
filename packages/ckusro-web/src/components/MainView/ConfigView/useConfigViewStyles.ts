import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useConfigViewStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      width: '100%',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    formGroup: {
      margin: theme.spacing(1),
    },
    deleteButton: {
      margin: theme.spacing(1),
    },
  }),
);

export default useConfigViewStyles;
