import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useObjectMenusStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
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

export default useObjectMenusStyles;
