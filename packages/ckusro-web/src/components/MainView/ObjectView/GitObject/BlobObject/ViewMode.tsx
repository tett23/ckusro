import React, { ReactNode, useEffect, useState } from 'react';
import rehypeReact from 'rehype-react';
import unified from 'unified';
import { HastRoot } from '../../../../Markdown/Hast';
import rehypeRemoveBlankTextNode from '../../../../Markdown/rehype-remove-blank-text-node';
import { Box } from '@material-ui/core';

type ViewModeProps = {
  ast: HastRoot;
};

export function ViewMode({ ast }: ViewModeProps) {
  const [content, setContent] = useState<ReactNode>(null);
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

  return <Box>{content}</Box>;
}
