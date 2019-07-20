import { createStyles, makeStyles } from '@material-ui/styles';

const useRepositoryStageStyles = makeStyles(() => {
  return createStyles({
    fileTypeIcon: {
      width: '2rem',
      minWidth: '2rem',
      maxWidth: '2rem',
    },
  });
});

export default useRepositoryStageStyles;
