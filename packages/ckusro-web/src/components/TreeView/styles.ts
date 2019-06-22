import { makeStyles, Theme } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { Text as DefaultText, View as DefaultView } from '../shared/index';

export const styles = makeStyles((_: Theme) => ({
  treeViewItem: {
    // marginTop: '0.1rem',
    // marginRight: 0,
    // marginBottom: '0.1rem',
    // marginLeft: 0,
    margin: '0.1rem 0',
    height: '1.25em',
  },
}));

export const View = styled(DefaultView)(({ theme }: { theme: Theme }) => {
  return {
    color: theme.palette.text.primary,
  };
});

export const Text = styled(DefaultText)(({ theme }: { theme: Theme }) => {
  return {
    color: theme.palette.text.primary,
  };
});
