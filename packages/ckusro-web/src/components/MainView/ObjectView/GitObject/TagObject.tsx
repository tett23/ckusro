import { TagObject as TagObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import ObjectLink from '../../../shared/ObjectLinkText';
import { Box, Typography } from '@material-ui/core';

export type TagObjectProps = {
  gitObject: TagObjectType;
};

export default function TagObject({ gitObject }: TagObjectProps) {
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
        <ObjectLink oid={gitObject.content.object}>
          {gitObject.content.object}
        </ObjectLink>
      </Typography>
      <Typography>message: {gitObject.content.message}</Typography>
    </Box>
  );
}
