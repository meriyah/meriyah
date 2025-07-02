#!/usr/bin/env node
import * as meriyah from '../dist/meriyah.mjs';
import runTest from './run-test262.mjs';

await runTest(meriyah);
