/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { resolve } from 'path';
import { mirrorPluginStatus } from '../../server/lib/mirror_plugin_status';
import { replaceInjectedVars } from './server/lib/replace_injected_vars';
import { setupXPackMain } from './server/lib/setup_xpack_main';
import { xpackInfoRoute, settingsRoute } from './server/routes/api/v1';

export { callClusterFactory } from './server/lib/call_cluster_factory';

export const xpackMain = (kibana) => {
  return new kibana.Plugin({
    id: 'xpack_main',
    configPrefix: 'xpack.xpack_main',
    publicDir: resolve(__dirname, 'public'),
    require: ['elasticsearch'],

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    uiCapabilities(server) {
      const featuresPlugin = server.newPlatform.setup.plugins.features;
      if (!featuresPlugin) {
        throw new Error('New Platform XPack Features plugin is not available.');
      }
      return featuresPlugin.getFeaturesUICapabilities();
    },

    uiExports: {
      replaceInjectedVars,
      injectDefaultVars(server) {
        const config = server.config();

        return {
          activeSpace: null,
          spacesEnabled: config.get('xpack.spaces.enabled'),
        };
      },
    },

    init(server) {
      const featuresPlugin = server.newPlatform.setup.plugins.features;
      if (!featuresPlugin) {
        throw new Error('New Platform XPack Features plugin is not available.');
      }

      mirrorPluginStatus(server.plugins.elasticsearch, this, 'yellow', 'red');

      setupXPackMain(server);

      // register routes
      xpackInfoRoute(server);
      settingsRoute(server, this.kbnServer);
    },
  });
};
