import { fail, pass } from '../../test-utils.ts';

fail('RegExp', [String.raw`/\B*/u`]);

pass('RegExp', [{ code: String.raw`/\B*/u`, options: { validateRegex: false } }]);
