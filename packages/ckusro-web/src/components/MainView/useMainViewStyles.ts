import { makeStyles, createStyles } from '@material-ui/styles';

const useMainViewStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
    },
    contentWrapper: {
      flexGrow: 3,
      width: '100%',
      height: '100%',
    },
    mainViewContent: {
      height: '100%',
      overflow: 'scroll',
      padding: 0,
    },
    objectMenus: {
      flexGrow: 0,
      padding: '0 1rem',
      width: 'auto',
      margin: 'auto',
      height: '100%',
    },
  }),
);

export default useMainViewStyles;
