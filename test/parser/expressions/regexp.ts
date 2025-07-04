import { fail, pass } from '../../test-utils';

fail('RegExp', [String.raw`/\B*/u`]);

pass('RegExp', [{ code: String.raw`/\B*/u`, options: { validateRegex: false } }]);
