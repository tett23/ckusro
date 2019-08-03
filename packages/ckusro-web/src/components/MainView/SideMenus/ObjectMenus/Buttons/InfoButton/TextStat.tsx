import React from 'react';
import useBufferInfoPopperStyles from './useBufferInfoPopperStyles';
import { MergedPathManagerItem } from '../../../../../../models/FilesStatus';
import { useSelector } from 'react-redux';
import { State } from '../../../../../../modules';
import { createObjectManager } from '../../../../../../models/ObjectManager';
import LinesCount from './LinesCount';
import CharacterCount from './CharacterCount';

type OwnProps = {
  entryStatus: MergedPathManagerItem;
};

type StateProps = {
  originalContent: Buffer | null;
  changedContent: Buffer | null;
};

type StyleProps = {
  classes: ReturnType<typeof useBufferInfoPopperStyles>;
};

export type TextStatProps = StateProps & StyleProps;

export function TextStat({
  originalContent,
  changedContent,
  classes,
}: TextStatProps) {
  if (originalContent == null && changedContent == null) {
    return null;
  }

  const decoder = new TextDecoder();
  const originalText =
    originalContent == null ? null : decoder.decode(originalContent);
  const changedText =
    changedContent == null ? null : decoder.decode(changedContent);

  return (
    <div className={classes.textStat}>
      <CharacterCount originalText={originalText} changedText={changedText} />
      <LinesCount originalText={originalText} changedText={changedText} />
    </div>
  );
}

export default function(ownProps: OwnProps) {
  const props = buildTextStatProps(ownProps);

  return <TextStat {...props} />;
}

export function buildTextStatProps({ entryStatus }: OwnProps): TextStatProps {
  const { objectManager } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.repositories.objectManager),
  }));
  const styleProps: StyleProps = {
    classes: useBufferInfoPopperStyles(),
  };

  const originalObject =
    entryStatus.originalOid == null
      ? null
      : objectManager.fetch(entryStatus.originalOid, 'blob');
  const changedObject =
    entryStatus.changedOid == null
      ? null
      : objectManager.fetch(entryStatus.changedOid, 'blob');

  const stateProps: StateProps = {
    originalContent: originalObject == null ? null : originalObject.content,
    changedContent: changedObject == null ? null : changedObject.content,
  };

  return {
    ...stateProps,
    ...styleProps,
  };
}
