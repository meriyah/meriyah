import { pass } from '../../test-utils';

pass('Parenthesized expressions', [{ code: '((a))', options: { preserveParens: true, loc: true } }]);
