import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { regexFeatures } from '../../scripts/shared.mjs';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';
import { type Options } from './../../src/options';

describe('Lexer - Regular expressions', () => {
  const tokens: ([Context, string, string, string] | [Context, string, string, string, Options])[] = [
    // None unicode regular expression
    [Context.AllowRegExp, '/a|b/', 'a|b', ''],
    [Context.AllowRegExp, '/a|b/', 'a|b', ''],
    [Context.AllowRegExp, '/a|b/', 'a|b', ''],
    [Context.AllowRegExp, '/abc$/', 'abc$', ''],
    [Context.AllowRegExp, '/a*?/', 'a*?', ''],
    [Context.AllowRegExp, '/$/', '$', ''],
    [Context.AllowRegExp, String.raw`/(a)\1/`, String.raw`(a)\1`, ''],
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
      '',
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
    [Context.AllowRegExp, String.raw`/\D/`, String.raw`\D`, ''],
    [Context.AllowRegExp, String.raw`/\r/`, String.raw`\r`, ''],
    [Context.AllowRegExp, String.raw`/\s/`, String.raw`\s`, ''],
    [Context.AllowRegExp, String.raw`/\v/`, String.raw`\v`, ''],
    [Context.AllowRegExp, String.raw`/\S/`, String.raw`\S`, ''],
    [Context.AllowRegExp, String.raw`/\W/`, String.raw`\W`, ''],
    [Context.AllowRegExp, String.raw`/\w/`, String.raw`\w`, ''],
    [Context.AllowRegExp, String.raw`/\t/`, String.raw`\t`, ''],
    [Context.AllowRegExp, String.raw`/\n/`, String.raw`\n`, ''],
    [Context.AllowRegExp, String.raw`/\f/`, String.raw`\f`, ''],
    [Context.AllowRegExp, String.raw`/\d/`, String.raw`\d`, ''],
    [Context.AllowRegExp, String.raw`/abc\D/`, String.raw`abc\D`, ''],
    [Context.AllowRegExp, String.raw`/abc\n/`, String.raw`abc\n`, ''],
    [Context.AllowRegExp, String.raw`/abc\S/`, String.raw`abc\S`, ''],
    [Context.AllowRegExp, String.raw`/\fabcd/`, String.raw`\fabcd`, ''],
    [Context.AllowRegExp, String.raw`/\Dabcd/`, String.raw`\Dabcd`, ''],
    [Context.AllowRegExp, String.raw`/\Sabcd/`, String.raw`\Sabcd`, ''],
    [Context.AllowRegExp, String.raw`/\wabcd/`, String.raw`\wabcd`, ''],
    [Context.AllowRegExp, String.raw`/\Wabcd/`, String.raw`\Wabcd`, ''],
    [Context.AllowRegExp, String.raw`/abc\sdeff/`, String.raw`abc\sdeff`, ''],
    [Context.AllowRegExp, String.raw`/abc\ddeff/`, String.raw`abc\ddeff`, ''],
    [Context.AllowRegExp, String.raw`/abc\Wdeff/`, String.raw`abc\Wdeff`, ''],
    [Context.AllowRegExp, String.raw`/\$abcd/`, String.raw`\$abcd`, ''],
    [Context.AllowRegExp, String.raw`/abc\$abcd/`, String.raw`abc\$abcd`, ''],
    [Context.AllowRegExp, String.raw`/\./`, String.raw`\.`, ''],
    [Context.AllowRegExp, String.raw`/\*/`, String.raw`\*`, ''],
    [Context.AllowRegExp, String.raw`/\+/`, String.raw`\+`, ''],
    [Context.AllowRegExp, String.raw`/\?/`, String.raw`\?`, ''],
    [Context.AllowRegExp, String.raw`/\(/`, String.raw`\(`, ''],
    [Context.AllowRegExp, String.raw`/\[/`, String.raw`\[`, ''],
    [Context.AllowRegExp, String.raw`/\)/`, String.raw`\)`, ''],
    [Context.AllowRegExp, String.raw`/\|/`, String.raw`\|`, ''],
    [Context.AllowRegExp, String.raw`/\}/`, String.raw`\}`, ''],
    [Context.AllowRegExp, String.raw`/abc\\/`, 'abc\\\\', ''],
    [Context.AllowRegExp, String.raw`/abc\(/`, String.raw`abc\(`, ''],
    [Context.AllowRegExp, String.raw`/\.def/`, String.raw`\.def`, ''],
    [Context.AllowRegExp, '/\\`/', '\\`', ''],
    [Context.AllowRegExp, '/a|(|)/', 'a|(|)', ''],
    [Context.AllowRegExp, String.raw`/\cv/`, String.raw`\cv`, ''],
    [Context.AllowRegExp, String.raw`/\cj/`, String.raw`\cj`, ''],
    [
      Context.AllowRegExp,
      String.raw`/(((((((((((((((((((((a)))))))))))))))))))))\20/`,
      String.raw`(((((((((((((((((((((a)))))))))))))))))))))\20`,
      '',
    ],
    [Context.AllowRegExp, String.raw`/x\ud810\ud810/`, String.raw`x\ud810\ud810`, ''],
    [Context.AllowRegExp, String.raw`/x\udabcy/`, String.raw`x\udabcy`, ''],
    [Context.AllowRegExp, String.raw`/\udd00\udd00y/`, String.raw`\udd00\udd00y`, ''],
    [Context.AllowRegExp, String.raw`/\ud900\udd00\ud900y/`, String.raw`\ud900\udd00\ud900y`, ''],
    [Context.AllowRegExp, String.raw`/[\ufdd0-\ufdef]/`, String.raw`[\ufdd0-\ufdef]`, ''],
    [Context.AllowRegExp, String.raw`/[\u{FDD0}-\u{FDEF}]/u`, String.raw`[\u{FDD0}-\u{FDEF}]`, 'u'],
    [Context.AllowRegExp, '/[i]/', '[i]', ''],
    [Context.AllowRegExp, '/[j]/', '[j]', ''],
    [Context.AllowRegExp, '/[s]/', '[s]', ''],
    [Context.AllowRegExp, '/[x]/', '[x]', ''],
    [Context.AllowRegExp, '/[Q]/', '[Q]', ''],
    [Context.AllowRegExp, '/[-]/', '[-]', ''],
    [Context.AllowRegExp, '/[^-J]/g', '[^-J]', 'g'],
    [Context.AllowRegExp, String.raw`/[abc\D]/`, String.raw`[abc\D]`, ''],
    [Context.AllowRegExp, String.raw`/[\dabcd]/`, String.raw`[\dabcd]`, ''],
    [Context.AllowRegExp, String.raw`/[\$]/`, String.raw`[\$]`, '', { raw: true }],
    [Context.AllowRegExp, String.raw`/[abc\$]/`, String.raw`[abc\$]`, ''],
    [Context.AllowRegExp, String.raw`/[\?def]/`, String.raw`[\?def]`, ''],
    [Context.AllowRegExp, String.raw`/[\cT]/`, String.raw`[\cT]`, ''],
    [Context.AllowRegExp, String.raw`/[\xc3]/`, String.raw`[\xc3]`, ''],
    [Context.AllowRegExp, String.raw`/[\ud800\ud800\udc00]/`, String.raw`[\ud800\ud800\udc00]`, ''],
    [Context.AllowRegExp, String.raw`/[x\da-z]/`, String.raw`[x\da-z]`, ''],
    [Context.AllowRegExp, String.raw`/[x\SA-S]/`, String.raw`[x\SA-S]`, ''],
    [Context.AllowRegExp, String.raw`/[A-Z\D]/`, String.raw`[A-Z\D]`, ''],
    [Context.AllowRegExp, String.raw`/[\u5000-\u6000]/`, String.raw`[\u5000-\u6000]`, ''],
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
    [Context.AllowRegExp, String.raw`/\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/`, String.raw`\%([0-9]*)\[(\^)?(\]?[^\]]*)\]`, ''],
    [Context.AllowRegExp, String.raw`/[\u{FDD0}-\u{FDEF}]/v`, String.raw`[\u{FDD0}-\u{FDEF}]`, 'v'],
    [
      Context.AllowRegExp,
      String.raw`/[\p{Script_Extensions=Greek}&&\p{Letter}]/v`,
      String.raw`[\p{Script_Extensions=Greek}&&\p{Letter}]`,
      'v',
    ],
  ];

  if (regexFeatures.modifiers) {
    tokens.push(
      // https://github.com/tc39/proposal-regexp-modifiers#examples
      [Context.AllowRegExp, '/^(?i:[a-z])[a-z]$/', '^(?i:[a-z])[a-z]$', ''],
    );
  }

  if (regexFeatures.duplicateNamedCapturingGroups) {
    tokens.push(
      // https://github.com/tc39/proposal-duplicate-named-capturing-groups
      [
        Context.AllowRegExp,
        '/(?<year>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year>[0-9]{4})/',
        '(?<year>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year>[0-9]{4})',
        '',
      ],
    );
  }

  for (const [ctx, op, value, flags, options] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const parser = new Parser(op, options);
      const found = scanSingleToken(parser, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: parser.index < parser.source.length,
          value: (parser.tokenRegExp as any).pattern,
          flags: (parser.tokenRegExp as any).flags,
        },
        {
          token: Token.RegularExpression,
          hasNext: false,
          value,
          flags,
        },
      );
    });
  }

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const parser = new Parser(source);
      t.throws(() => scanSingleToken(parser, context, 0));
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
  fail(String.raw`fails on /\B*/u`, String.raw`/\B*/u`, Context.AllowRegExp);
  fail(String.raw`fails on \b+/u`, String.raw`\b+/u`, Context.AllowRegExp);
  fail(String.raw`fails on /[d-G\r]/`, String.raw`/[d-G\r]/`, Context.AllowRegExp);
  fail(String.raw`fails on /[d-G\r/`, String.raw`/[d-G\r/`, Context.AllowRegExp);
  fail('fails on /]', '/]', Context.AllowRegExp);
  fail('fails on /x{1,}{1}/', '/x{1,}{1}/', Context.AllowRegExp);
  fail('fails on /{1,}/', '/{1,}/', Context.AllowRegExp);
  fail('fails on /x{1,}{1}/', '/x{1,}{1}/', Context.AllowRegExp);
  fail('fails on /a(?=b(?!cde/', '/a(?=b(?!cde/', Context.AllowRegExp);
  fail('fails on /(', '/(', Context.AllowRegExp);
  fail('fails on /(?=b(?!cde/', '/(?=b(?!cde/', Context.AllowRegExp);
  fail(String.raw`fails on /[abc\udeff`, String.raw`/[abc\udeff`, Context.AllowRegExp);
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
