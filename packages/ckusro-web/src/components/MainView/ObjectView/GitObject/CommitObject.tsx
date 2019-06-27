import { CommitObject as CommitObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import ObjectLink from '../../../shared/ObjectLinkText';
import { Box, Typography } from '@material-ui/core';

export type CommitObjectProps = {
  gitObject: CommitObjectType;
};

export default function CommitObject({ gitObject }: CommitObjectProps) {
  return (
    <Box>
      <Typography>oid: {gitObject.oid}</Typography>
      <Typography>type: {gitObject.type}</Typography>
      <Typography>
        {gitObject.content.author.name}
        {'<'}
        {gitObject.content.author.email}
        {'>'}
        {gitObject.content.author.timestamp}
      </Typography>
      <Typography>
        {gitObject.content.committer.name}
        {'<'}
        {gitObject.content.committer.email}
        {'>'}
        {gitObject.content.committer.timestamp}
      </Typography>
      <Typography>
        tree:
        <ObjectLink oid={gitObject.content.tree}>
          {gitObject.content.tree}
        </ObjectLink>
      </Typography>
      <Typography>
        parent:
        {gitObject.content.parent.map((oid) => (
          <ObjectLink key={oid} oid={oid}>
            {oid}
          </ObjectLink>
        ))}
      </Typography>
      <Typography>message: {gitObject.content.message}</Typography>
    </Box>
  );
}
