import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useTreeViewStyles = makeStyles((theme: Theme) =>
  createStyles({
    listStyle: {
      paddingLeft: theme.spacing(2),
    },
    fileTypeIcon: {
      width: '2rem',
      minWidth: '2rem',
      maxWidth: '2rem',
    },
  }),
);

export default useTreeViewStyles;
