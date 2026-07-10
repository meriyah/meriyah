import { pass } from '../../test-utils.ts';

pass('StringLiteral', [
  { code: '("\u2028");', options: { loc: true, ranges: true } },
  { code: '("\u2029");', options: { loc: true, ranges: true } },
  { code: '("\\\u2028");', options: { loc: true, ranges: true } },
  { code: '("\\\u2029");', options: { loc: true, ranges: true } },
]);
