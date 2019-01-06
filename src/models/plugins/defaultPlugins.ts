import { DefaultPluginsConfig } from '../../models/pluginConfig';
import wikiLink from '../../plugins/ckusro-plugin-parser-WikiLink';
import { Plugins } from './index';

export default function defaultPlugins(config: DefaultPluginsConfig): Plugins {
  const ret: Plugins = {
    parsers: [],
    components: [],
  };

  if (config.parsers.enableWikiLink) {
    ret.parsers.push({
      name: wikiLink.name,
      plugin: wikiLink,
    });
  }

  return ret;
}
