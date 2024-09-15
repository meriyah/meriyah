import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Array', () => {
  for (const arg of [
    '[1 <= 0]',
    '[a, ...b=c]',
    '[a, ...b=c]',
    '[a, ...b=c]',
    '[a, ...(b=c)]',
    '[a, ...b=c.d = 2]',
    '[a, ...b=c]',
    '([a, ...b=c])',
    '[a] = x',
    '[[a] = x]',
    '[[a] = x]',
    '[[a] = [[a] = x]]',
    '[[a] = [[a] = [[a] = [[a] = x]]]]',
    '[a = b] = x',
    '[[a] = b] = x',
    '[,,,] = x',
    '[...a] = x',
    '[...async] = x',
    'v = [...a, b]',
    '[a,] = x',
    '0, [{ x }] = [null]',
    '[a, b] = f();',
    '[...a.b] = x',
    '[[a]] = x',
    '[{x = y}] = z',
    '[...[a]] = x',
    '[(x)] = 1',
    '[,,1,,,2,3,,]',
    '[ 1, 2,, 3, ]',
    '[ 0 ]',
    '[ ,, 0 ]',
    '[,,3,,,]',
    '[x()]',
    '[...a]',
    '[a, ...b]',
    '[...a,]',
    '[, ...a]',
    '[x().foo] = x',
    '[(x().foo)] = x',
    '[...a, ...b]',
    '[...a, , ...b]',
    `[...x, y];`,
    `async(...x/y);`,
    'var array = [,,,,,];',
    'var a = [,];',
    'let a = [];',
    'let b = [42];',
    'let c = [42, 7];',
    'let [d, ...e] = [1, 2, 3, 4, 5];',
    'let [async, ...e] = [1, 2, 3, 4, 5];',
    'let [d, ...async] = [1, 2, 3, 4, 5];',
    'let [async, ...await] = [1, 2, 3, 4, 5];',
    `[...x];`,
    `[...x] = y;`,
    `[...[x].foo] = x`,
    `[...[x]/y]`,
    `(...[x]) => x`,
    `(...{x}) => x`,
    `[...{x}]`,
    `[...{x}] = y`,
    `([...{x}]) => x`,
    `[...{x}/y]`,
    `[...{x} ? y : z]`,
    `[...{x}.foo] = x`,
    `([...[x]]) => x`,
    `[...[x]] = y`,
    `[...[x]]`,
    '[...[...a]]',
    '[a, ...b]',
    '[function* f() {}]',
    '[a, ...{0: b}] = (1);',
    '[...{a}] = b;',
    '[...{a}] = b;',
    '[a, ...{0: b}] = 1',
    '[1, "z", "a", "Symbol(foo)"]',
    '[1, 2, 3, ...[]]',
    ' [...{}];',
    '[1,2,,4,5];',
    `[a,]`,
    `[a,,]`,
    `[a,a,]`,
    `[a,,,]`,
    '([...x]) => y',
    '([...async]) => y',
    '[...(x,y)]',
    '[...(x,y)]',
    `[a,a,,]`,
    `[,a]`,
    `[,a,]`,
    `[,a,,]`,
    `[,a,a,]`,
    `[,a,]`,
    `[,a,,]`,
    `[,a,a,]`,
    `[,,a]`,
    `[,a,a]`,
    `[,,a,]`,
    `[,,a,]`,
    `[,,,a]`,
    `[,,a,a]`,
    'a = [,]',
    'a = [,]',
    '[[1,2], [3], []]',
    '[1,2,,4,5]',
    '[0, ...a];',
    '[...iter];',
    'a = [,] = b = [] = c[9]',
    'a = [(b), (c), (d)]',
    'a = [(b) => {}, (c) => {}, (d) => { [b]}]',
    'a = [(b) => {}, [(b) => {}, (c) => {}, (d) => { [b]}]]',
    'a = [,]',
    'a = [,]',
    'a = [a = [,],a = [a = [,],a = [,]]]',
    'async = [,]',
    `async ([[[]]]) => [[,,a,a=> {}]]`,
    `[[,,a,a=> {}]]`,
    `[[,,a=> {},a]]`,
    `[[a=> {},,a,]]`,
    `[[] = [9], {} = [], c = d, [,,a,a=> {}]]`,
    `[[,,a,a=> {}]]`,
    '([].x);',
    '[...this, y];',
    '[...x, y];',
    '[...x];',
    '[...x] = y;',
    '[...async] = y;',
    '[...this];',
    '[...new x];',
    '[...x/y];',
    '[...x = x];',
    '([...x=y])',
    'async([].x);',
    '[...[a]=1]',
    '[...[1]]',
    '[...[1], ..."foo" ]',
    '[...[1], ...2 ]',
    '[...[1], ..."foo", ]',
    '[...[1], ...2 ,]',
    '[...[1], ..."a".b]',
    '[...[1], ..."a"[b]]',
    '[...[1], ..."a"(b)]',
    '[...[1], ["a"](b)]',
    '[...[1], "a"(b)]',
    '[...a]',
    '[a, ...b]',
    '[...a,]',
    '[...a, ,]',
    '[, ...a]',
    '[...a, ...b]',
    '[...a, , ...b]',
    '[...[...a]]',
    '[...[...async]]',
    '[, ...a]',
    '[, , ...a]',
    '[,]',
    `[...50..bar]`,
    `[...50]`,
    '[...a=b]',
    '[{}.foo] = x',
    '[{}[foo]] = x',
    `[[]]`,
    '([...x]) => x',
    '([...x]);',
    '([...x=y]);',
    '([...x, ...y]);',
    '([...x.y] = z)',
    '([...x, ...y]);',
    '[{}.foo]=x',
    '[5[foo]]=x',
    '["x".foo]=x',
    '[`x`.foo]=x',
    `[x]=y`,
    `[x=y]=z`,
    `({"a b c": bar});`,
    `({"a b c"(){}});`,
    `({"a b c": bar}) => x`,
    `({15: bar});`,
    `({15(){}});`,
    `({15: bar}) => x`,
    `({25: true})`,
    `({"x": true})`,
    '[a.b=[c.d]=e] = f;',
    '([a=[b.c]=d]) => e;',
    '[{x: y.z}]',
    '[{x: y.z}] = a',
    '([a] = b) => c;',
    '([a]) => b;',
    'const [a] = b;',
    'function foo([a]){};',
    'function foo([a] = b){};',
    '({"foo": [x].foo}=y);',
    '[...foo] = bar',
    `for ([...a.b] in c) d`,
    `[...a.b]=c`,
    '[...a.b]=c',
    '[...a.b] = c',
    '([...a.b] = c)',
    '([...[x]]) => x',
    '[(a)] = x',
    '(z = [...x.y] = z) => z',
    '(z = [...x.y]) => z',
    '[...[x]=y];',
    '[...[{a: b}.c]] = [];',
    '[...[{prop: 1}.prop]] = []',
    '({ a: {prop: 1}.prop } = {})',
    '[{a: 1}.c] = [];',
    '[({a: 1}.c)] = [];',
    '[[1].c] = [];',
    '[foo.foo, foo.bar] = [1, 2];',
    '[([1].c)] = [];',
    '({ a: {prop: 1}.prop } = {})',
    'var [, a, , b] = x',
    'var [] = x',
    'var [...a] = x;',
    'var [a] = x;',
    '[foo, bar] = [0,1];',
    '[a,a,,...a]=0',
    '[,,]=0',
    '[...a[0]] = 0',
    '[...{ a }] = b',
    '[[[[[[[[[[[[[[[[[[[[{a=b[0]}]]]]]]]]]]]]]]]]]]]]=0;',
    '[(a) = 0] = 1',
    '[(a.b)] = 0',
    '[a = (b = c)] = 0',
    '[(a = 0)]',
    '({a:(b)} = 0)',
    '({a:(b) = 0} = 1)',
    '({a:(b.c)} = 0)',
    '({a:(b = 0)})',
    '[a] = 0;',
    `[...a = b] `,
    'result = [ x = yield ] = [[22]];',
    'result = [[x[yield]]] = [[22]];',
    '[{...o, ...o2}]',
    '([...x=y])',
    '[...this, y];',
    '({...this, y})',
    '[1, "z", "a", "Symbol(foo)"]',
    '(null, [...[]])',
    'apply(null, [...[]])',
    '[...target = source]',
    '[{a: 1, b: 2, ...null}]',
    '[{a: 1, b: 2, ...o}]',
    '[5, ...[6, 7, 8], 9]',
    '[,,,1,2]',
    '[,,,,,,,,,,,,,,,,,,,,,,,,,]',
    '[,,,,a,,,,,,b,,,,,,,,,1,,,,,,]',
    '[,,,,,,,,[5, ...[6, 7, 8], 9],,,,,,,,,,,,,,,,,]',
    '[,,,,,,,,,,,,,,,,,,,,,,,,,]',
    '[,,,,,,,,,,,,,,,,,,,,,,,,,]',
    '[,,3,,,];',
    '[[1,2], [3], []];',
    '[101];',
    '[...a[0]] = 0;',
    '[a,b=0,[c,...a[0]]={}]=0;',
    'result = [ xFn = function x() {}, fn = function() {} ] = vals;',
    '[ arrow = () => {} ]',
    '[ xCls = class x {}, cls = class {}, xCls2 = class { static name() {} } ]',
    '[ xCover = (0, function() {}), cover = (function() {}) ]',
    'result = [ x = "x" in {} ] = vals;;',
    '0, [ x = y ] = [];',
    '[ a = x += 1, b = x *= 2 ]',
    '[arguments = 4, eval = 5]',
    '[ x = yield ] ',
    '0, [[ _ ]] = [null];',
    '[[1]];',
    '0, [ x ] = [];',
    '[ x[yield] ] = [33];',
    '[,] = [];',
    '["x".foo] = x',
    '[5[foo]] = x',
    '[,] = [];',
    '[] = null',
    '[] = true',
    '[, , x, , ...y] = [1, 2, 3, 4, 5, 6];',
    '[...[x]]  = [ , ];',
    '[...[x[yield]]] =[101];',
    '[...[async[yield]]] = [await];',
    '[...x[yield]] =[101];',
    '0, { yield } = {};',
    '[[[[[[[101]]]]]]];',
    '[[[[[[[a]]]]]]] = b;',
    '[[[[[[[a=b]]]] = c] = c] = c] = c;',
    '[[[[[[[a=b] = c] = c] = c] = c] = c] = c] = c;',
    '[[[[[[[a=b]] = c]] = c] = c] = c] = c;',
    '[[[[[[[a=b] = c]]] = c] = c] = c] = c;',
    '[[[[[[[a=b]]]] = c] = c] = c] = c;',
    '[[[[[[[a=b] = c] = c] = c] = c] = c] = c] = [[[[[[[a=b] = c]]] = c] = c] = c] = c;',
    '[[[[[[[a=b]] = c]] = c] = c[[[[[[[a=b] = c]]] = c] = c] = c] = c] = c] = c;',
    '[1, ...rest]',
    '[...rest, 1]',
    '[...rest, ,1]',
    '[{a: 0}.x] = [];',
    '[[0].x] = [];',
    '[...{a: 0}.x] = [];',
    '[...[0].x] = [];',
    '({a: {b: 0}.x} = {});',
    '({a: [0].x} = {});',
    '({...{b: 0}.x} = {});',
    '({...[0].x} = {});',
    '({...{eval}.x} = {});',
    '[{eval}.x] = [];',
    '[...{eval}.x] = [];',
    '[...{eval}.x] = [[...{arguments}.x] = []];',
    '({a: {eval}.x} = {});',
    '[...{arguments}.x] = [];',
    '[a]',
    '[[a] ? x : bcd]',
    '[[a] / bcd]',
    '([a] / bcd)',
    '[({a})]',
    '[({a}), ({b})]',
    '[(({a}), ({b}))]',
    '([(({a}), ({b}))])',
    '[a]',
    '[a]',
    '[a]',
    '[a, b] = [10, 20];',
    '[a, b.c.d = (a) / 2 ] = [10, 20];',
    '({a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40});',
    '[a=5, b=7] = [1];',
    '[a=5, b=(7)] = ([1]);',
    '[a=5, b=(async)] = ([1]);',
    '[a=5, b=("foo")] = ([async]);',
    '[a=5, b=(7).c.d] = ([1]);',
    '[a, b] = [b, a];',
    '[a, b.c] = [d.e, f.g];',
    '[a, b.c] = [d.e, (f.g) = h];',
    '[a, b] = f(() => {  }); ',
    '[a, b] = f(() => { [a, b.c] = [d.e, (f.g) = h]; }); ',
    '([a, b] = f(() => { [a, b.c] = [d.e, (f.g) = h]; }));',
    '[a, b] = f(); ',
    'var [a, , b] = f();',
    '[a, ...b] = [1, 2, 3];',
    '[a, ...b] = [1, 2, ...c];',
    '[a, ...b] = [1, 2, ...(c / 2)];',
    '[a, ...b] = [1, 2, ...c / 2];',
    '[a, ...b] = ([1, 2, ...c / 2]);',
    '[async, ...b] = ([1, 2, ...c / 2]);',
    '[a, ...b] = ([1, 2, ...async / 2]);',
    'o = {p: 42, q: true};',
    'await = {p: 42, q: true};',
    '[o = {p: 42, q: true}];',
    '([o = {p: 42, q: true}]);',
    '[a, b, ...rest] = [10, 20, 30, 40, 50];',
    '[[[a.b =[]]]]',
    '[[[a.b =[{ x: x.b }]]]]',
    '[[[a.b =[{ x: x.b }]]]]',
    '[[[a.b =[{ x: x.b }]]] = abc]',
    '[(a) = (b)]',
    '[(x) = y = (z)]',
    '[(x) = y = (z) => (a)]',
    '[(x) => y = (z)]',
    '[(x), y = x] = x;',
    '[(x), y] = x;',
    '[(async), y] = x;',
    '[(x), async] = x;',
    '[(x), await] = x;',
    '[(x), async] = await;',
    '[(x), y] = x;',
    '[a, b, c];',
    '[x.y = 42]',
    '[{}[x ? y : z] += a]',
    '[ c.d === e ? f : g ]',
    '["b" === e ? f : g ]',
    '[ [b].c.d === e ? f : g ]',
    '[{}[x ? y : z] += a]',
    '[ c.d === (e ? f : g )]',
    '[ c.d === (e ? f : g ) ? x : y]',
    '[["b"] === e ? f : g ]',
    '[([b].c.d) === {string} ? f : g ]',
    '[([3].c.d) === e ? f : g /= 1]',
    '[{}[x ? {zzz} : (z)] /= a]',
    '[ c.d === e ? (f) : (g) ]',
    '["b" === e ? f : g ]',
    '[ [b].c.d === e ? f : g ]',
    '[{}[x ? y : z] += a]',
    '[ c.d === (e ? f : g )]',
    '[ c.d === (e ? f : g ) ? x : y]',
    '[["b"] === e ? f : g ]',
    '[([b].c.d) === e ? f : g ]',
    '[([b].c.d) === e ? f : g /= 1]',
    '[...{}[x ? {zzz} : (z)] /= a]',
    '[ ...c.d === e ? (f) : (g) ]',
    '[..."b" === e ? f : g ]',
    '[...[b].c.d === e ? f : g ]',
    '[...{}[x ? y : z] += a]',
    '[...[][x ? y : z] += a]',
    '[ c.d === (e ? f : g ) ? x : y]',
    '[(x.y) = 42]',
    '[(x.y) = [1/42]]',
    '[(x.y) = [1/42]]',
    '[x.y = 42]',
    '[[], [b, c], []];',
    '[a,, b,];',
    '[a,,,, b];',
    '[a, b,, c];',
    '[(a), ] = x;',
    '([(x), y] = x);'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`() => {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => {${arg}}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Array (fail)', [
    ['[(x.y) = [1/42]/=2]', Context.None],
    ['[[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]]', Context.None],
    [`[{}[x ? {zzz} : (z)] /= ...a]`, Context.None],
    ['[{} = 2/=2]', Context.None],
    ['["b" /= e ? f : g ]', Context.None],
    ['[([b].c.(d)) **= e ? f : g /= 1]', Context.None],
    ['[([b].c.(d) / x - 2) **= e ? f : g /= 1]', Context.None],
    ['[...[x ? y : z] += a]', Context.None],
    [`try {} catch ([...a.b]) {}`, Context.None],
    [`[ c.d === (...e ? f : g )]`, Context.None],
    [`let [...a.b]=c`, Context.None],
    [`[["b"] /= e ? f : g ]`, Context.None],
    ['[{} /= 2]', Context.None],
    ['[{x=y} = 2/=2]', Context.None],
    ['[ c.d === (...[e] ? f : g )]', Context.None],
    ['[x.[y] = 42]', Context.None],
    [`[x.[y] = [z]]`, Context.None],
    [`for (let [...a.b] in c) d`, Context.None],
    ['[...[1], ...1.a]', Context.None],
    ['let [...a, b] = [];', Context.None],
    ['[...break]', Context.None],
    ['[...break }', Context.None],
    ['[...break :', Context.None],
    ['[...break', Context.None],
    ['[...a, b] = v', Context.None],
    ['[(a), async(await[async])] = x;', Context.None],
    [`[...this] = x;`, Context.None],
    [`[...this] => x;`, Context.None],
    [`[{a: 1} = []];`, Context.None],
    [`[{a: 1} = []];`, Context.None],
    [`[{a: 1} = []];`, Context.None],
    [`[{a: 1} = []];`, Context.None],
    [`[...a, ...b] = x`, Context.None],
    [`[([a])] = x`, Context.None],
    [`[([async])] = x`, Context.None],
    [`[...a,] = x`, Context.None],
    [`[{x = y}]`, Context.None],
    [`({a: {b = 0}.x} = {})`, Context.None],
    [`() => {({a: {b = 0}.x} = {})}`, Context.None],
    [`function foo() { ({a: {b = 0}.x} = {})}`, Context.None],
    [`({a: {b = 0}.x} = {})`, Context.None],
    ['[/[/]', Context.None],
    ['[{a = 0}.x] = [];', Context.None],
    ['() => {[{a = 0}.x] = [];}', Context.None],
    ['[{a = 0}.x] = [];', Context.None],
    ['[...x, ...y] = [];', Context.None],
    ['[...{a = 0}.x] = []', Context.None],
    ['() => {[...{a = 0}.x] = []}', Context.None],
    ['() => {({...{b = 0}.x} = {})}', Context.None],
    ['[...x, ...y] = [];', Context.None],
    ['[...x, ...y] = [];', Context.None],
    // [`++[a];`, Context.None],
    [`[...{0=x} = c] `, Context.None],
    [`[...{a: 0=x} = c] `, Context.None],
    [`[...{0} = c] `, Context.None],
    [`[...{a: 0} = c]`, Context.None],
    [`({x:0 = 5})`, Context.None],
    [`([...x=y]) = z`, Context.None],
    [`([...x=y]) => z`, Context.None],
    [`({*a([a.b]){}})`, Context.None],
    [`try {} catch ({e: x.a}) {}`, Context.None],
    [`var {a: b.c} = 0;`, Context.None],
    [`([a.b]) => 0`, Context.None],
    [`function a([a.b]) {}`, Context.None],
    [`({a([a.b]){}}`, Context.None],
    [`({set a([a.b]){}})`, Context.None],
    [`let [...x=y] = z`, Context.None],
    [`[...{true=x} = c]`, Context.None],
    [`[...{a: true=x} = c]`, Context.None],
    [`([x]=await y)=>z`, Context.None],
    [`[x=y]=await z`, Context.None],
    [`[...{true} = c]`, Context.None],
    [`[...{a: function=x} = c]`, Context.None],
    [`[...{a: true=x} = c]`, Context.None],
    [`({x:true = 5})`, Context.None],
    [`var [a]; `, Context.None],
    [`var ([a]) = x;`, Context.None],
    [`var [...a, b] = x;`, Context.None],
    [`var [...a,] = x;`, Context.None],
    ['[x] += 0', Context.None],
    ['[, x, ...y,] = 0', Context.None],
    ['[...x, ...y] = 0', Context.None],
    ['({[a / b = c]: {}})', Context.None],
    ['[...x, y] = 0', Context.None],
    ['[...x,,] = 0', Context.None],
    ['[0,{a=0}] = 0', Context.None],
    ['[{a=0},{b=0},0] = 0', Context.None],
    ['[{a=0},...0]', Context.None],
    ['[...0,a]=0', Context.None],
    ['[...0,{a=0}]=0', Context.None],
    ['[...0,...{a=0}]=0', Context.None],
    ['function foo() { [a, ...{b=c}]}', Context.None],
    ['() => {[a, ...{b=c}]}', Context.None],
    ['([[a](b.c) = [[a] = [[a] = ([[a] = x]]]]))', Context.None],
    ['([[a](b) = [[a] = [[a] = ([[a] = x]]]]))', Context.None],
    ['[[a] = [[a] = [[a] = ([[a] = x]]]])', Context.None],
    ['([[a] = [[a] = [[a] = ([[a] = x]]]]))', Context.None],
    ['[...a, ,] = [...a, ,]', Context.None],
    ['([...a, ,] = [...a, ,])', Context.None],
    ['[...{a=0},]', Context.None],
    ['[...{a=0},]=0', Context.None],
    ['[0] = 0', Context.None],
    ['[a, ...b, {c=0}]', Context.None],
    ['{a = [...b, c]} = 0', Context.None],
    ['[a, ...(b = c)] = 0', Context.None],
    [`[...await]`, Context.Module],
    [`[...await]`, Context.InAwaitContext],
    [`[...yield]`, Context.Strict],
    [`[.../x//yield]`, Context.Strict],
    ['[...await] = obj', Context.Module],
    ['[...await] = obj', Context.InAwaitContext],
    ['[...yield] = obj', Context.Strict],
    ['async x => [...await x] = obj', Context.None],
    ['[...a + b] = c', Context.None],
    ['function *f(){ return [...yield] = obj; }', Context.None],
    ['function *f(){ return [...yield x] = obj; }', Context.None],
    ['({...yield} = obj)', Context.Strict],
    ['async([].x) => x;', Context.None],
    [`[x=await y]=z`, Context.None],
    [`[x=await y]=z`, Context.None],
    [`[.../x/ y]`, Context.None],
    [`[...{a = b} = c] = x`, Context.None],
    ['([...{a = b} = c]) => d;', Context.None],
    ['[...{a = b} = c] = d;', Context.None],
    ['result = [...{ x = yield }] = y;', Context.Strict],
    ['[true = x] = x', Context.None],
    ['[(...)]', Context.None],
    ['(...)', Context.None],
    ['[...this, y] = foo;', Context.None],
    ['[{..}, x]', Context.None],
    ['[{..}, x]', Context.None],
    ['[{..}]', Context.None],
    ['[{..}.x]', Context.None],
    ['[{..}=x]', Context.None],
    [`[[async].await()] = x`, Context.None],
    [`[[foo].food()] = x`, Context.None],
    [`[[foo].food() = x] = x`, Context.None],
    [`[[..][foo]] = x`, Context.None],
    [`[[..].foo] = x`, Context.None],
    [`[[..]=x]`, Context.None],
    [`[[..].x]`, Context.None],
    [`[[..], x]`, Context.None],
    [`[[..]]`, Context.None],
    [`([...x.y]) => z`, Context.None],
    [`([...x.y] = z) => z`, Context.None],
    ['[a, ...]', Context.None],
    ['[..., ]', Context.None],
    ['[a=5, b=7] = ([1]) = x;', Context.None],
    ['[a=5, b=7] = ([1]) => x;', Context.None],
    ['[a=5, b=7] = ([1]) => x;', Context.None],
    ['[(a=5, b=(x)) = y] = ([1]);', Context.None],
    ['[(a=5, b=(7))] = ([1]);', Context.None],
    ['[a=5, b=(7).c.(d)] = ([1])', Context.None],
    ['[a=5, b=(7).c.(d)[e]] = ([1]);', Context.None],
    ['([a] / ...bcd)', Context.None],
    ['([a], ...[bcd] = (x))', Context.None],
    ['([a], ...bcd = (x))', Context.None],
    ['([(({a.b.c[d]}), ({b = c / 2}))])', Context.None],
    ['([(({a[d]}), ({b = c / 2}))])', Context.None],
    ['([(({a}), ({b = c / 2}))])', Context.None],
    ['[..., ...]', Context.None],
    ['[ (...a)]', Context.None],
    ['[true = x]', Context.None],
    ['[this] = x', Context.None],
    ['[false] = x', Context.None],
    ['[false] = x', Context.None],
    ['[function(){}] = x', Context.None],
    ['[new x] = x', Context.None],
    ['[null] = x', Context.None],
    ['[true] = x', Context.None],
    ['[typeof x] = x', Context.None],
    ['[void x] = x', Context.None],
    ['[--x = 1]', Context.None],
    ['[...x += y] = a;', Context.None],
    ['[await = x] = x', Context.Module],
    ['[...a = 1 = a]', Context.None],
    ['[...1 = a]', Context.None],
    ['[this] = obj', Context.None],
    ['[x, ...y, z] = obj', Context.None],
    ['[x, y, ...z()] = obj', Context.None],
    ['[x, ...z = arr, y] = obj', Context.None],
    ['[x, ...z(), y] = obj', Context.None],
    ['[x, ...z + arr, y] = obj', Context.None],
    ['[...this] = obj', Context.None],
    ['[...true] = x', Context.None],
    ['[...true] => x', Context.None],
    ['[...new] = x', Context.None],
    ['[...new]', Context.None],
    ['[..."foo"=x] = x', Context.None],
    ['[...[a](1)=2] = 3', Context.None],
    ['[...[a](1)] = 3', Context.None],
    ['[...[a].1] = 3', Context.None],
    ['[...[1], "a"(b)] = x', Context.None],
    ['[...[1], ["a"](b)] = x', Context.None],
    ['[...]', Context.None],
    ['[..."x"=b]', Context.None],
    ['[...a=b] = x', Context.None],
    ['[..."foo".foo=x] = x', Context.None],
    ['[x, y, ...z = arr] = obj', Context.None],
    ['[x, y, ...z = arr] = x = obj', Context.None],
    ['[..."foo"+bar] = x', Context.None],
    ['[...[a](1)] = 3', Context.None],
    ['[...[x].map(y, z)] = a;', Context.None],
    ['[ ...([a] = []) = a;', Context.None],
    ['[ x += x ] = a;', Context.None],
    ['[...++x] = a;', Context.None],
    ['[...x--] = a;', Context.None],
    ['[...!x] = a;', Context.None],
    ['[...x + y] = a;', Context.None],
    ['[...z = 1] = a;', Context.None],
    ['[x, y, ...z = 1] = a;', Context.None],
    ['[...x,] = a;', Context.None],
    ['[x, ...y, z] = a;', Context.None],
    ['[async(x,y) => z] = a;', Context.None],
    ['[async x => z] = a;', Context.None],
    ['[--x = 1] = a;', Context.None],
    ['[this=x]', Context.None],
    ['[false=x]', Context.None],
    ['[true=x]', Context.None],
    ['[x()] = a;', Context.None],
    ['[this = 1] = a;', Context.None],
    ['[x--] = a;', Context.None],
    ['[--x = 1] = a;', Context.None],
    ['[[[[[[[a=b] = c]]] = c] = (c=d)] = c] = ({a = b}) = foo;', Context.None],
    ['[async x => z] = a;', Context.None],
    ['[x, y, ...[z] = [1]] = a;', Context.None],
    ['[...[z] = [1]] = a;', Context.None],
    ['[...rest, x] = x', Context.None],
    ['[a,b,...rest, x] = x', Context.None],
    ['[...rest,] = x', Context.None],
    ['[a,b,...rest,...rest1] = x', Context.None],
    ['[a,,..rest,...rest1]  = x ', Context.None],
    ['{...[ x = 5 ] }', Context.None],
    ['{...[x] } = x', Context.None],
    ['{...[ x = 5 ] }', Context.None],
    ['{...[ x = 5 ] }', Context.None],
    ['[x + y] = x', Context.None],
    ['x, [foo + y, bar] = doo', Context.None],
    ['[50] = a;', Context.None],
    ['[0,{a=0}] = 0', Context.None],
    ['[0] = 0', Context.None],
    ['x, [foo + y, bar] = zoo;', Context.None],
    ['[x[yield]]] = value;', Context.None],
    ['[[(x, y)]] = x;', Context.None],
    ['[...[(x, y)]] = x;', Context.None],
    ['[ ...[ ( [ a ] ) ] ] = a;', Context.None],
    ['[(foo())] = a;', Context.None],
    ['[ ([a]) ] = a;', Context.None],
    ['[ (++y) ] = a;', Context.None],
    ['([this]) => x;', Context.None],
    ['[break]', Context.None],
    ['[implements]', Context.Strict | Context.Module],
    ['"use strict"; [implements]', Context.None],
    ['x, [foo + y, bar] = doo;', Context.None],
    ['[...{a: true} = c]', Context.None],
    ['[[[a.b =[{ x: x.b }]]]] = ([{ a = b / 2}])', Context.None],
    ['[[[a.b =[{ x: x.b = 123 }]a(b=c)]]]', Context.None],
    ['[(a.b.c.d = e) = ()]', Context.None],
    ['function foo() { [(a.b.c.d = e) = ()]}', Context.None],
    ['[() = ()]', Context.None],
    ['[(1) = (a = b)]', Context.None],
    ['[(1) = (a = b.c)]', Context.None],
    ['[([{ x = y }] = b.call(c)) = ()]', Context.None],
    ['[(a = b.call(c)) = ()]', Context.None],
    ['[(a = b.call(c)) = (a = b / 2)]', Context.None],
    ['[(a = async.call(c)) = (a = b / 2)]', Context.None]
  ]);

  pass('Expressions - Array (pass)', [
    [
      '[(x) = y = (z) => (a)]',
      Context.None,
      {
        body: [
          {
            expression: {
              elements: [
                {
                  left: {
                    name: 'x',
                    type: 'Identifier'
                  },
                  operator: '=',
                  right: {
                    left: {
                      name: 'y',
                      type: 'Identifier'
                    },
                    operator: '=',
                    right: {
                      async: false,
                      body: {
                        name: 'a',
                        type: 'Identifier'
                      },
                      expression: true,

                      params: [
                        {
                          name: 'z',
                          type: 'Identifier'
                        }
                      ],
                      type: 'ArrowFunctionExpression'
                    },
                    type: 'AssignmentExpression'
                  },
                  type: 'AssignmentExpression'
                }
              ],
              type: 'ArrayExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '[.../x//yield]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: /x/,
                      regex: {
                        pattern: 'x',
                        flags: ''
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    operator: '/'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x, [foo, bar] = doo;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x, [foo = y, bar] = doo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      },
                      {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f(){ return [...yield x]; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 37,
        range: [0, 37],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 37,
            range: [0, 37],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 37,
              range: [13, 37],
              body: [
                {
                  type: 'ReturnStatement',
                  start: 15,
                  end: 35,
                  range: [15, 35],
                  argument: {
                    type: 'ArrayExpression',
                    start: 22,
                    end: 34,
                    range: [22, 34],
                    elements: [
                      {
                        type: 'SpreadElement',
                        start: 23,
                        end: 33,
                        range: [23, 33],
                        argument: {
                          type: 'YieldExpression',
                          start: 26,
                          end: 33,
                          range: [26, 33],
                          delegate: false,
                          argument: {
                            type: 'Identifier',
                            start: 32,
                            end: 33,
                            range: [32, 33],
                            name: 'x'
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '"use strict"; const { [eval]: []} = a;',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 38,
        range: [0, 38],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'Literal',
              start: 0,
              end: 12,
              range: [0, 12],
              value: 'use strict',
              raw: '"use strict"'
            },
            directive: 'use strict'
          },
          {
            type: 'VariableDeclaration',
            start: 14,
            end: 38,
            range: [14, 38],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 20,
                end: 37,
                range: [20, 37],
                id: {
                  type: 'ObjectPattern',
                  start: 20,
                  end: 33,
                  range: [20, 33],
                  properties: [
                    {
                      type: 'Property',
                      start: 22,
                      end: 32,
                      range: [22, 32],
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'Identifier',
                        start: 23,
                        end: 27,
                        range: [23, 27],
                        name: 'eval'
                      },
                      value: {
                        type: 'ArrayPattern',
                        start: 30,
                        end: 32,
                        range: [30, 32],
                        elements: []
                      },
                      kind: 'init'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 36,
                  end: 37,
                  range: [36, 37],
                  name: 'a'
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){ return [...yield]; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        range: [0, 35],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 35,
            range: [0, 35],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 35,
              range: [13, 35],
              body: [
                {
                  type: 'ReturnStatement',
                  start: 15,
                  end: 33,
                  range: [15, 33],
                  argument: {
                    type: 'ArrayExpression',
                    start: 22,
                    end: 32,
                    range: [22, 32],
                    elements: [
                      {
                        type: 'SpreadElement',
                        start: 23,
                        end: 31,
                        range: [23, 31],
                        argument: {
                          type: 'YieldExpression',
                          start: 26,
                          end: 31,
                          range: [26, 31],
                          delegate: false,
                          argument: null
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x = true] = y',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 10,
                range: [0, 10],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 9,
                    range: [1, 9],
                    left: {
                      type: 'Identifier',
                      start: 1,
                      end: 2,
                      range: [1, 2],
                      name: 'x'
                    },
                    right: {
                      type: 'Literal',
                      start: 5,
                      end: 9,
                      range: [5, 9],
                      value: true
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 13,
                end: 14,
                range: [13, 14],
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      '[[x] = true] = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ]
                    },
                    right: {
                      type: 'Literal',
                      value: true
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '[[x = true] = true] = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: true
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Literal',
                      value: true
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '["foo".foo] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'result = [...{ x = yield }] = y;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'result'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            value: {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              right: {
                                type: 'Identifier',
                                name: 'yield'
                              }
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '[/foo/.length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: /foo/,
                      regex: {
                        pattern: 'foo',
                        flags: ''
                      }
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'function* g() {   [...{ x = yield }] = y   }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                value: {
                                  type: 'AssignmentPattern',
                                  left: {
                                    type: 'Identifier',
                                    name: 'x'
                                  },
                                  right: {
                                    type: 'YieldExpression',
                                    argument: null,
                                    delegate: false
                                  }
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '[...{x}=y];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[(a)] = 1',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '[x,] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[[x]] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[...this];',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ThisExpression'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...x.list];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'list'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...x.list] = a;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 11,
                range: [0, 11],
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 10,
                    range: [1, 10],
                    argument: {
                      type: 'MemberExpression',
                      start: 4,
                      end: 10,
                      range: [4, 10],
                      object: {
                        type: 'Identifier',
                        start: 4,
                        end: 5,
                        range: [4, 5],
                        name: 'x'
                      },
                      property: {
                        type: 'Identifier',
                        start: 6,
                        end: 10,
                        range: [6, 10],
                        name: 'list'
                      },
                      computed: false
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 14,
                end: 15,
                range: [14, 15],
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[, x,,] = 0',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 7,
                range: [0, 7],
                elements: [
                  null,
                  {
                    type: 'Identifier',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    name: 'x'
                  },
                  null
                ]
              },
              right: {
                type: 'Literal',
                start: 10,
                end: 11,
                range: [10, 11],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...[x]] = 0',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 8,
                range: [0, 8],
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 7,
                    range: [1, 7],
                    argument: {
                      type: 'ArrayPattern',
                      start: 4,
                      end: 7,
                      range: [4, 7],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          name: 'x'
                        }
                      ]
                    }
                  }
                ]
              },
              right: {
                type: 'Literal',
                start: 11,
                end: 12,
                range: [11, 12],
                value: 0
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...{x = 1}] = [{}]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[...[x]] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[x, ...{0: y}] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Literal',
                            value: 0
                          },
                          value: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[x, x] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[(a)] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '({x} = 0)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[ x = "x" in {} ] = value;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Literal',
                        value: 'x'
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      operator: 'in'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'value'
              }
            }
          }
        ]
      }
    ],
    [
      'a = [ a = x += 1, b = x *= 2 ] = value;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '+=',
                        right: {
                          type: 'Literal',
                          value: 1
                        }
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '*=',
                        right: {
                          type: 'Literal',
                          value: 2
                        }
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'value'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '[{ x }] = [null];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: null
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[{ x }] = [ , ];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [null]
              }
            }
          }
        ]
      }
    ],
    [
      'a = [{ x = yield }] = value;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'yield'
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'value'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [[x[yield]]] = 123;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          computed: true,
                          property: {
                            type: 'Identifier',
                            name: 'yield'
                          }
                        }
                      ]
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: 123
                }
              }
            }
          }
        ]
      }
    ],
    [
      '[{ x }] = [];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      'a = [{ x }] =  [{ x: 2 }];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            value: 2
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [x.y] = [123];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 123
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      '[x, ...y] = [1, 2, 3];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 1
                  },
                  {
                    type: 'Literal',
                    value: 2
                  },
                  {
                    type: 'Literal',
                    value: 3
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[, ...x] = [1, 2, 3];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  null,
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 1
                  },
                  {
                    type: 'Literal',
                    value: 2
                  },
                  {
                    type: 'Literal',
                    value: 3
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'a = [x.y] = value;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'value'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [ x[yield] ] = [33];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 33
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...[x, y]] = [null];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'x'
                          },
                          {
                            type: 'Identifier',
                            name: 'y'
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: null
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...[x]] = [ , ];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'x'
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [null]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...{ 0: x, length }] = [undefined];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Literal',
                              value: 0
                            },
                            value: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'length'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'length'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'undefined'
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...x.y] = [4, 3, 2];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 4
                    },
                    {
                      type: 'Literal',
                      value: 3
                    },
                    {
                      type: 'Literal',
                      value: 2
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...[x[yield]]] = [2018];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'yield'
                            }
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 2018
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...{ 0: x, length }] = value;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Literal',
                              value: 0
                            },
                            value: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'length'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'length'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'value'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [...{ 1: x }] = [1, 2, 3];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Literal',
                              value: 1
                            },
                            value: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 2
                    },
                    {
                      type: 'Literal',
                      value: 3
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      '[,] = null;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [null]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: null
              }
            }
          }
        ]
      }
    ],
    [
      '[[x]] = [[1]];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Literal',
                        value: 1
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'a = [ x = yield ] = [];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      'result = [, x, , y, ,] = [1, 2, 3, 4, 5, 6];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'result'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    null,
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    null,
                    {
                      type: 'Identifier',
                      name: 'y'
                    },
                    null
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 2
                    },
                    {
                      type: 'Literal',
                      value: 3
                    },
                    {
                      type: 'Literal',
                      value: 4
                    },
                    {
                      type: 'Literal',
                      value: 5
                    },
                    {
                      type: 'Literal',
                      value: 6
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [ x = flag = true ] = [];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'flag'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: true
                        }
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [ a = x += 1, b = x *= 2 ] = [];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '+=',
                        right: {
                          type: 'Literal',
                          value: 1
                        }
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      right: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '*=',
                        right: {
                          type: 'Literal',
                          value: 2
                        }
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = [arguments = 4, eval = 5] = value;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'arguments'
                      },
                      right: {
                        type: 'Literal',
                        value: 4
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'eval'
                      },
                      right: {
                        type: 'Literal',
                        value: 5
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'value'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '[a,b=0,[c,...a[0]]={}]=0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    right: {
                      type: 'Literal',
                      value: 0
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'c'
                        },
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            computed: true,
                            property: {
                              type: 'Literal',
                              value: 0
                            }
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[a,a,,...a]=0;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  null,
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[{a=b}=0]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 0
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[a = 0, ...{b = 0}] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 0
                    }
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'b'
                            },
                            right: {
                              type: 'Literal',
                              value: 0
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[{a=0}, ...b] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            value: 0
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[x[a]=a] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[x.a=a] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[{a=0},{a=0}] = 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            value: 0
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            value: 0
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[...[...a[x]]] = 1',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'x'
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      'for([a,b[a],{c,d=e,[f]:[g,h().a,(0).k,...i[0]]}] in 0);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'ArrayPattern',
              elements: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  computed: true,
                  property: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'd'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'e'
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      value: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'g'
                          },
                          {
                            type: 'MemberExpression',
                            object: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'h'
                              },
                              arguments: []
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'a'
                            }
                          },
                          {
                            type: 'MemberExpression',
                            object: {
                              type: 'Literal',
                              value: 0
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'k'
                            }
                          },
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'i'
                              },
                              computed: true,
                              property: {
                                type: 'Literal',
                                value: 0
                              }
                            }
                          }
                        ]
                      },
                      kind: 'init',
                      computed: true,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            },
            right: {
              type: 'Literal',
              value: 0
            }
          }
        ]
      }
    ],
    [
      '[[[[[[[[[[[[[[[[[[[[{a=b[0]}]]]]]]]]]]]]]]]]]]]]=0;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'ArrayPattern',
                                    elements: [
                                      {
                                        type: 'ArrayPattern',
                                        elements: [
                                          {
                                            type: 'ArrayPattern',
                                            elements: [
                                              {
                                                type: 'ArrayPattern',
                                                elements: [
                                                  {
                                                    type: 'ArrayPattern',
                                                    elements: [
                                                      {
                                                        type: 'ArrayPattern',
                                                        elements: [
                                                          {
                                                            type: 'ArrayPattern',
                                                            elements: [
                                                              {
                                                                type: 'ArrayPattern',
                                                                elements: [
                                                                  {
                                                                    type: 'ArrayPattern',
                                                                    elements: [
                                                                      {
                                                                        type: 'ArrayPattern',
                                                                        elements: [
                                                                          {
                                                                            type: 'ArrayPattern',
                                                                            elements: [
                                                                              {
                                                                                type: 'ArrayPattern',
                                                                                elements: [
                                                                                  {
                                                                                    type: 'ArrayPattern',
                                                                                    elements: [
                                                                                      {
                                                                                        type: 'ArrayPattern',
                                                                                        elements: [
                                                                                          {
                                                                                            type: 'ArrayPattern',
                                                                                            elements: [
                                                                                              {
                                                                                                type: 'ObjectPattern',
                                                                                                properties: [
                                                                                                  {
                                                                                                    type: 'Property',
                                                                                                    key: {
                                                                                                      type: 'Identifier',
                                                                                                      name: 'a'
                                                                                                    },
                                                                                                    value: {
                                                                                                      type: 'AssignmentPattern',
                                                                                                      left: {
                                                                                                        type: 'Identifier',
                                                                                                        name: 'a'
                                                                                                      },
                                                                                                      right: {
                                                                                                        type: 'MemberExpression',
                                                                                                        object: {
                                                                                                          type: 'Identifier',
                                                                                                          name: 'b'
                                                                                                        },
                                                                                                        computed: true,
                                                                                                        property: {
                                                                                                          type: 'Literal',
                                                                                                          value: 0
                                                                                                        }
                                                                                                      }
                                                                                                    },
                                                                                                    kind: 'init',
                                                                                                    computed: false,
                                                                                                    method: false,
                                                                                                    shorthand: true
                                                                                                  }
                                                                                                ]
                                                                                              }
                                                                                            ]
                                                                                          }
                                                                                        ]
                                                                                      }
                                                                                    ]
                                                                                  }
                                                                                ]
                                                                              }
                                                                            ]
                                                                          }
                                                                        ]
                                                                      }
                                                                    ]
                                                                  }
                                                                ]
                                                              }
                                                            ]
                                                          }
                                                        ]
                                                      }
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x = 10 } = {} ]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[ { x : foo()[y] = 10 } = {} ]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'MemberExpression',
                            object: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'foo'
                              },
                              arguments: []
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'y'
                            }
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[ [ foo().x = 10 ] = {} ]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            arguments: []
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'x'
                          }
                        },
                        right: {
                          type: 'Literal',
                          value: 10
                        }
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, y, ...z = 1]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...z = 1]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function x([ a, b ]){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'function a([x, , [, z]]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  null,
                  {
                    type: 'ArrayPattern',
                    elements: [
                      null,
                      {
                        type: 'Identifier',
                        name: 'z'
                      }
                    ]
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      '[a,,b] = array;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  null,
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'array'
              }
            }
          }
        ]
      }
    ],
    [
      '[x = 10, y, z] = a;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  },
                  {
                    type: 'Identifier',
                    name: 'y'
                  },
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '[ok.v] = 20;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'ok'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'v'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 20
              }
            }
          }
        ]
      }
    ],
    [
      '([y]) => x;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'y'
                    }
                  ]
                }
              ],

              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '[{a = 0}] = [{}];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            value: 0
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[{a = 0}] = [{}];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Literal',
                            value: 0
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'function f([...[{a = 0}]]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              kind: 'init',
                              key: {
                                type: 'Identifier',
                                name: 'a'
                              },
                              computed: false,
                              value: {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'Literal',
                                  value: 0
                                }
                              },
                              method: false,
                              shorthand: true
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'h = ([...[{a = 0}]]) => {};',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'h'
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'a'
                                  },
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'a'
                                    },
                                    right: {
                                      type: 'Literal',
                                      value: 0
                                    }
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: true
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  }
                ],

                async: false,
                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      'function f1({a} = {a:1}, b, [c] = [2]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        value: 1
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              },
              {
                type: 'Identifier',
                name: 'b'
              },
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 2
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f1'
            }
          }
        ]
      }
    ],
    [
      '[arguments] = []',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'arguments'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      '[...{a}] = [{}];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: []
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    properties: [
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'z'
                                        },
                                        value: {
                                          type: 'AssignmentPattern',
                                          left: {
                                            type: 'Identifier',
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            value: 1
                                          }
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: true
                                      }
                                    ]
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                },
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'z1'
                                  },
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'z1'
                                    },
                                    right: {
                                      type: 'Literal',
                                      value: 2
                                    }
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: true
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x2'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x2'
                          },
                          right: {
                            type: 'Literal',
                            value: 3
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'ObjectPattern',
                                    properties: [
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'z3'
                                        },
                                        value: {
                                          type: 'AssignmentPattern',
                                          left: {
                                            type: 'Identifier',
                                            name: 'z3'
                                          },
                                          right: {
                                            type: 'Literal',
                                            value: 4
                                          }
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: true
                                      }
                                    ]
                                  }
                                ]
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    properties: []
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ObjectExpression',
                    properties: []
                  },
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayExpression',
                                elements: [
                                  {
                                    type: 'ObjectExpression',
                                    properties: []
                                  }
                                ]
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[[ x ]] = [ , ];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [null]
              }
            }
          }
        ]
      }
    ],
    [
      '[[ x ]] = [undefined];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'undefined'
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[[ x ]] = [null];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: null
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[...[a] = 1]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...[ x = 5 ] ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 5
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'function foo([x] = [1]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'function foo([x = 1] = [2]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Literal',
                        value: 1
                      }
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 2
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      '[.../x/]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Literal',
                    value: /x/,
                    regex: {
                      pattern: 'x',
                      flags: ''
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[.../x/+y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: /x/,
                      regex: {
                        pattern: 'x',
                        flags: ''
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '+'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[.../x//y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: /x/,
                      regex: {
                        pattern: 'x',
                        flags: ''
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '/'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[.../x/g/y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: /x/g,
                      regex: {
                        pattern: 'x',
                        flags: 'g'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '/'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function foo([{y1:y1 = 1} = {y1:2}] = [{y1:3}]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'y1'
                            },
                            computed: false,
                            value: {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'y1'
                              },
                              right: {
                                type: 'Literal',
                                value: 1
                              }
                            },
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y1'
                            },
                            value: {
                              type: 'Literal',
                              value: 2
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y1'
                          },
                          value: {
                            type: 'Literal',
                            value: 3
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      '[...[...[...a]]] = [[[]]];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'RestElement',
                                argument: {
                                  type: 'Identifier',
                                  name: 'a'
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'ArrayExpression',
                        elements: []
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x; [{ x = 10 } = {}]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'x'
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...[a].b1] = 3',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'a'
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'b1'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 3
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x : foo().y } ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            arguments: []
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x : foo()[y] } ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            arguments: []
                          },
                          computed: true,
                          property: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x : x.y } ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ x ] ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ foo().x ] ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          arguments: []
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ foo()[x] ] ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          arguments: []
                        },
                        computed: true,
                        property: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ x.y ] ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ x[y] ] ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: true,
                        property: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ x = 10 ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ foo().x = 10 ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: []
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ foo()[x] = 10 ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ x.y = 10 ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ x[y] = 10 ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Literal',
                      value: 10
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x = 10 } = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'Literal',
                              value: 10
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x : y = 10 } = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            right: {
                              type: 'Literal',
                              value: 10
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x : foo().y = 10 } = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'Identifier',
                                  name: 'foo'
                                },
                                arguments: []
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'y'
                              }
                            },
                            right: {
                              type: 'Literal',
                              value: 10
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ { x : foo()[y] = 10 } = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'Identifier',
                                  name: 'foo'
                                },
                                arguments: []
                              },
                              computed: true,
                              property: {
                                type: 'Identifier',
                                name: 'y'
                              }
                            },
                            right: {
                              type: 'Literal',
                              value: 10
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ x = 10 ] = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[[y] = /a/ ]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'y'
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: /a/,
                    regex: {
                      pattern: 'a',
                      flags: ''
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[{y} = /a/ ]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: /a/,
                    regex: {
                      pattern: 'a',
                      flags: ''
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[ [ foo()[x] = 10 ] = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'MemberExpression',
                            object: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'foo'
                              },
                              arguments: []
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'x'
                            }
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ [ x.y = 10 ] = {} ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'y'
                            }
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[x,y,z] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    name: 'y'
                  },
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[x, y = 42, z] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    right: {
                      type: 'Literal',
                      value: 42
                    }
                  },
                  {
                    type: 'Identifier',
                    name: 'z'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[{x:x = 1, y:y = 2}, [z = 3, z = 4, z = 5]] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            value: 1
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Literal',
                            value: 2
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        right: {
                          type: 'Literal',
                          value: 3
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        right: {
                          type: 'Literal',
                          value: 4
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        right: {
                          type: 'Literal',
                          value: 5
                        }
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[(x)] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[((x, y) => z).x] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'Identifier',
                        name: 'z'
                      },
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        },
                        {
                          type: 'Identifier',
                          name: 'y'
                        }
                      ],

                      async: false,
                      expression: true
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[((x, y) => z)["x"]] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'Identifier',
                        name: 'z'
                      },
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        },
                        {
                          type: 'Identifier',
                          name: 'y'
                        }
                      ],

                      async: false,
                      expression: true
                    },
                    computed: true,
                    property: {
                      type: 'Literal',
                      value: 'x'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ ...(a) ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ ...(foo.bar) ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ (foo.bar) ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[ (foo["bar"]) ] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    property: {
                      type: 'Literal',
                      value: 'bar'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[[].length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrayExpression',
                      elements: []
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[[x].length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ]
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[{}.length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ObjectExpression',
                      properties: []
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[{x: y}.length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[...true]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Literal',
                    value: true
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[..."f".toString()]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 'f'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'toString'
                      }
                    },
                    arguments: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...50]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Literal',
                    value: 50
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[..."foo"]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Literal',
                    value: 'foo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[..."foo".bar]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...(x)]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...(x,y)]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      },
                      {
                        type: 'Identifier',
                        name: 'y'
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[..."x".y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 'x'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(x|y)^y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '|'
              },
              right: {
                type: 'Identifier',
                name: 'y'
              },
              operator: '^'
            }
          }
        ]
      }
    ],
    [
      '[...{a = b}] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'b'
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[..."x" + y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    operator: '+'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[[ x ]] = [];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      '[]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ]
      }
    ],
    [
      '[1,2,3,4,5]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
                },
                {
                  type: 'Literal',
                  value: 3
                },
                {
                  type: 'Literal',
                  value: 4
                },
                {
                  type: 'Literal',
                  value: 5
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [null]
            }
          }
        ]
      }
    ],
    [
      '[,a,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                null,
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[a,,,,,,,,,b]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[[[[z++]]]]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'UpdateExpression',
                              argument: {
                                type: 'Identifier',
                                name: 'z'
                              },
                              operator: '++',
                              prefix: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'array[1] === 2',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'array'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 1
                }
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '==='
            }
          }
        ]
      }
    ],
    [
      '[1, 2, 3, ...[]]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
                },
                {
                  type: 'Literal',
                  value: 3
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[1, 2, ...target = source]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 1
                },
                {
                  type: 'Literal',
                  value: 2
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'target'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'source'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[5, ...[6, 7, 8], 9]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 5
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Literal',
                        value: 6
                      },
                      {
                        type: 'Literal',
                        value: 7
                      },
                      {
                        type: 'Literal',
                        value: 8
                      }
                    ]
                  }
                },
                {
                  type: 'Literal',
                  value: 9
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[() => {}]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [],

                  async: false,
                  expression: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[abc => {}]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'abc'
                    }
                  ],

                  async: false,
                  expression: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[,,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [null, null]
            }
          }
        ]
      }
    ],
    [
      '[x,,,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                null,
                null
              ]
            }
          }
        ]
      }
    ],
    [
      '[x,,y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                null,
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[this];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ThisExpression'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[,,,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [null, null, null]
            }
          }
        ]
      }
    ],
    [
      '[,,x]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                null,
                null,
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[this];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ThisExpression'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, y, ...z]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'z'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x.y] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x().y] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      arguments: []
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[a[x.y]] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: true,
                    property: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x()[y]] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      arguments: []
                    },
                    computed: true,
                    property: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x.y = a] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x().y = a] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        arguments: []
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[a[x.y] = a] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: true,
                      property: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x()[y] = a ] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x.y = a + b] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: '+'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x().y = a + b] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        arguments: []
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: '+'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[a[x.y] = a + b] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: true,
                      property: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'y'
                        }
                      }
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: '+'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[x()[y] = a + b] = z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        arguments: []
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    },
                    right: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: '+'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '[function(){}.length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[5..length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 5
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '["X".length] = x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 'X'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'length'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '[{}.x] = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ObjectExpression',
                      properties: []
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '[{}[x]] = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'ObjectExpression',
                      properties: []
                    },
                    computed: true,
                    property: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      '[x, y, ...z]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'z'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      ' [...target = source]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'target'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'source'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, ...y, z]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'y'
                  }
                },
                {
                  type: 'Identifier',
                  name: 'z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, y, ...z = arr]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'arr'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, y, ...z()]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    arguments: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, y, ...z + arr]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'arr'
                    },
                    operator: '+'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, ...z = arr, y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'arr'
                    }
                  }
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, ...z(), y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    arguments: []
                  }
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x, ...z + arr, y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'arr'
                    },
                    operator: '+'
                  }
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[foo = A] = arr;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'A'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'arr'
              }
            }
          }
        ]
      }
    ],
    [
      '[foo, bar] = arr;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  {
                    type: 'Identifier',
                    name: 'bar'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'arr'
              }
            }
          }
        ]
      }
    ],
    [
      '[foo = A, bar = B] = arr;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'A'
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'arr'
              }
            }
          }
        ]
      }
    ],
    [
      '[foo, [x,y,z], bar = B] = arr;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      },
                      {
                        type: 'Identifier',
                        name: 'y'
                      },
                      {
                        type: 'Identifier',
                        name: 'z'
                      }
                    ]
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'arr'
              }
            }
          }
        ]
      }
    ],
    [
      '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'ArrayPattern',
                                    elements: [
                                      {
                                        type: 'ArrayPattern',
                                        elements: [
                                          {
                                            type: 'ArrayPattern',
                                            elements: [
                                              {
                                                type: 'ArrayPattern',
                                                elements: [
                                                  {
                                                    type: 'ArrayPattern',
                                                    elements: [
                                                      {
                                                        type: 'ArrayPattern',
                                                        elements: [
                                                          {
                                                            type: 'ArrayPattern',
                                                            elements: [
                                                              {
                                                                type: 'ArrayPattern',
                                                                elements: [
                                                                  {
                                                                    type: 'ArrayPattern',
                                                                    elements: [
                                                                      {
                                                                        type: 'Identifier',
                                                                        name: 'x'
                                                                      },
                                                                      {
                                                                        type: 'Identifier',
                                                                        name: 'y'
                                                                      },
                                                                      {
                                                                        type: 'Identifier',
                                                                        name: 'z'
                                                                      }
                                                                    ]
                                                                  }
                                                                ]
                                                              }
                                                            ]
                                                          }
                                                        ]
                                                      }
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'arr'
              }
            }
          }
        ]
      }
    ],
    [
      '[foo, [x,y = 20,z], bar = B] = arr;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        right: {
                          type: 'Literal',
                          value: 20
                        }
                      },
                      {
                        type: 'Identifier',
                        name: 'z'
                      }
                    ]
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'arr'
              }
            }
          }
        ]
      }
    ],
    [
      'foo([a, b] = arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'arr'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...x.list];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'list'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...x.list] = a;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'list'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'a'
              }
            }
          }
        ]
      }
    ],
    [
      '[...x = y];',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...x += y];',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              elements: [
                {
                  type: 'SpreadElement',
                  start: 1,
                  end: 10,
                  range: [1, 10],
                  argument: {
                    type: 'AssignmentExpression',
                    start: 4,
                    end: 10,
                    range: [4, 10],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...[x].map(y, z)];',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              elements: [
                {
                  type: 'SpreadElement',
                  start: 1,
                  end: 17,
                  range: [1, 17],
                  argument: {
                    type: 'CallExpression',
                    start: 4,
                    end: 17,
                    range: [4, 17],
                    callee: {
                      type: 'MemberExpression',
                      start: 4,
                      end: 11,
                      range: [4, 11],
                      object: {
                        type: 'ArrayExpression',
                        start: 4,
                        end: 7,
                        range: [4, 7],
                        elements: [
                          {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            range: [5, 6],
                            name: 'x'
                          }
                        ]
                      },
                      property: {
                        type: 'Identifier',
                        start: 8,
                        end: 11,
                        range: [8, 11],
                        name: 'map'
                      },
                      computed: false
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        range: [12, 13],
                        name: 'y'
                      },
                      {
                        type: 'Identifier',
                        start: 15,
                        end: 16,
                        range: [15, 16],
                        name: 'z'
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...[x].map(y, z)[x]] = a;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 25,
              range: [0, 25],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 21,
                range: [0, 21],
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 20,
                    range: [1, 20],
                    argument: {
                      type: 'MemberExpression',
                      start: 4,
                      end: 20,
                      range: [4, 20],
                      object: {
                        type: 'CallExpression',
                        start: 4,
                        end: 17,
                        range: [4, 17],
                        callee: {
                          type: 'MemberExpression',
                          start: 4,
                          end: 11,
                          range: [4, 11],
                          object: {
                            type: 'ArrayExpression',
                            start: 4,
                            end: 7,
                            range: [4, 7],
                            elements: [
                              {
                                type: 'Identifier',
                                start: 5,
                                end: 6,
                                range: [5, 6],
                                name: 'x'
                              }
                            ]
                          },
                          property: {
                            type: 'Identifier',
                            start: 8,
                            end: 11,
                            range: [8, 11],
                            name: 'map'
                          },
                          computed: false
                        },
                        arguments: [
                          {
                            type: 'Identifier',
                            start: 12,
                            end: 13,
                            range: [12, 13],
                            name: 'y'
                          },
                          {
                            type: 'Identifier',
                            start: 15,
                            end: 16,
                            range: [15, 16],
                            name: 'z'
                          }
                        ]
                      },
                      property: {
                        type: 'Identifier',
                        start: 18,
                        end: 19,
                        range: [18, 19],
                        name: 'x'
                      },
                      computed: true
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 24,
                end: 25,
                range: [24, 25],
                name: 'a'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x, [foo, bar] = doo',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  start: 3,
                  end: 19,
                  range: [3, 19],
                  operator: '=',
                  left: {
                    type: 'ArrayPattern',
                    start: 3,
                    end: 13,
                    range: [3, 13],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 4,
                        end: 7,
                        range: [4, 7],
                        name: 'foo'
                      },
                      {
                        type: 'Identifier',
                        start: 9,
                        end: 12,
                        range: [9, 12],
                        name: 'bar'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 16,
                    end: 19,
                    range: [16, 19],
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x, [foo = y, bar] = doo',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  start: 3,
                  end: 23,
                  range: [3, 23],
                  operator: '=',
                  left: {
                    type: 'ArrayPattern',
                    start: 3,
                    end: 17,
                    range: [3, 17],
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 4,
                        end: 11,
                        range: [4, 11],
                        left: {
                          type: 'Identifier',
                          start: 4,
                          end: 7,
                          range: [4, 7],
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'y'
                        }
                      },
                      {
                        type: 'Identifier',
                        start: 13,
                        end: 16,
                        range: [13, 16],
                        name: 'bar'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 20,
                    end: 23,
                    range: [20, 23],
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = [a, b] = y',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'AssignmentExpression',
                start: 4,
                end: 14,
                range: [4, 14],
                operator: '=',
                left: {
                  type: 'ArrayPattern',
                  start: 4,
                  end: 10,
                  range: [4, 10],
                  elements: [
                    {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'b'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  name: 'y'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a, b] = c = d',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 6,
                range: [0, 6],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    range: [4, 5],
                    name: 'b'
                  }
                ]
              },
              right: {
                type: 'AssignmentExpression',
                start: 9,
                end: 14,
                range: [9, 14],
                operator: '=',
                left: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  name: 'd'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[[foo].length] = x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 14,
                range: [0, 14],
                elements: [
                  {
                    type: 'MemberExpression',
                    start: 1,
                    end: 13,
                    range: [1, 13],
                    object: {
                      type: 'ArrayExpression',
                      start: 1,
                      end: 6,
                      range: [1, 6],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 2,
                          end: 5,
                          range: [2, 5],
                          name: 'foo'
                        }
                      ]
                    },
                    property: {
                      type: 'Identifier',
                      start: 7,
                      end: 13,
                      range: [7, 13],
                      name: 'length'
                    },
                    computed: false
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x, y]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        range: [0, 6],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            range: [0, 6],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 6,
              range: [0, 6],
              elements: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'y'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x = y]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 7,
        range: [0, 7],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 7,
            range: [0, 7],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 7,
              range: [0, 7],
              elements: [
                {
                  type: 'AssignmentExpression',
                  start: 1,
                  end: 6,
                  range: [1, 6],
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'y'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x.y]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        range: [0, 5],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 5,
            range: [0, 5],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 5,
              range: [0, 5],
              elements: [
                {
                  type: 'MemberExpression',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  object: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  property: {
                    type: 'Identifier',
                    start: 3,
                    end: 4,
                    range: [3, 4],
                    name: 'y'
                  },
                  computed: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[]',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [null]
            }
          }
        ]
      }
    ],
    [
      '[,,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [null, null]
            }
          }
        ]
      }
    ],
    [
      '[x,]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[x,,,]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        range: [0, 6],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            range: [0, 6],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 6,
              range: [0, 6],
              elements: [
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  name: 'x'
                },
                null,
                null
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x,,y]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                null,
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[foo = A] = arr;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 9,
                range: [0, 9],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    left: {
                      type: 'Identifier',
                      start: 1,
                      end: 4,
                      range: [1, 4],
                      name: 'foo'
                    },
                    right: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'A'
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 12,
                end: 15,
                range: [12, 15],
                name: 'arr'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[foo, bar] = arr;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 10,
                range: [0, 10],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    name: 'foo'
                  },
                  {
                    type: 'Identifier',
                    start: 6,
                    end: 9,
                    range: [6, 9],
                    name: 'bar'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 13,
                end: 16,
                range: [13, 16],
                name: 'arr'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[foo = A, bar = B] = arr;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 24,
              range: [0, 24],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 18,
                range: [0, 18],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    left: {
                      type: 'Identifier',
                      start: 1,
                      end: 4,
                      range: [1, 4],
                      name: 'foo'
                    },
                    right: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'A'
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    start: 10,
                    end: 17,
                    range: [10, 17],
                    left: {
                      type: 'Identifier',
                      start: 10,
                      end: 13,
                      range: [10, 13],
                      name: 'bar'
                    },
                    right: {
                      type: 'Identifier',
                      start: 16,
                      end: 17,
                      range: [16, 17],
                      name: 'B'
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 21,
                end: 24,
                range: [21, 24],
                name: 'arr'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x &= 42]',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 9,
        range: [0, 9],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 9,
              range: [0, 9],
              elements: [
                {
                  type: 'AssignmentExpression',
                  start: 1,
                  end: 8,
                  range: [1, 8],
                  operator: '&=',
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    start: 6,
                    end: 8,
                    range: [6, 8],
                    value: 42,
                    raw: '42'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a = 2]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 2
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[await = x] = x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 11,
                range: [0, 11],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 10,
                    range: [1, 10],
                    left: {
                      type: 'Identifier',
                      start: 1,
                      end: 6,
                      range: [1, 6],
                      name: 'await'
                    },
                    right: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'x'
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 14,
                end: 15,
                range: [14, 15],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[await = x]',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    name: 'await'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '["x".foo]=x',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 9,
                range: [0, 9],
                elements: [
                  {
                    type: 'MemberExpression',
                    start: 1,
                    end: 8,
                    range: [1, 8],
                    object: {
                      type: 'Literal',
                      start: 1,
                      end: 4,
                      range: [1, 4],
                      value: 'x',
                      raw: '"x"'
                    },
                    property: {
                      type: 'Identifier',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      name: 'foo'
                    },
                    computed: false
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 10,
                end: 11,
                range: [10, 11],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[x.y = z]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        range: [0, 9],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 9,
              range: [0, 9],
              elements: [
                {
                  type: 'AssignmentExpression',
                  start: 1,
                  end: 8,
                  range: [1, 8],
                  operator: '=',
                  left: {
                    type: 'MemberExpression',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    object: {
                      type: 'Identifier',
                      start: 1,
                      end: 2,
                      range: [1, 2],
                      name: 'x'
                    },
                    property: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'y'
                    },
                    computed: false
                  },
                  right: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'z'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a,b=[x,y]] = z',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 11,
                range: [0, 11],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  {
                    type: 'AssignmentPattern',
                    start: 3,
                    end: 10,
                    range: [3, 10],
                    left: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'b'
                    },
                    right: {
                      type: 'ArrayExpression',
                      start: 5,
                      end: 10,
                      range: [5, 10],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 6,
                          end: 7,
                          range: [6, 7],
                          name: 'x'
                        },
                        {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          range: [8, 9],
                          name: 'y'
                        }
                      ]
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 14,
                end: 15,
                range: [14, 15],
                name: 'z'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(foo, [bar, baz] = doo);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      {
                        type: 'Identifier',
                        name: 'baz'
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[a, {b:d}, c] = obj',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 13,
                range: [0, 13],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 8,
                        range: [5, 8],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          name: 'b'
                        },
                        value: {
                          type: 'Identifier',
                          start: 7,
                          end: 8,
                          range: [7, 8],
                          name: 'd'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    name: 'c'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 16,
                end: 19,
                range: [16, 19],
                name: 'obj'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a, {[b]:d}, c] = obj',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 21,
            range: [0, 21],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 21,
              range: [0, 21],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 15,
                range: [0, 15],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 11,
                    range: [4, 11],
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 10,
                        range: [5, 10],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 6,
                          end: 7,
                          range: [6, 7],
                          name: 'b'
                        },
                        value: {
                          type: 'Identifier',
                          start: 9,
                          end: 10,
                          range: [9, 10],
                          name: 'd'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'Identifier',
                    start: 13,
                    end: 14,
                    range: [13, 14],
                    name: 'c'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 18,
                end: 21,
                range: [18, 21],
                name: 'obj'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[please, {[make]: it}, stop] = bwahahahaha',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 42,
        range: [0, 42],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 42,
            range: [0, 42],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 42,
              range: [0, 42],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 28,
                range: [0, 28],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 7,
                    range: [1, 7],
                    name: 'please'
                  },
                  {
                    type: 'ObjectPattern',
                    start: 9,
                    end: 21,
                    range: [9, 21],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 20,
                        range: [10, 20],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 11,
                          end: 15,
                          range: [11, 15],
                          name: 'make'
                        },
                        value: {
                          type: 'Identifier',
                          start: 18,
                          end: 20,
                          range: [18, 20],
                          name: 'it'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'Identifier',
                    start: 23,
                    end: 27,
                    range: [23, 27],
                    name: 'stop'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 31,
                end: 42,
                range: [31, 42],
                name: 'bwahahahaha'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[pweeze = [pretty] = please, {[make]: it}, stop] = bwahahahaha',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 62,
        range: [0, 62],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 62,
            range: [0, 62],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 62,
              range: [0, 62],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 48,
                range: [0, 48],
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 1,
                    end: 27,
                    range: [1, 27],
                    left: {
                      type: 'Identifier',
                      start: 1,
                      end: 7,
                      range: [1, 7],
                      name: 'pweeze'
                    },
                    right: {
                      type: 'AssignmentExpression',
                      start: 10,
                      end: 27,
                      range: [10, 27],
                      operator: '=',
                      left: {
                        type: 'ArrayPattern',
                        start: 10,
                        end: 18,
                        range: [10, 18],
                        elements: [
                          {
                            type: 'Identifier',
                            start: 11,
                            end: 17,
                            range: [11, 17],
                            name: 'pretty'
                          }
                        ]
                      },
                      right: {
                        type: 'Identifier',
                        start: 21,
                        end: 27,
                        range: [21, 27],
                        name: 'please'
                      }
                    }
                  },
                  {
                    type: 'ObjectPattern',
                    start: 29,
                    end: 41,
                    range: [29, 41],
                    properties: [
                      {
                        type: 'Property',
                        start: 30,
                        end: 40,
                        range: [30, 40],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 31,
                          end: 35,
                          range: [31, 35],
                          name: 'make'
                        },
                        value: {
                          type: 'Identifier',
                          start: 38,
                          end: 40,
                          range: [38, 40],
                          name: 'it'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'Identifier',
                    start: 43,
                    end: 47,
                    range: [43, 47],
                    name: 'stop'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 51,
                end: 62,
                range: [51, 62],
                name: 'bwahahahaha'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'log({foo: [bar]});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'log'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 4,
                  end: 16,
                  range: [4, 16],
                  properties: [
                    {
                      type: 'Property',
                      start: 5,
                      end: 15,
                      range: [5, 15],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 5,
                        end: 8,
                        range: [5, 8],
                        name: 'foo'
                      },
                      value: {
                        type: 'ArrayExpression',
                        start: 10,
                        end: 15,
                        range: [10, 15],
                        elements: [
                          {
                            type: 'Identifier',
                            start: 11,
                            end: 14,
                            range: [11, 14],
                            name: 'bar'
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'log({foo: [bar]} = obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'log'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 4,
                  end: 22,
                  range: [4, 22],
                  operator: '=',
                  left: {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 16,
                    range: [4, 16],
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 15,
                        range: [5, 15],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 5,
                          end: 8,
                          range: [5, 8],
                          name: 'foo'
                        },
                        value: {
                          type: 'ArrayPattern',
                          start: 10,
                          end: 15,
                          range: [10, 15],
                          elements: [
                            {
                              type: 'Identifier',
                              start: 11,
                              end: 14,
                              range: [11, 14],
                              name: 'bar'
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 19,
                    end: 22,
                    range: [19, 22],
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...{a = b} = c];',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              elements: [
                {
                  type: 'SpreadElement',
                  start: 1,
                  end: 15,
                  range: [1, 15],
                  argument: {
                    type: 'AssignmentExpression',
                    start: 4,
                    end: 15,
                    range: [4, 15],
                    operator: '=',
                    left: {
                      type: 'ObjectPattern',
                      start: 4,
                      end: 11,
                      range: [4, 11],
                      properties: [
                        {
                          type: 'Property',
                          start: 5,
                          end: 10,
                          range: [5, 10],
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            range: [5, 6],
                            name: 'a'
                          },
                          kind: 'init',
                          value: {
                            type: 'AssignmentPattern',
                            start: 5,
                            end: 10,
                            range: [5, 10],
                            left: {
                              type: 'Identifier',
                              start: 5,
                              end: 6,
                              range: [5, 6],
                              name: 'a'
                            },
                            right: {
                              type: 'Identifier',
                              start: 9,
                              end: 10,
                              range: [9, 10],
                              name: 'b'
                            }
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'c'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[a, {b}, c] = obj',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 11,
                range: [0, 11],
                elements: [
                  {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'a'
                  },
                  {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 7,
                    range: [4, 7],
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          name: 'b'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          range: [5, 6],
                          name: 'b'
                        }
                      }
                    ]
                  },
                  {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'c'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 14,
                end: 17,
                range: [14, 17],
                name: 'obj'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[z++]',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        range: [0, 5],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 5,
            range: [0, 5],
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 5,
              range: [0, 5],
              elements: [
                {
                  type: 'UpdateExpression',
                  start: 1,
                  end: 4,
                  range: [1, 4],
                  operator: '++',
                  prefix: false,
                  argument: {
                    type: 'Identifier',
                    start: 1,
                    end: 2,
                    range: [1, 2],
                    name: 'z'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
