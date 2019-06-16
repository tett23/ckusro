export const ParseMarkdown = 'ParserWorker/ParseMarkdown' as const;

export function parseMarkdown(md: string) {
  return {
    type: ParseMarkdown,
    payload: {
      md,
    },
  };
}

export type ParserWorkerActions = ReturnType<typeof parseMarkdown>;
