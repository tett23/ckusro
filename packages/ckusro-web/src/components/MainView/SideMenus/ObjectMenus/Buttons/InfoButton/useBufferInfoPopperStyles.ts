import { makeStyles, createStyles } from '@material-ui/styles';

const useBufferInfoPopperStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '12rem',
    },
    filename: {
      fontSize: '1rem',
      wordBreak: 'break-all',
    },
    entryStatus: {
      wordBreak: 'break-all',
    },
    divider: {
      margin: '.5rem',
    },
    textStat: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textStatItem: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: 1,
    },
  }),
);

export default useBufferInfoPopperStyles;
