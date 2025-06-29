import { default as noMissingParserFinishNodeType } from './no-missing-parser-finish-node-type.mjs';
import { default as preferParseSourceOptions } from './prefer-parse-source-options.mjs';

const rules = { noMissingParserFinishNodeType, preferParseSourceOptions };

const PLUGIN_NAME = 'internal';

export default {
  plugins: { [PLUGIN_NAME]: { rules } },
  rules: Object.fromEntries(Object.keys(rules).map((ruleId) => [`${PLUGIN_NAME}/${ruleId}`, 'error'])),
};
