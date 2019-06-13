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
  gitObject: GitObject | null;
};

export type ObjectViewProps = ObjectViewStates &
  ReturnType<typeof mapDispatchToProps>;

export function ObjectView({ oid, gitObject, fetchObject }: ObjectViewProps) {
  useEffect(() => {
    if (oid == null) {
      return;
    }

    fetchObject(oid);
  }, [oid]);

  if (oid == null) {
    return <EmptyObjectView />;
  }
  if (gitObject == null) {
    return <ObjectNotFound oid={oid} />;
  }

  return <GitObjectView gitObject={gitObject} />;
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
  gitObject: GitObject;
};

function GitObjectView({ gitObject }: GitObjectViewProps) {
  switch (gitObject.type) {
    case 'commit':
      return <CommitObject gitObject={gitObject} />;
    case 'tree':
      return <TreeObject gitObject={gitObject} />;
    case 'blob':
      return <BlobObject gitObject={gitObject} />;
    case 'tag':
      return <TagObject gitObject={gitObject} />;
  }
}

function mapStateToProps({
  domain: { objectManager },
  objectView: { currentOid },
}: State): ObjectViewStates {
  return {
    oid: currentOid,
    gitObject: currentOid == null ? null : objectManager[currentOid],
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
