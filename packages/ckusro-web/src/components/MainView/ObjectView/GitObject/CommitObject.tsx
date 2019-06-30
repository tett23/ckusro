import {
  CommitObject as CommitObjectType,
  RepoPath,
} from '@ckusro/ckusro-core';
import React from 'react';
import ObjectLink from '../../../shared/ObjectLinkText';
import { Box, Typography } from '@material-ui/core';
import { createBufferInfo } from '../../../../models/BufferInfo';

export type CommitObjectProps = {
  gitObject: CommitObjectType;
  repoPath: RepoPath;
};

export default function CommitObject({
  gitObject,
  repoPath,
}: CommitObjectProps) {
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
        <ObjectLink
          bufferInfo={createBufferInfo('tree', gitObject.content.tree, {
            repoPath,
            path: '/',
          })}
        >
          {gitObject.content.tree}
        </ObjectLink>
      </Typography>
      <Typography>
        parent:
        {gitObject.content.parent.map((oid) => (
          <ObjectLink
            key={oid}
            bufferInfo={createBufferInfo('commit', oid, repoPath)}
          >
            {oid}
          </ObjectLink>
        ))}
      </Typography>
      <Typography>message: {gitObject.content.message}</Typography>
    </Box>
  );
}
