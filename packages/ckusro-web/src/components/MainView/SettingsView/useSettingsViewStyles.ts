import { makeStyles, createStyles } from '@material-ui/styles';

const useSettingsViewStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      padding: '2rem',
      display: 'flex',
      flexFlow: 'column wrap',
    },
    tabs: {
      width: '40rem',
    },
  }),
);

export default useSettingsViewStyles;
//
