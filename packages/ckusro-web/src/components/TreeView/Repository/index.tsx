import React from 'react';
import { Text, View } from 'react-native';
import { Repository } from '../../../modules/domain';

export type RepositoryProps = {
  repository: Repository;
};

export default function Repository({ repository }: RepositoryProps) {
  return (
    <View>
      <Text>{repository.name}</Text>
    </View>
  );
}
