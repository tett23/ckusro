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
    list: {
      padding: 0,
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
    headerText: {
      width: '100%',
    },
    filename: {
      height: '2em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

export default useGitObjectListStyles;
