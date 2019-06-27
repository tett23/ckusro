import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useFileSystemTreeViewStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      paddingLeft: theme.spacing(2),
    },
  }),
);

export default useFileSystemTreeViewStyles;
