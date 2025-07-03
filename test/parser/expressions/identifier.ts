import { pass } from '../../test-utils';

pass('Identifier', [{ code: String.raw`a\u0065`, options: { loc: true, ranges: true } }]);
