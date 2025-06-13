import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

pass('Parenthesized expressions', [['((a))', Context.OptionsPreserveParens | Context.OptionsLoc]]);
