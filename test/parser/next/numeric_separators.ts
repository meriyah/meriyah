import { describe } from 'vitest';
import { fail } from '../../test-utils';

describe('Next - Numeric separators', () => {
  fail('Next - Numeric separators (fail)', [
    { code: '0_', options: { next: true } },
    { code: '1_0_0_0_', options: { next: true } },
    { code: '09_0;', options: { next: true } },
    { code: '1e_1', options: { next: true } },
    { code: '1e+_1', options: { next: true } },
    { code: '1_e+1', options: { next: true } },
    { code: '1__0', options: { webcompat: true } },
    '0x_1',
    '0x1__1',
    '0x1_',
    '0_x1',
    { code: '0_x_1', options: { next: true } },
    { code: '0b_0101', options: { next: true } },
    { code: '0b11_', options: { next: true } },
    { code: '0o7__77', options: { next: true } },
    { code: '0o_777', options: { next: true } },
    { code: '0o777_', options: { next: true } },
    { code: '0_b_1', options: { next: true } },
    { code: '0_b1', options: { next: true } },
    { code: '0b1__1', options: { next: true } },
    { code: '0.0_2_1_', options: { next: true } },
    { code: '0.0__21', options: { next: true } },
    { code: '"use strict"; 00_122', options: { next: true } },
    { code: '"use strict"; 0_012', options: { next: true } },
    { code: '"use strict"; 07_7_7', options: { next: true } },
    { code: '"use strict"; 07_7_7_', options: { next: true } },
    { code: '"use strict"; 0__777', options: { next: true } },
    { code: '"use strict"; 0_7_7_7', options: { next: true } },
  ]);
});
