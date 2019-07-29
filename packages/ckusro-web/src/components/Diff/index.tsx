import React from 'react';
import { diffLines, Change } from 'diff';

type OwnProps = {
  name: string;
  a: string;
  b: string;
};

export type DiffProps = OwnProps;

export function Diff({ name, a, b }: DiffProps) {
  const diff = diffLines(a, b, { newlineIsToken: true });

  return (
    <div>
      {name}
      <div>
        <Color diff={diff} />
      </div>
      ---
      <pre>
        <code>{a}</code>
      </pre>
      ---
      <pre>
        <code>{b}</code>
      </pre>
    </div>
  );
}

type ColorProps = {
  diff: Change[];
};

function Color({ diff }: ColorProps) {
  const items = diff.map((item, i) => {
    if (item.added) {
      return (
        <span key={`addition-${i}`} style={{ color: 'green' }}>
          {normalize(item.value, '+')}
        </span>
      );
    }
    if (item.removed) {
      return (
        <span key={`deletion-${i}`} style={{ color: 'red' }}>
          {normalize(item.value, '-')}
        </span>
      );
    }

    return (
      <span key={`nochange-${i}`} style={{ color: 'gray' }}>
        {normalize(item.value, '\u00A0')}
      </span>
    );
  });

  return (
    <>
      <pre>
        <code>{items}</code>
      </pre>
    </>
  );
}

function normalize(text: string, prefix: string): string {
  return text
    .replace(/ /g, '\u00A0')
    .replace(/\r?\n/g, '\n')
    .split('\n')
    .map((item) => `${prefix}${item}`)
    .join('\n');
}
