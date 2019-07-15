import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

const useEditorStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      marginTop: theme.spacing(2),
      width: '100%',
      height: '100%',
    },
  }),
);

export default useEditorStyles;
