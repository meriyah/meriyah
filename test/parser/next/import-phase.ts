import { Features } from '../../../src/features.ts';
import { fail, pass } from '../../test-utils.ts';

const enableImportDefer = { sourceType: 'module', features: Features.ImportDefer } as const;
const enableImportSource = { sourceType: 'module', features: Features.ImportSource } as const;
const enableBoth = { sourceType: 'module', features: Features.ImportDefer | Features.ImportSource } as const;
const disableBoth = { sourceType: 'module' } as const;

pass('Next - Import Phase', [
  { code: 'import defer * as ns from "m";', options: enableImportDefer },
  { code: 'import source x from "m";', options: enableImportSource },
  { code: 'import.defer("m")', options: enableImportDefer },
  { code: 'import.source("m")', options: enableImportSource },
  { code: 'import.defer("m").then(f)', options: enableImportDefer },
  { code: 'import a from "m";', options: enableBoth },
  { code: 'import * as ns from "m";', options: enableBoth },
  { code: 'import {a} from "m";', options: enableBoth },
  { code: 'import "m";', options: enableBoth },
  { code: 'import("m")', options: enableBoth },
]);

pass('Next - Import Phase with lexical tracking', [
  { code: 'import defer * as ns from "m";', options: { ...enableImportDefer, lexical: true } },
  { code: 'import source x from "m";', options: { ...enableImportSource, lexical: true } },
]);

pass('Next - Import Phase without lexical tracking', [
  { code: 'import defer * as ns from "m";', options: { ...enableImportDefer, lexical: false } },
  { code: 'import source x from "m";', options: { ...enableImportSource, lexical: false } },
]);

pass('Next - Import Phase contextual identifiers', [
  { code: 'import defer from "m";', options: enableImportDefer },
  { code: 'import source from "m";', options: enableImportSource },
  { code: 'import defer from "m" with {};', options: enableImportDefer },
  { code: 'import defer, {x} from "m";', options: enableImportDefer },
  { code: 'import source, * as ns from "m";', options: enableImportSource },
  { code: 'import {defer} from "m";', options: enableImportDefer },
  { code: 'import {source as s} from "m";', options: enableImportSource },
  { code: 'import * as defer from "m";', options: enableImportDefer },
  { code: 'import source source from "m";', options: enableImportSource },
  { code: 'import source from from "m";', options: enableImportSource },
  { code: 'let defer = 1; let source = 2;', options: enableBoth },
  { code: 'import.meta.url', options: enableBoth },
]);

pass('Import Phase disabled', [
  { code: 'import a from "m";', options: { sourceType: 'module' } },
  { code: 'import("m")', options: { sourceType: 'module' } },
]);

pass('Import Phase contextual identifiers with next disabled', [
  { code: 'import defer from "m";', options: disableBoth },
  { code: 'import source from "m";', options: disableBoth },
  { code: 'import defer from "m" with {};', options: disableBoth },
  { code: 'import defer, {x} from "m";', options: disableBoth },
  { code: 'import source, * as ns from "m";', options: disableBoth },
  { code: 'import {defer} from "m";', options: disableBoth },
  { code: 'import {source as s} from "m";', options: disableBoth },
  { code: 'import * as defer from "m";', options: disableBoth },
  { code: 'let defer = 1; let source = 2;', options: disableBoth },
  { code: 'import.meta.url', options: disableBoth },
]);

fail('Next - Import Phase invalid forms', [
  { code: 'import defer x from "m";', options: enableImportDefer },
  { code: 'import defer {a} from "m";', options: enableImportDefer },
  { code: 'import source * as ns from "m";', options: enableImportSource },
  { code: 'import source {a} from "m";', options: enableImportSource },
  { code: 'import defer "m";', options: enableImportDefer },
  { code: 'import source "m";', options: enableImportSource },
  { code: String.raw`import d\u0065fer * as ns from "m";`, options: enableImportDefer },
  { code: 'new import.defer("m")', options: enableImportDefer },
]);

fail('Import Phase syntax with next disabled', [
  { code: 'import defer * as ns from "m";', options: disableBoth },
  { code: 'import source x from "m";', options: disableBoth },
  { code: 'import source source from "m";', options: disableBoth },
  { code: 'import source from from "m";', options: disableBoth },
  { code: 'import.defer("m")', options: disableBoth },
  { code: 'import.source("m")', options: disableBoth },
]);

fail('Enable one should not enables another one', [
  { code: 'import defer * as ns from "m";', options: enableImportSource },
  { code: 'import source x from "m";', options: enableImportDefer },
  { code: 'import.defer("m")', options: enableImportSource },
  { code: 'import.source("m")', options: enableImportDefer },
]);
