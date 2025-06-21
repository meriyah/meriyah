import { pass } from '../../test-utils';

pass('StringLiteral', [
  { code: String.raw`("\u2028");`, options: { loc: true, ranges: true } },
  { code: String.raw`("\u2029");`, options: { loc: true, ranges: true } },
]);
