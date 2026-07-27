import { describe } from 'vitest';
import { fail } from '../../test-utils.ts';

describe('Numeric separators', () => {
  fail('Numeric separators (fail)', [
    '0_',
    '1_0_0_0_',
    '09_0;',
    '1e_1',
    '1e+_1',
    '1_e+1',
    { code: '1__0', options: { webcompat: true } },
    '0x_1',
    '0x1__1',
    '0x1_',
    '0_x1',
    '0_x_1',
    '0b_0101',
    '0b11_',
    '0o7__77',
    '0o_777',
    '0o777_',
    '0_b_1',
    '0_b1',
    '0b1__1',
    '0.0_2_1_',
    '0.0__21',
    '"use strict"; 00_122',
    '"use strict"; 0_012',
    '"use strict"; 07_7_7',
    '"use strict"; 07_7_7_',
    '"use strict"; 0__777',
    '"use strict"; 0_7_7_7',
  ]);
});
