import { Context } from '../../../src/common';
import { fail } from '../../test-utils';

describe('Next - Numeric separators', () => {
  fail('Next - Numeric separators (fail)', [
    ['0_', Context.OptionsNext],
    ['1_0_0_0_', Context.OptionsNext],
    ['09_0;', Context.OptionsNext],
    ['1e_1', Context.OptionsNext],
    ['1e+_1', Context.OptionsNext],
    ['1_e+1', Context.OptionsNext],
    ['1__0', Context.OptionsWebCompat],
    ['0x_1', Context.None],
    ['0x1__1', Context.None],
    ['0x1_', Context.None],
    ['0_x1', Context.None],
    ['0_x_1', Context.OptionsNext],
    [`0b_0101`, Context.OptionsNext],
    ['0b11_', Context.OptionsNext],
    ['0o7__77', Context.OptionsNext],
    ['0o_777', Context.OptionsNext],
    ['0o777_', Context.OptionsNext],
    ['0_b_1', Context.OptionsNext],
    ['0_b1', Context.OptionsNext],
    ['0b1__1', Context.OptionsNext],
    ['0.0_2_1_', Context.OptionsNext],
    ['0.0__21', Context.OptionsNext],
    ['"use strict"; 00_122', Context.OptionsNext],
    ['"use strict"; 0_012', Context.OptionsNext],
    ['"use strict"; 07_7_7', Context.OptionsNext],
    ['"use strict"; 07_7_7_', Context.OptionsNext],
    ['"use strict"; 0__777', Context.OptionsNext],
    ['"use strict"; 0_7_7_7', Context.OptionsNext]
  ]);
});
