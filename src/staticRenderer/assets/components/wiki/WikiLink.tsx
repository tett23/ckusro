import React from 'react';

export type Props = {
  linkTarget: string;
  text: string;
  className?: any;
};

export default function WikiLink({ className, text }: Props) {
  return <span className={className}>{text}</span>;
}
