import WikiLink from '../../plugins/ckusro-plugin-component-WikiLink';
import wikiLink from '../../plugins/ckusro-plugin-parser-WikiLink';
import { DefaultPluginsConfig } from '../DefaultPluginConfig';
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

  if (config.components.enableWikiLink) {
    ret.components.push({
      name: WikiLink.name,
      plugin: WikiLink,
    });
  }

  return ret;
}
