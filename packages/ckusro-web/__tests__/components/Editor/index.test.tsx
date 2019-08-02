import Editor, { buildEditorProps } from '../../../src/components/Editor';
import {
  fixtureBuilder,
  buildBlobBufferInfo,
  buildState,
  buildPWorkers,
  buildGlobalBlobWriteInfo,
} from '../../__fixtures__';
import { createBlobObject } from '../../__helpers__/createBlobObject';
import { act } from '@testing-library/react-hooks';
import { createRepositoriesManager } from '../../../src/models/RepositoriesManager';
import {
  updateBlobBuffer,
  fetchObjects,
} from '../../../src/modules/workerActions/repository';
import renderHooksWithProvider from '../../__helpers__/renderHooksWithProvider';

describe(buildEditorProps, () => {
  const buildOwnProps = fixtureBuilder<PropType<typeof Editor>>({
    blobBufferInfo: buildBlobBufferInfo(),
  });

  it('returns null when the GitObject does not exists in manager', () => {
    const props = buildOwnProps();
    const pWorkers = buildPWorkers();
    const { result } = renderHooksWithProvider(buildEditorProps, props, {
      pWorkers,
    });

    expect(result.current).toBe(null);
    expect(pWorkers.dispatch).toBeCalledWith(
      'main',
      fetchObjects([props.blobBufferInfo.oid]),
    );
  });

  it('invokes dispatch function when onBlur called', () => {
    const blobObject = createBlobObject('test');
    const state = buildState();
    const props = buildOwnProps({
      blobBufferInfo: buildBlobBufferInfo({ oid: blobObject.oid }),
    });
    state.domain.repositories = createRepositoriesManager(
      state.domain.repositories,
    ).addObjects([blobObject]);
    const pWorkers = buildPWorkers();
    const { result } = renderHooksWithProvider(buildEditorProps, props, {
      state,
      pWorkers,
    });

    act(() => result.current.onBlur('updated2'));
    expect(result.current.content).toBe('updated2');

    expect(pWorkers.dispatch).toBeCalledWith(
      'main',
      updateBlobBuffer(
        buildGlobalBlobWriteInfo({
          type: 'blob',
          internalPath: props.blobBufferInfo.internalPath,
          content: Buffer.from('updated2'),
        }),
      ),
    );
  });

  it('updates content when onChange called', async () => {
    const blobObject = createBlobObject('test');
    const state = buildState();
    const props = buildOwnProps({
      blobBufferInfo: buildBlobBufferInfo({ oid: blobObject.oid }),
    });
    state.domain.repositories = createRepositoriesManager(
      state.domain.repositories,
    ).addObjects([blobObject]);
    const pWorkers = buildPWorkers();
    const { result } = renderHooksWithProvider(buildEditorProps, props, {
      state,
      pWorkers,
    });

    act(() => result.current.onChange('updated'));
    expect(result.current.content).toBe('updated');
  });
});
