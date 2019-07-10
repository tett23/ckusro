import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rehypeReact from 'rehype-react';
import unified from 'unified';
import { State } from '../../../../modules';
import { parseMarkdown } from '../../../../modules/thunkActions';
import { HastRoot } from '../../../Markdown/Hast';
import rehypeRemoveBlankTextNode from '../../../Markdown/rehype-remove-blank-text-node';
import { Box } from '@material-ui/core';
import { BlobBufferInfo } from '../../../../models/BufferInfo';
import Editor from '../../../Editor';

type OwnProps = {
  gitObject: BlobObjectType;
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  ast: HastRoot;
};

export type BlobObjectProps = OwnProps & StateProps;

export function BlobObject({ ast, blobBufferInfo }: BlobObjectProps) {
  const [content, setContent] = useState(null as ReactNode);
  useEffect(() => {
    const processor = unified()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .use(rehypeRemoveBlankTextNode as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .use(rehypeReact as any, {
        createElement: React.createElement,
      });

    (async () => {
      const transformed = await processor.run(ast);
      const md = processor.stringify(transformed);

      setContent(md);
    })();
  }, [ast]);

  return (
    <Box>
      {content}
      <Editor blobBufferInfo={blobBufferInfo} />
    </Box>
  );
}

const Memoized = React.memo(BlobObject, (prev, next) => prev.ast === next.ast);

export default function(props: OwnProps) {
  const { ast } = useSelector((state: State) => {
    return {
      ast: state.ui.mainView.objectView.currentAst,
    };
  });
  const dispatch = useDispatch();

  const {
    gitObject: { oid, content: buffer },
  } = props;
  const content = new TextDecoder().decode(buffer);

  useEffect(() => {
    dispatch(parseMarkdown(content));
  }, [oid]);

  if (ast == null) {
    return <Box />;
  }

  return <Memoized {...props} ast={ast} />;
}
