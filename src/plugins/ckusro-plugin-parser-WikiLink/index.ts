type Node = any;

export interface Options {
  readonly visitor: (node: Node, env: string) => string;
  readonly className: string | null;
}

const defaultOptions: Options = {
  className: null,
  visitor,
};

const wikiLinkRegExp = /^\[\[(.+?)\]\]/;

export default function wikiLink(userOptions?: unknown) {
  // @ts-ignore
  const { Parser, Compiler } = this;
  const options: Options = { ...defaultOptions, ...userOptions } as any;

  Parser.prototype.inlineTokenizers.wikiLink = inlineTokenizer;
  Parser.prototype.inlineMethods.splice(
    Parser.prototype.inlineMethods.indexOf('autoLink'),
    0,
    'wikiLink',
  );
  inlineTokenizer.locator = locator;

  if (Compiler != null) {
    Compiler.prototype.visitors.wikiLink = options.visitor;
  }

  function inlineTokenizer(eat: any, value: string): any {
    const match = wikiLinkRegExp.exec(value);
    if (!match) {
      return null;
    }

    const [matchText, innerBracket] = match;
    const [linkTarget, alias] = innerBracket.split('|');

    return eat(matchText)({
      type: 'jsx',
      value: `<WikiLink linkTarget="${linkTarget}" className="${options.className ||
        ''}">${alias || linkTarget}</WikiLink>`,
      data: {
        component: 'WikiLink',
        props: {
          text: alias || linkTarget,
          internalLink: {
            target: linkTarget,
          },
        },
      },
    });
  }
}

export function locator(value: string, fromIndex: number): number {
  return value.indexOf('[[', fromIndex);
}

function visitor(node: Node): string {
  return `[[${node.data.props.internalLink.target}]]`;
}
