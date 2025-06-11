import { default as noLegacyTestPass } from './no-legacy-test-pass.mjs';

const pluginName = 'internal';

const rules = { noLegacyTestPass };

const plugin = {
  meta: {
    name: pluginName,
    version: '1.0.0',
  },
  rules,
};

const config = {
  plugins: { [pluginName]: plugin },
  rules: Object.fromEntries(Object.keys(rules).map((id) => [`${pluginName}/${id}`, 'error'])),
};

export default config;
