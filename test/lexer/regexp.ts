import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

const vFlagSupported = (() => {
  try {
    return new RegExp('', 'v').flags === 'v';
  } catch {
    return false;
  }
})();

describe('Lexer - Regular expressions', () => {
  const tokens: [Context, string, string, string][] = [
    // None unicode regular expression
    [Context.AllowRegExp, '/a|b/', 'a|b', ''],
    [Context.AllowRegExp, '/a|b/', 'a|b', ''],
    [Context.AllowRegExp, '/a|b/', 'a|b', ''],
    [Context.AllowRegExp, '/abc$/', 'abc$', ''],
    [Context.AllowRegExp, '/a*?/', 'a*?', ''],
    [Context.AllowRegExp, '/$/', '$', ''],
    [Context.AllowRegExp, '/(a)\\1/', '(a)\\1', ''],
    [Context.AllowRegExp, '/[abc-]/', '[abc-]', ''],
    [Context.AllowRegExp, '/a*?/', 'a*?', ''],
    [Context.AllowRegExp, '/a*?/', 'a*?', ''],
    [Context.AllowRegExp, '/[a-z]+/', '[a-z]+', ''],
    [Context.AllowRegExp, '/[0-9]+/', '[0-9]+', ''],
    [Context.AllowRegExp, '/ +/', ' +', ''],
    [Context.AllowRegExp, '/[0-9]+.[0-9]+/', '[0-9]+.[0-9]+', ''],
    [
      Context.AllowRegExp,
      '/^-?(?:[0-9]|[1-9][0-9]+)(?:.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/',
      '^-?(?:[0-9]|[1-9][0-9]+)(?:.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b',
      ''
    ],
    [Context.AllowRegExp, '/^{/', '^{', ''],
    [Context.AllowRegExp, '/^}/', '^}', ''],
    [Context.AllowRegExp, '/^true\b/', '^true\b', ''],
    [Context.AllowRegExp, '/^null\b/', '^null\b', ''],
    [Context.AllowRegExp, '/a*?/g', 'a*?', 'g'],
    [Context.AllowRegExp, '/a?/', 'a?', ''],
    [Context.AllowRegExp, '/a+/', 'a+', ''],
    [Context.AllowRegExp, '/a+b/', 'a+b', ''],
    [Context.AllowRegExp, '/a??/', 'a??', ''],
    [Context.AllowRegExp, '/a{0}/', 'a{0}', ''],
    [Context.AllowRegExp, '/a{5}/', 'a{5}', ''],
    [Context.AllowRegExp, '/a{12}/', 'a{12}', ''],
    [Context.AllowRegExp, '/a{2,}/', 'a{2,}', ''],
    [Context.AllowRegExp, '/a{56}/', 'a{56}', ''],
    [Context.AllowRegExp, '/a{7,7}/', 'a{7,7}', ''],
    [Context.AllowRegExp, '/a{9,94}/', 'a{9,94}', ''],
    [Context.AllowRegExp, '/a{6,61}/', 'a{6,61}', ''],
    [Context.AllowRegExp, '/a{3,38}/', 'a{3,38}', ''],
    [Context.AllowRegExp, '/a{23,37}/', 'a{23,37}', ''],
    [Context.AllowRegExp, '/a{56,60}/', 'a{56,60}', ''],
    [Context.AllowRegExp, '/a{,2}/', 'a{,2}', ''],
    [Context.AllowRegExp, '/a{,61}/', 'a{,61}', ''],
    [Context.AllowRegExp, '/foo/gy', 'foo', 'gy'],
    [Context.AllowRegExp, '/foo/igy', 'foo', 'igy'],
    [Context.AllowRegExp, '/foo/d', 'foo', 'd'],
    [Context.AllowRegExp, '/foo/musd', 'foo', 'musd'],
    [Context.AllowRegExp, '/\\D/', '\\D', ''],
    [Context.AllowRegExp, '/\\r/', '\\r', ''],
    [Context.AllowRegExp, '/\\s/', '\\s', ''],
    [Context.AllowRegExp, '/\\v/', '\\v', ''],
    [Context.AllowRegExp, '/\\S/', '\\S', ''],
    [Context.AllowRegExp, '/\\W/', '\\W', ''],
    [Context.AllowRegExp, '/\\w/', '\\w', ''],
    [Context.AllowRegExp, '/\\t/', '\\t', ''],
    [Context.AllowRegExp, '/\\n/', '\\n', ''],
    [Context.AllowRegExp, '/\\f/', '\\f', ''],
    [Context.AllowRegExp, '/\\d/', '\\d', ''],
    [Context.AllowRegExp, '/abc\\D/', 'abc\\D', ''],
    [Context.AllowRegExp, '/abc\\n/', 'abc\\n', ''],
    [Context.AllowRegExp, '/abc\\S/', 'abc\\S', ''],
    [Context.AllowRegExp, '/\\fabcd/', '\\fabcd', ''],
    [Context.AllowRegExp, '/\\Dabcd/', '\\Dabcd', ''],
    [Context.AllowRegExp, '/\\Sabcd/', '\\Sabcd', ''],
    [Context.AllowRegExp, '/\\wabcd/', '\\wabcd', ''],
    [Context.AllowRegExp, '/\\Wabcd/', '\\Wabcd', ''],
    [Context.AllowRegExp, '/abc\\sdeff/', 'abc\\sdeff', ''],
    [Context.AllowRegExp, '/abc\\ddeff/', 'abc\\ddeff', ''],
    [Context.AllowRegExp, '/abc\\Wdeff/', 'abc\\Wdeff', ''],
    [Context.AllowRegExp, '/\\$abcd/', '\\$abcd', ''],
    [Context.AllowRegExp, '/abc\\$abcd/', 'abc\\$abcd', ''],
    [Context.AllowRegExp, '/\\./', '\\.', ''],
    [Context.AllowRegExp, '/\\*/', '\\*', ''],
    [Context.AllowRegExp, '/\\+/', '\\+', ''],
    [Context.AllowRegExp, '/\\?/', '\\?', ''],
    [Context.AllowRegExp, '/\\(/', '\\(', ''],
    [Context.AllowRegExp, '/\\[/', '\\[', ''],
    [Context.AllowRegExp, '/\\)/', '\\)', ''],
    [Context.AllowRegExp, '/\\|/', '\\|', ''],
    [Context.AllowRegExp, '/\\}/', '\\}', ''],
    [Context.AllowRegExp, '/abc\\\\/', 'abc\\\\', ''],
    [Context.AllowRegExp, '/abc\\(/', 'abc\\(', ''],
    [Context.AllowRegExp, '/\\.def/', '\\.def', ''],
    [Context.AllowRegExp, '/\\`/', '\\`', ''],
    [Context.AllowRegExp, '/a|(|)/', 'a|(|)', ''],
    [Context.AllowRegExp, '/\\cv/', '\\cv', ''],
    [Context.AllowRegExp, '/\\cj/', '\\cj', ''],
    [
      Context.AllowRegExp,
      '/(((((((((((((((((((((a)))))))))))))))))))))\\20/',
      '(((((((((((((((((((((a)))))))))))))))))))))\\20',
      ''
    ],
    [Context.AllowRegExp, '/x\\ud810\\ud810/', 'x\\ud810\\ud810', ''],
    [Context.AllowRegExp, '/x\\udabcy/', 'x\\udabcy', ''],
    [Context.AllowRegExp, '/\\udd00\\udd00y/', '\\udd00\\udd00y', ''],
    [Context.AllowRegExp, '/\\ud900\\udd00\\ud900y/', '\\ud900\\udd00\\ud900y', ''],
    [Context.AllowRegExp, '/[\\ufdd0-\\ufdef]/', '[\\ufdd0-\\ufdef]', ''],
    [Context.AllowRegExp, '/[\\u{FDD0}-\\u{FDEF}]/u', '[\\u{FDD0}-\\u{FDEF}]', 'u'],
    [Context.AllowRegExp, '/[i]/', '[i]', ''],
    [Context.AllowRegExp, '/[j]/', '[j]', ''],
    [Context.AllowRegExp, '/[s]/', '[s]', ''],
    [Context.AllowRegExp, '/[x]/', '[x]', ''],
    [Context.AllowRegExp, '/[Q]/', '[Q]', ''],
    [Context.AllowRegExp, '/[-]/', '[-]', ''],
    [Context.AllowRegExp, '/[^-J]/g', '[^-J]', 'g'],
    [Context.AllowRegExp, '/[abc\\D]/', '[abc\\D]', ''],
    [Context.AllowRegExp, '/[\\dabcd]/', '[\\dabcd]', ''],
    [Context.AllowRegExp | Context.OptionsRaw, '/[\\$]/', '[\\$]', ''],
    [Context.AllowRegExp, '/[abc\\$]/', '[abc\\$]', ''],
    [Context.AllowRegExp, '/[\\?def]/', '[\\?def]', ''],
    [Context.AllowRegExp, '/[\\cT]/', '[\\cT]', ''],
    [Context.AllowRegExp, '/[\\xc3]/', '[\\xc3]', ''],
    [Context.AllowRegExp, '/[\\ud800\\ud800\\udc00]/', '[\\ud800\\ud800\\udc00]', ''],
    [Context.AllowRegExp, '/[x\\da-z]/', '[x\\da-z]', ''],
    [Context.AllowRegExp, '/[x\\SA-S]/', '[x\\SA-S]', ''],
    [Context.AllowRegExp, '/[A-Z\\D]/', '[A-Z\\D]', ''],
    [Context.AllowRegExp, '/[\\u5000-\\u6000]/', '[\\u5000-\\u6000]', ''],
    [Context.AllowRegExp, '/[--0]/', '[--0]', ''],
    [Context.AllowRegExp, '/a(?:a(?:b)c)c/', 'a(?:a(?:b)c)c', ''],
    [Context.AllowRegExp, '/(?=(?=b)c)c/', '(?=(?=b)c)c', ''],
    [Context.AllowRegExp, '/(?=a(?=b)c)/', '(?=a(?=b)c)', ''],
    [Context.AllowRegExp, '/a(?=a(?=b)c)/', 'a(?=a(?=b)c)', ''],
    [Context.AllowRegExp, '/a(?=a(?=b)c)/', 'a(?=a(?=b)c)', ''],
    [Context.AllowRegExp, '/a(?!a(?!b)c)c/', 'a(?!a(?!b)c)c', ''],
    [Context.AllowRegExp, '/a(?!b(?!c)d)e/', 'a(?!b(?!c)d)e', ''],
    [Context.AllowRegExp, '/[^a-z]{4}/', '[^a-z]{4}', ''],
    [Context.AllowRegExp, '/1?1/mig', '1?1', 'mig'],
    [Context.AllowRegExp, '/.*/sm', '.*', 'sm'],
    [Context.AllowRegExp, '/.*/ms', '.*', 'ms'],
    [Context.AllowRegExp, '/.*/sy', '.*', 'sy'],
    [Context.AllowRegExp, '/.*/ys', '.*', 'ys'],
    [Context.AllowRegExp, '/.*/s', '.*', 's'],
    [Context.AllowRegExp, '/.*/m', '.*', 'm'],
    [Context.AllowRegExp, '/.*/y', '.*', 'y'],
    [Context.AllowRegExp, '/\\%([0-9]*)\\[(\\^)?(\\]?[^\\]]*)\\]/', '\\%([0-9]*)\\[(\\^)?(\\]?[^\\]]*)\\]', '']
  ];

  for (const [ctx, op, value, flags] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const state = create(op, '', undefined);
      const found = scanSingleToken(state, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: state.index < state.source.length,
          value: (state.tokenRegExp as any).pattern,
          flags: (state.tokenRegExp as any).flags
        },
        {
          token: Token.RegularExpression,
          hasNext: false,
          value,
          flags
        }
      );
    });
  }

  if (vFlagSupported) {
    const vTokens: [Context, string, string, string][] = [
      [Context.AllowRegExp, '/[\\u{FDD0}-\\u{FDEF}]/v', '[\\u{FDD0}-\\u{FDEF}]', 'v'],
      [
        Context.AllowRegExp,
        '/[\\p{Script_Extensions=Greek}&&\\p{Letter}]/v',
        '[\\p{Script_Extensions=Greek}&&\\p{Letter}]',
        'v'
      ]
    ];

    for (const [ctx, op, value, flags] of vTokens) {
      it(`scans '${op}' at the end`, () => {
        const state = create(op, '', undefined);
        const found = scanSingleToken(state, ctx, 0);

        t.deepEqual(
          {
            token: found,
            hasNext: state.index < state.source.length,
            value: (state.tokenRegExp as any).pattern,
            flags: (state.tokenRegExp as any).flags
          },
          {
            token: Token.RegularExpression,
            hasNext: false,
            value,
            flags
          }
        );
      });
    }
  }

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const state = create(source, '', undefined);
      t.throws(() => scanSingleToken(state, context, 0));
    });
  }
  fail('fails on "/\\\n/"', '/\\\n/', Context.AllowRegExp);
  fail('fails on /', '/ ', Context.AllowRegExp);
  fail('fails on /\n$/\n', '/\n$/\n', Context.AllowRegExp);
  fail('fails on /\r$/\n', '/\r$/\n', Context.AllowRegExp);
  fail('fails on /\u2028$/\n', '/\u2028$/\n', Context.AllowRegExp);
  fail('fails on /\u2029$/\n', '/\u2029$/\n', Context.AllowRegExp);
  fail('fails on /\u2028$/\n', '/\u2028$/\n', Context.AllowRegExp);
  fail('fails on /$\r/', '/$\r/', Context.AllowRegExp);
  fail('fails on /$\u2028/', '/$\u2028/', Context.AllowRegExp);
  fail('fails on /$\u2029/', '/$\u2029/', Context.AllowRegExp);
  fail('fails on /i/igui', '/i/igui', Context.AllowRegExp);
  fail('fails on /i/mmgui', '/i/mmgui', Context.AllowRegExp);
  fail('fails on /i/ggui', '/i/ggui', Context.AllowRegExp);
  fail('fails on /i/guui', '/i/guui', Context.AllowRegExp);
  fail('fails on /\\B*/u', '/\\B*/u', Context.AllowRegExp);
  fail('fails on \\b+/u', '\\b+/u', Context.AllowRegExp);
  fail('fails on /[d-G\\r]/', '/[d-G\\r]/', Context.AllowRegExp);
  fail('fails on /[d-G\\r/', '/[d-G\\r/', Context.AllowRegExp);
  fail('fails on /]', '/]', Context.AllowRegExp);
  fail('fails on /x{1,}{1}/', '/x{1,}{1}/', Context.AllowRegExp);
  fail('fails on /{1,}/', '/{1,}/', Context.AllowRegExp);
  fail('fails on /x{1,}{1}/', '/x{1,}{1}/', Context.AllowRegExp);
  fail('fails on /a(?=b(?!cde/', '/a(?=b(?!cde/', Context.AllowRegExp);
  fail('fails on /(', '/(', Context.AllowRegExp);
  fail('fails on /(?=b(?!cde/', '/(?=b(?!cde/', Context.AllowRegExp);
  fail('fails on /[abc\\udeff', '/[abc\\udeff', Context.AllowRegExp);
  fail('fails on /i/gg', '/i/gg', Context.AllowRegExp);
  fail('fails on /i/ii', '/i/ii', Context.AllowRegExp);
  fail('fails on /i/mm', '/i/mm', Context.AllowRegExp);
  fail('fails on /i/uu', '/i/uu', Context.AllowRegExp);
  fail('fails on /i/uv', '/i/uv', Context.AllowRegExp);
  fail('fails on /i/uv', '/i/vu', Context.AllowRegExp);
  fail('fails on /i/vv', '/i/vv', Context.AllowRegExp);
  fail('fails on /i/yy', '/i/yy', Context.AllowRegExp);
  fail('fails on /i/ss', '/i/ss', Context.AllowRegExp);
  fail('fails on /i/dd', '/i/dd', Context.AllowRegExp);
  fail('fails on /i/a', '/i/a', Context.AllowRegExp);
  fail('fails on /i/፰', '/i/፰', Context.AllowRegExp);
});
