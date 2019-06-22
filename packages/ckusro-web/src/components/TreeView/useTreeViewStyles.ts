import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useTreeViewStyles = makeStyles((theme: Theme) =>
  createStyles({
    listStyle: {
      paddingLeft: theme.spacing(2),
    },
  }),
);

export default useTreeViewStyles;
