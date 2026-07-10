import { pass } from '../../test-utils.ts';

pass('Parenthesized expressions', [{ code: '((a))', options: { preserveParens: true, loc: true } }]);
