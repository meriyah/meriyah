'use strict';

const UnicodeCodeCount = 0x110000; /* codes */
const VectorSize = Uint32Array.BYTES_PER_ELEMENT * 8;
const VectorMask = VectorSize - 1;
const VectorBitCount = 32 - Math.clz32(VectorMask);
const VectorByteSize = UnicodeCodeCount / VectorSize;

const DataInst = {
  Empty: 0x0,
  Many: 0x1,
  Link: 0x2
};

exports.DataInst = DataInst;
exports.compressorCreate = compressorCreate;

function compressorCreate() {
  return {
    result: [],
    lookupLocs: Object.create(null),
    lookupIn: Object.create(null),
    lookup: [],
    count: 0,
    prev: 0,
    mask: DataInst.Empty,
    size: 0
  };
}

exports.compressorSend = compressorSend;

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

exports.compressorEnd = compressorEnd;

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

exports.decompress = decompress;

function decompress(compressed) {
  return new Function(`return ${makeDecompress(compressed)}`)();
}

const makeDecompress = compressed => `((compressed, lookup) => {
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

exports.generate = generate;

async function generate(opts) {
  await opts.write(`// Unicode v. 12 support
// tslint:disable
`);

  const exportKeys = Object.keys(opts.exports);
  const compress = compressorCreate();

  for (const [index, exported] of exportKeys.entries()) {
    const codes = new Uint32Array(VectorByteSize);
    const items = opts.exports[exported];

    for (const list of items) {
      for (const item of list) {
        codes[item >>> VectorBitCount] |= 1 << (item & VectorMask);
      }
    }

    for (const code of codes) {
      compressorSend(compress, code);
    }

    await opts.write(`
function ${exported}(code${opts.eval ? '' : ':number'}) {
    return (unicodeLookup[(code >>> ${VectorBitCount}) + ${index * VectorByteSize}] >>> code & ${VectorMask} & 1) !== 0
}`);
  }

  compressorEnd(compress);

  await opts.write(`
export const unicodeLookup = ${makeDecompress(compress)}
${opts.eval ? 'return' : 'export'} {${Object.keys(opts.exports)}};
`);
}

if (require.main === module) {
  const path = require('path');
  const load = name => {
    const mod = require.resolve(`unicode-12.0.0/${name}/code-points`);
    const list = require(mod);
    delete require.cache[mod];
    return list;
  };

  const stream = require('fs').createWriteStream(path.resolve(__dirname, '../src/unicode.ts'));

  generate({
    write: str =>
      new Promise((resolve, reject) => {
        stream.write(str, err => (err != null ? reject(err) : resolve()));
      }),
    exports: {
      isIDContinue: [load('Binary_Property/ID_Continue')],
      isIDStart: [load('Binary_Property/ID_Start')],
      mustEscape: [load('General_Category/Other'), load('General_Category/Separator')]
    }
  }).catch(e =>
    process.nextTick(() => {
      throw e;
    })
  );
}
