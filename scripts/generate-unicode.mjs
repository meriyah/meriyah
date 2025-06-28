#!/usr/bin/env node
import fs from 'node:fs/promises';
import packageJson from '../package.json' with { type: 'json' };

const UnicodeCodeCount = 0x110000; /* codes */
const VectorSize = Uint32Array.BYTES_PER_ELEMENT * 8;
const VectorMask = VectorSize - 1;
const VectorBitCount = 32 - Math.clz32(VectorMask);
const VectorByteSize = UnicodeCodeCount / VectorSize;
const FILE = new URL('../src/unicode.ts', import.meta.url);

const UNICODE_PACKAGE_PREFIX = '@unicode/unicode-';
const unicodePackageName = Object.keys(packageJson.devDependencies).find((name) =>
  name.startsWith(UNICODE_PACKAGE_PREFIX),
);

const UNICODE_VERSION = unicodePackageName.slice(UNICODE_PACKAGE_PREFIX.length);

const loadUnicodeCodePoints = async (name) => {
  const { default: list } = await import(`${unicodePackageName}/${name}/code-points.js`);
  return list;
};

const DataInst = {
  Empty: 0x0,
  Many: 0x1,
  Link: 0x2,
};

function compressorCreate() {
  return {
    result: [],
    lookupLocs: Object.create(null),
    lookupIn: Object.create(null),
    lookup: [],
    count: 0,
    prev: 0,
    mask: DataInst.Empty,
    size: 0,
  };
}

function compressorSend(state, code) {
  state.size++;

  if (state.count === 0) {
    state.prev = code;
    state.count++;
    return;
  }

  if (state.prev === code) {
    state.mask |= DataInst.Many;
    state.count++;
    return;
  }

  if (state.prev === 0) {
    state.result.push(-state.count);
  } else {
    state.result.push(state.mask);

    if (state.mask & DataInst.Link) {
      state.result.push(state.lookupIn[state.prev]);
    } else {
      if (state.prev >= 10) state.lookupLocs[state.prev] = state.result.length;
      state.result.push(state.prev);
    }

    if (state.mask & DataInst.Many) state.result.push(state.count);
  }

  state.prev = code;
  state.mask = DataInst.Empty;
  state.count = 1;
  const loc = state.lookupLocs[code];

  if (loc == null) return;

  state.mask |= DataInst.Link;

  if (loc !== 0) {
    state.lookupLocs[code] = 0;
    state.result[loc - 1] |= DataInst.Link;
    state.result[loc] = state.lookup.length;
    state.lookupIn[code] = state.lookup.length;
    state.lookup.push(code);
  }
}

function compressorEnd(state) {
  if (state.prev === 0) {
    state.result.push(-state.count);
  } else {
    state.result.push(state.mask);

    if (state.mask & DataInst.Link) {
      state.result.push(state.lookupIn[state.prev]);
    } else {
      state.result.push(state.prev);
    }

    if (state.mask & DataInst.Many) state.result.push(state.count);
  }
}

const makeDecompress = (compressed) => `((compressed, lookup) => {
    const result = new Uint32Array(${compressed.size})
    let index = 0;
    let subIndex = 0
    while (index < ${compressed.result.length}) {
        const inst = compressed[index++]
        if (inst < 0) {
            subIndex -= inst
        } else {
            let code = compressed[index++]
            if (inst & ${DataInst.Link}) code = lookup[code]
            if (inst & ${DataInst.Many}) {
                result.fill(code, subIndex, subIndex += compressed[index++])
            } else {
                result[subIndex++] = code
            }
        }
    }
    return result
})(
    [${compressed.result}],
    [${compressed.lookup}]
)`;

async function generate(exports) {
  const specifiers = Object.entries(exports);
  const compress = compressorCreate();
  for (const [, unicodeNames] of specifiers) {
    const items = await Promise.all(unicodeNames.map((name) => loadUnicodeCodePoints(name)));
    const codes = new Uint32Array(VectorByteSize);
    for (const list of items) {
      for (const item of list) {
        codes[item >>> VectorBitCount] |= 1 << (item & VectorMask);
      }
    }

    for (const code of codes) {
      compressorSend(compress, code);
    }
  }

  compressorEnd(compress);

  await fs.writeFile(
    FILE,
    `
// Unicode v${UNICODE_VERSION} support

const unicodeLookup = ${makeDecompress(compress)};

${specifiers
  .map(
    ([specifier], index) =>
      `export const ${specifier} = (code: number) => (unicodeLookup[(code >>> ${VectorBitCount}) + ${index * VectorByteSize}] >>> code & ${VectorMask} & 1) !== 0;`,
  )
  .join('\n')}
`.trimStart(),
  );
}

await generate({
  isIDContinue: ['Binary_Property/ID_Continue'],
  isIDStart: ['Binary_Property/ID_Start'],
});
