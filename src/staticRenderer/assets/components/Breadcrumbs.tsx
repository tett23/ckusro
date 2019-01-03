import { join as pathJoin, normalize, sep } from 'path';
import React from 'react';

export type Props = {
  namespace: string;
  path: string;
};

export default function Breadcrumbs({ namespace, path }: Props) {
  const items = pathItems(namespace, path).map(([text, itemPath]) => (
    <BreadcrumbItem key={itemPath} text={text} path={itemPath} />
  ));

  return (
    <nav>
      <ul>{items}</ul>
    </nav>
  );
}

export function pathItems(
  namespace: string,
  path: string,
): Array<[string, string]> {
  return splitItems(namespace, path)
    .reverse()
    .map(
      (item, i): [string, string] => {
        const itemPath = pathJoin(
          './',
          ...Array.from({ length: i }, () => '').fill('..'),
        );

        return [item, itemPath];
      },
    )
    .reverse();
}

function splitItems(namespace: string, path: string): string[] {
  const items = normalize(path)
    .split(sep)
    .filter((item) => item !== '');
  const ret = [namespace, items].flatMap((item) => item);

  return ret;
}

export type BreadcrumbItemProps = {
  text: string;
  path: string;
};

export function BreadcrumbItem({ text, path }: BreadcrumbItemProps) {
  return (
    <li>
      <a href={path}>{text}</a>
    </li>
  );
}
