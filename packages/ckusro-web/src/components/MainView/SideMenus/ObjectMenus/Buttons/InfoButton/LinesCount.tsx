import React from 'react';
import StatItem from './StatItem';

export type LinesCountProps = {
  originalText: string | null;
  changedText: string | null;
};

export default function LinesCount({
  originalText,
  changedText,
}: LinesCountProps) {
  if (originalText == null && changedText == null) {
    return null;
  }
  const originalLines =
    originalText == null
      ? null
      : originalText.replace(/\r\n?/g, '\n').split('\n').length;
  const changedLines =
    changedText == null
      ? null
      : changedText.replace(/\r\n?/g, '\n').split('\n').length;

  return <StatItem count={changedLines || originalLines || 0} label="lines" />;
}
