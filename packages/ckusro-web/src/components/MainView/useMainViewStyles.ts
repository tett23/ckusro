import { makeStyles, createStyles } from '@material-ui/styles';

const useMainViewStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100vh',
    },
    contentWrapper: {
      width: 'calc(100% - 4rem)',
      height: '100%',
      overflowY: 'scroll',
    },
    mainViewContent: {
      padding: '2rem 0 2rem 2rem',
    },
    objectMenus: {
      padding: '0 1rem',
      width: 'auto',
      margin: 'auto',
      height: '100%',
    },
  }),
);

export default useMainViewStyles;
