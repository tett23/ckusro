import merge from 'lodash.merge';

export type DefaultPluginsConfig = {
  parsers: {
    enableWikiLink: boolean;
  };
  components: {};
};

export function defaultPluginsConfig(
  overrides: DeepPartial<DefaultPluginsConfig> = {},
): DefaultPluginsConfig {
  const data = {
    parsers: {
      enableWikiLink: true,
    },
    components: {},
  };

  return merge(data, overrides);
}
