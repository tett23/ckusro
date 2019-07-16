import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useSideMenusStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    },
    menuWrapper: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '1rem 0',
    },
    iconWrapper: {
      padding: '1rem',
    },
    icon: {
      fontSize: '1.25rem',
      margin: 'auto',
      color: theme.palette.text.hint,
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  }),
);

export default useSideMenusStyles;
