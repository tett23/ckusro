import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useGitObjectListStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootClass: {
      width: '18rem',
      maxWidth: '18rem',
      height: '100vh',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
    },
    listSectionClass: {
      backgroundColor: 'inherit',
    },
    ulClass: {
      backgroundColor: 'inherit',
      padding: 0,
    },
    borderBottomClass: {
      borderBottom: '2px solid ' + theme.palette.divider,
    },
  }),
);

export default useGitObjectListStyles;
