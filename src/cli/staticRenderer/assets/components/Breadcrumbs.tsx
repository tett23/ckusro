import { join as pathJoin, normalize, sep } from 'path';
import React from 'react';
import styled from 'styled-components';

export type Props = {
  namespace: string;
  path: string;
};

const ItemTypeNamespace: 'namespace' = 'namespace';
const ItemTypeFile: 'file' = 'file';
type ItemType = typeof ItemTypeNamespace | typeof ItemTypeFile;

export default function Breadcrumbs({ namespace, path }: Props) {
  const items = pathItems(namespace, path).map(([text, itemPath]) => (
    <BreadcrumbItem
      key={itemPath}
      type={ItemTypeFile}
      text={text}
      path={itemPath}
    />
  ));

  const Ul = styled.ul`
    display: flex;
    flex-direction: row;
    list-style: none;
    padding: 0;
    margin: 0;
  `;
  return (
    <nav>
      <Ul>{items}</Ul>
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
  type: ItemType;
  text: string;
  path: string;
};

export function BreadcrumbItem({ type, text, path }: BreadcrumbItemProps) {
  const Li = styled.li`
    :after {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      ${type === 'namespace' && "content: ':';"}
      ${type === 'file' && "content: '/';"}
    }

    &:last-child {
      :after {
        content: '';
      }
    }
  `;

  return (
    <Li>
      <a href={path}>{text}</a>
    </Li>
  );
}
