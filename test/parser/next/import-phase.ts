import { fail, pass } from '../../test-utils.ts';

const nextModule = { sourceType: 'module', next: true } as const;

pass('Next - Import Phase', [
  { code: 'import defer * as ns from "m";', options: nextModule },
  { code: 'import source x from "m";', options: nextModule },
  { code: 'import.defer("m")', options: nextModule },
  { code: 'import.source("m")', options: nextModule },
  { code: 'import.defer("m").then(f)', options: nextModule },
  { code: 'import a from "m";', options: nextModule },
  { code: 'import * as ns from "m";', options: nextModule },
  { code: 'import {a} from "m";', options: nextModule },
  { code: 'import "m";', options: nextModule },
  { code: 'import("m")', options: nextModule },
]);

pass('Next - Import Phase with lexical tracking', [
  { code: 'import defer * as ns from "m";', options: { ...nextModule, lexical: true } },
  { code: 'import source x from "m";', options: { ...nextModule, lexical: true } },
]);

pass('Next - Import Phase without lexical tracking', [
  { code: 'import defer * as ns from "m";', options: { ...nextModule, lexical: false } },
  { code: 'import source x from "m";', options: { ...nextModule, lexical: false } },
]);

pass('Next - Import Phase contextual identifiers', [
  { code: 'import defer from "m";', options: nextModule },
  { code: 'import source from "m";', options: nextModule },
  { code: 'import defer from "m" with {};', options: nextModule },
  { code: 'import defer, {x} from "m";', options: nextModule },
  { code: 'import source, * as ns from "m";', options: nextModule },
  { code: 'import {defer} from "m";', options: nextModule },
  { code: 'import {source as s} from "m";', options: nextModule },
  { code: 'import * as defer from "m";', options: nextModule },
  { code: 'import source source from "m";', options: nextModule },
  { code: 'import source from from "m";', options: nextModule },
  { code: 'let defer = 1; let source = 2;', options: nextModule },
  { code: 'import.meta.url', options: nextModule },
]);

pass('Import Phase disabled', [
  { code: 'import a from "m";', options: { sourceType: 'module' } },
  { code: 'import("m")', options: { sourceType: 'module' } },
]);

fail('Next - Import Phase invalid forms', [
  { code: 'import defer x from "m";', options: nextModule },
  { code: 'import defer {a} from "m";', options: nextModule },
  { code: 'import source * as ns from "m";', options: nextModule },
  { code: 'import source {a} from "m";', options: nextModule },
  { code: 'import defer "m";', options: nextModule },
  { code: 'import source "m";', options: nextModule },
  { code: String.raw`import d\u0065fer * as ns from "m";`, options: nextModule },
  { code: 'new import.defer("m")', options: nextModule },
]);

fail('Import Phase syntax with next disabled', [
  { code: 'import defer * as ns from "m";', options: { sourceType: 'module', next: false } },
  { code: 'import source x from "m";', options: { sourceType: 'module', next: false } },
  { code: 'import.defer("m")', options: { sourceType: 'module', next: false } },
  { code: 'import.source("m")', options: { sourceType: 'module', next: false } },
]);
