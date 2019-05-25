import { Dispatch } from 'react';
import { addRepository } from './domain';
import { Actions } from './index';

export function cloneRepository(url: string) {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch(
      addRepository({
        type: 'git',
        name: 'ckusro-web',
        url: 'git+https://github.com/tett23/ckusro.git',
        directory: '/packages/ckusro-web',
      }),
    );
  };
}
