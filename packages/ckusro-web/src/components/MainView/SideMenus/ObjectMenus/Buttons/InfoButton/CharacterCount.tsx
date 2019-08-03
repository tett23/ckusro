import React from 'react';
import StatItem from './StatItem';

export type CharacterCountProps = {
  originalText: string | null;
  changedText: string | null;
};

export default function CharacterCount({
  originalText,
  changedText,
}: CharacterCountProps) {
  if (originalText == null && changedText == null) {
    return null;
  }
  const originalLength = originalText == null ? null : originalText.length;
  const changedLength = changedText == null ? null : changedText.length;

  return (
    <StatItem count={changedLength || originalLength || 0} label="characters" />
  );
}
