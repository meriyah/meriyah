import { default as noMissingParserFinishNodeType } from './no-missing-parser-finish-node-type.mjs';

const rules = { noMissingParserFinishNodeType };

const PLUGIN_NAME = 'internal';

export default {
  plugins: { [PLUGIN_NAME]: { rules } },
  rules: Object.fromEntries(Object.keys(rules).map((ruleId) => [`${PLUGIN_NAME}/${ruleId}`, 'error'])),
};
