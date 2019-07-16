import { makeStyles, createStyles } from '@material-ui/styles';

const useObjectViewStyles = makeStyles(() =>
  createStyles({
    navigation: {
      position: 'sticky',
      top: 0,
    },
    objectView: {
      height: '100%',
      margin: '2rem',
      overflow: 'scroll',
      wordBreak: 'break-all',
    },
  }),
);

export default useObjectViewStyles;
