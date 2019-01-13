import merge from 'lodash.merge';

export type DefaultPluginsConfig = {
  parsers: {
    enableWikiLink: boolean;
  };
  components: {
    enableWikiLink: boolean;
  };
};

export function defaultPluginsConfig(
  overrides: DeepPartial<DefaultPluginsConfig> = {},
): DefaultPluginsConfig {
  const data = {
    parsers: {
      enableWikiLink: true,
    },
    components: {
      enableWikiLink: true,
    },
  };

  return merge(data, overrides);
}
