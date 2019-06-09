import { GitObject } from '@ckusro/ckusro-core';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, State } from '../../modules';
import { fetchObject } from '../../modules/thunkActions';
import BlobObject from './GitObject/BlobObject';
import CommitObject from './GitObject/CommitObject';
import TagObject from './GitObject/TagObject';
import TreeObject from './GitObject/TreeObject';

type ObjectViewStates = {
  oid: string | null;
  object: GitObject | null;
};

export type ObjectViewProps = ObjectViewStates &
  ReturnType<typeof mapDispatchToProps>;

export function ObjectView({ oid, object, fetchObject }: ObjectViewProps) {
  useEffect(() => {
    if (oid == null) {
      return;
    }

    fetchObject(oid);
  }, [oid]);

  if (oid == null) {
    return <EmptyObjectView />;
  }
  if (object == null) {
    return <ObjectNotFound oid={oid} />;
  }

  return <GitObjectView object={object} />;
}

function EmptyObjectView() {
  return (
    <View>
      <Text>EmptyObjectView</Text>
    </View>
  );
}

type ObjectNotFoundProps = {
  oid: string;
};

function ObjectNotFound({ oid }: ObjectNotFoundProps) {
  return (
    <View>
      <Text>ObjectNotFound. oid={oid}</Text>
    </View>
  );
}

type GitObjectViewProps = {
  object: GitObject;
};

function GitObjectView({ object }: GitObjectViewProps) {
  switch (object.type) {
    case 'commit':
      return <CommitObject object={object} />;
    case 'tree':
      return <TreeObject object={object} />;
    case 'blob':
      return <BlobObject object={object} />;
    case 'tag':
      return <TagObject object={object} />;
  }
}

function mapStateToProps({
  domain: { objectManager },
  objectView: { currentOid },
}: State): ObjectViewStates {
  return {
    oid: currentOid,
    object: currentOid == null ? null : objectManager[currentOid],
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, undefined, Actions>,
) {
  return {
    fetchObject(oid: string) {
      dispatch(fetchObject(oid));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectView);
