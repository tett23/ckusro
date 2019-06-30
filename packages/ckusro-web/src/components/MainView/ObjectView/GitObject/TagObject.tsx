import { TagObject as TagObjectType, RepoPath } from '@ckusro/ckusro-core';
import React from 'react';
import ObjectLink from '../../../shared/ObjectLinkText';
import { Box, Typography } from '@material-ui/core';
import { createBufferInfo } from '../../../../models/BufferInfo';

export type TagObjectProps = {
  gitObject: TagObjectType;
  repoPath: RepoPath;
};

export default function TagObject({ gitObject, repoPath }: TagObjectProps) {
  return (
    <Box>
      <Typography>oid: {gitObject.oid}</Typography>
      <Typography>type: {gitObject.type}</Typography>
      <Typography>
        {gitObject.content.tagger.name}
        {'<'}
        {gitObject.content.tagger.email}
        {'>'}
        {gitObject.content.tagger.timestamp}
      </Typography>
      <Typography>tag: {gitObject.content.tag}</Typography>
      <Typography>
        object:
        <ObjectLink
          bufferInfo={createBufferInfo(
            'commit',
            gitObject.content.object,
            repoPath,
          )}
        >
          {gitObject.content.object}
        </ObjectLink>
      </Typography>
      <Typography>message: {gitObject.content.message}</Typography>
    </Box>
  );
}
