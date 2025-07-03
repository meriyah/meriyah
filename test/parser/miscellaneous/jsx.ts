import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Miscellaneous - JSX', () => {
  for (const arg of [
    '<Component {...x}></Component>;',
    '<Component.Test />;',
    '<div>{...this.props.children}</div>;',
    '{foo && <Something foo={foo} /> }',
    '<Component:Test />;',
    '<Component.Test />;',
    outdent`
      <></>;

      <
      >
        text
      </>;
    `,
    '<div>{this.props.children}</div>;',
    '<a>{}</a>;',
    '<p>{1/2}</p>',
    '<p>{/w/.test(s)}</p>',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { jsx: true, next: true });
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { jsx: true, next: true, webcompat: true });
      });
    });
  }

  fail('Miscellaneous - JSX (fail)', [
    '<',
    '<foo',
    '>',
    '<>',
    '< >',
    '</>',
    '<><//>',
    { code: '<', options: { jsx: true } },
    { code: '>', options: { jsx: true } },
    { code: '<>', options: { jsx: true } },
    { code: '< >', options: { jsx: true } },
    { code: '</>', options: { jsx: true } },
    { code: '<><//>', options: { jsx: true } },
    { code: '<p>', options: { jsx: true } },
    { code: '<p></q>', options: { jsx: true } },
    { code: '<p></>', options: { jsx: true } },
    { code: '<p><q></p>', options: { jsx: true } },
    { code: '<1/>', options: { jsx: true } },
    { code: '<div id={}></div>', options: { jsx: true } },
    { code: '<div>one</div><div>two</div>', options: { jsx: true } },
    { code: '</>', options: { jsx: true } },
    { code: '<a/!', options: { jsx: true } },
    { code: '<img src={}>', options: { jsx: true } },
    { code: '<a b=: />', options: { jsx: true } },
    { code: '<xyz. />', options: { jsx: true } },
    { code: '<.abc />', options: { jsx: true } },
    { code: '<Foo></Bar>', options: { jsx: true } },
    { code: '<dd><e></e></dddd>;', options: { jsx: true } },
    { code: '<{...b} {...a }>{...b}</{...b}>', options: { jsx: true } },
    { code: '<f><g/></ff>;', options: { jsx: true } },
    { code: '<:path />', options: { jsx: true } },
    { code: '<path></svg:path>', options: { jsx: true } },
    { code: '<foo.bar></foo.baz>', options: { jsx: true } },
    { code: '<chinese:alladinfoo.bar></foo.baz>', options: { jsx: true } },
    { code: '<foo:bar></foo.baz>', options: { jsx: true } },
    { code: '<foo:bar.baz></foo.baz:bar>', options: { jsx: true } },
    { code: '<foo.bar></foo.baz>', options: { jsx: true } },
    { code: 'var x = <div>one</div> /* intervening comment */ <div>two</div>;', options: { jsx: true } },
    { code: '<tag className=></tag>', options: { jsx: true } },
    { code: '<tag ${"className"}="tag"></tag>', options: { jsx: true } },
    { code: '<a: />;', options: { jsx: true } },
    { code: '<:a />;', options: { jsx: true } },
    { code: '<a></b>', options: { jsx: true } },
    { code: '<a foo="bar;', options: { jsx: true } },
    { code: '<a:b></b>;', options: { jsx: true } },
    { code: '<a.b:c></a.b:c>;', options: { jsx: true } },
    { code: '<a[foo]></a[foo]>;', options: { jsx: true } },
    { code: '<a["foo"]></a["foo"]>;', options: { jsx: true } },
    { code: '<a b={}>;', options: { jsx: true } },
    { code: 'var x = <div>one</div><div>two</div>;', options: { jsx: true } },
    { code: '<div {props} />;', options: { jsx: true } },
    { code: '<div {...props}>stuff</div {...props}>;', options: { jsx: true } },
    { code: '<a>></a>;', options: { jsx: true } },
    { code: '<a b=}>;', options: { jsx: true } },
    { code: ' > ;', options: { jsx: true } },
    { code: '<a>;</>;', options: { jsx: true } },
    { code: '<a b></b>;', options: { jsx: true } },
    { code: '<a.b.c></a>;', options: { jsx: true } },
    { code: ' < .a > ;', options: { jsx: true } },
    { code: 'a > ;', options: { jsx: true } },
    { code: '[foo] > ;', options: { jsx: true } },
    { code: '<.a></.a>', options: { jsx: true } },
    { code: '<a.></a.>', options: { jsx: true } },
    { code: '<div className"app">', options: { jsx: true } },
    { code: '<div {props} />', options: { jsx: true } },
    { code: '<a>></a>', options: { jsx: true } },
    { code: '<div {...props}>stuff</div {...props}>', options: { jsx: true } },
    { code: '<a><</a>', options: { jsx: true } },
    { code: '[foo] > ;', options: { jsx: true } },
    { code: '[foo] > ;', options: { jsx: true } },
    { code: '[foo] > ;', options: { jsx: true } },
    { code: '[foo] > ;', options: { jsx: true } },
    { code: 'var x = <div>one</div>, <div>two</div>;', options: { jsx: true } },
    { code: '<p>{/}</p>', options: { jsx: true } },
    { code: '<div=""></div>', options: { jsx: true } },
    { code: '<div =""></div>', options: { jsx: true } },
    { code: '<div=1></div>', options: { jsx: true } },
    { code: '<div=div></div>', options: { jsx: true } },
    { code: '<div=/>', options: { jsx: true } },
    { code: '<div=-/>', options: { jsx: true } },
    { code: '<div=/>', options: { jsx: true } },
    { code: '<div =/>', options: { jsx: true } },
    { code: '<div=+-%&([)]}.../>', options: { jsx: true } },
  ]);

  pass('Miscellaneous - JSX (pass)', [
    { code: '<!--ccc-->', options: { jsx: true } },
    {
      code: outdent`
        class Columns extends React.Component {
          render() {
            return (
              <>
                <td>Hello</td>
                <td>World</td>
              </>
            );
          }
        }
      `,
      options: { jsx: true, ranges: true, loc: true },
    },
    { code: '<div>{111}</div>', options: { jsx: true, ranges: true } },
    { code: '<div></div>', options: { jsx: true, ranges: true } },
    { code: '<div {...[<div/>]} />', options: { jsx: true, ranges: true } },
    { code: '<div >{111}</div>', options: { jsx: true } },
    { code: '<div >xxx{111}xxx{222}</div>', options: { jsx: true, ranges: true } },
    {
      code: '<div >xxx{function(){return <div id={aaa}>111</div>}}xxx{222}</div>',
      options: { jsx: true, ranges: true },
    },
    { code: '<ul><li>111</li><li>222</li><li>333</li><li>444</li></ul>', options: { jsx: true, ranges: true } },
    {
      code: '<div id="复杂结构">xxx{function(){return <div id={aaa}>111</div>}}xxx{222}</div>',
      options: { jsx: true },
    },
    { code: '<ul>  <li>  </li> <li>x</li> </ul>', options: { jsx: true } },
    {
      code: '<option><b>dddd</b><script>333</script><xmp>eee</xmp><template>eeeee</template></option>',
      options: { jsx: true },
    },
    { code: '<div id={aa} class="className" > t </div>', options: { jsx: true, ranges: true, loc: true, raw: true } },
    { code: '<div id={function(){ return <div/> }} class="className"><p>xxx</p></div>', options: { jsx: true } },
    { code: '<div id={aa} title={ bb } {...{a:1}} class="className" ></div>', options: { jsx: true } },
    { code: '<X prop="2"><Y /><Z /></X>', options: { jsx: true } },
    { code: '<X>{a} {b}</X>', options: { jsx: true } },
    { code: '<X data-prop={x ? <Y prop={2} /> : <Z>\n</Z>}></X>', options: { jsx: true } },
    { code: '/** @jsx CUSTOM_DOM */<a></a>', options: { jsx: true } },
    {
      code: outdent`
        import React from 'react'
        const Component = () => (
          <div>Hello, World</div>
        )
      `,
      options: { jsx: true, sourceType: 'module' },
    },
    {
      code: outdent`
        <Basic>
          <BasicChild>
            <BasicChild>
              <BasicChild>
                Title 2
              </BasicChild>
            </BasicChild>
          </BasicChild>
        </Basic>
      `,
      options: { jsx: true, sourceType: 'module' },
    },
    {
      code: outdent`
        <div>
          one
          <div>
            two
            <span>
              three
            </span>
          </div>
        </div>
      `,
      options: { jsx: true },
    },
    { code: '<>Fragment</>', options: { jsx: true } },
    { code: '<p>hello,world</p>', options: { jsx: true } },
    { code: '<></>', options: { jsx: true, ranges: true } },
    { code: '<    ></   >', options: { jsx: true, ranges: true } },
    { code: '< /*starting wrap*/ ></ /*ending wrap*/>;', options: { jsx: true } },
    { code: '<>hi</>;', options: { jsx: true } },
    { code: "<><div>JSXElement</div>JSXText{'JSXExpressionContainer'}</>", options: { jsx: true } },
    { code: '<><span>hi</span><div>bye</div></>;', options: { jsx: true } },
    { code: '<><span>1</span><><span>2.1</span><span>2.2</span></><span>3</span></>;', options: { jsx: true } },
    { code: '<><span> hi </span> <div>bye</div> </>', options: { jsx: true } },
    {
      code: outdent`
        <>
          <>
            <>
             Ghost!
            </>
          </>
        </>
      `,
      options: { jsx: true },
    },
    {
      code: outdent`
        <>
          <>
            <>
              super deep
            </>
          </>
        </>
      `,
      options: { jsx: true },
    },
    {
      code: outdent`
        <dl>
          {props.items.map(item => (
            <React.Fragment key={item.id}>
              <dt>{item.term}</dt>
              <dd>{item.description}</dd>
            </React.Fragment>
          ))}
        </dl>
      `,
      options: { jsx: true },
    },

    {
      code: outdent`
        <em>
        One
        Two
        Three
        </em>
      `,
      options: { jsx: true },
    },
    {
      code: '<SolarSystem.Earth.America.USA.California.mountain-view></SolarSystem.Earth.America.USA.California.mountain-view>',
      options: { jsx: true, next: true },
    },
    { code: 'function *g() { yield <h1>Hello</h1> }', options: { jsx: true, next: true } },
    { code: '<a>{`${1}`}</a>', options: { jsx: true, next: true } },
    { code: '<strong><em><a href="{link}"><test/></a></em></strong>', options: { jsx: true, next: true } },
    { code: '<x y="&#123abc &#123;" />', options: { jsx: true, next: true } },
    { code: '<a b="&#xA2; &#x00A3;"/>', options: { jsx: true, next: true } },
    { code: '<p q="Just my &#xA2;2" />', options: { jsx: true, next: true } },
    { code: 'class C {  static a = <C.z></C.z> }', options: { jsx: true, next: true } },

    { code: '<n:a n:v />', options: { jsx: true } },

    { code: '<n:a />', options: { jsx: true, ranges: true } },
    { code: '<a:b><a:b></a:b></a:b>;', options: { jsx: true, ranges: true } },
    { code: '<A aa={aa.bb.cc} bb={bb.cc.dd}><div>{aa.b}</div></A>', options: { jsx: true } },

    { code: 'var component = <Component {...props} />;', options: { jsx: true } },
    {
      code: outdent`
        class SayHello extends React.Component {
          constructor(props) {
            super(props);
            this.state = {message: 'Hello!'};
            // This line is important!
            this.handleClick = this.handleClick.bind(this);
          }
          handleClick() {
            alert(this.state.message);
          }
          render() {
            // Because "this.handleClick" is bound, we can use it as an event handler.
            return (
              <button onClick={this.handleClick}>
                Say hello
              </button>
            );
          }
        }
      `,
      options: { jsx: true },
    },
    { code: '<a>{\r\n}</a>', options: { jsx: true } },
    { code: '<a>{/* this\nis\na\nmulti-line\ncomment */}</a>', options: { jsx: true } },
    /*[
      '<a>= == =</a>',
      Context.OptionsJSX,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'JSXElement',
              children: [
                {
                  type: 'JSXText',
                  value: '= == ='
                }
              ],
              openingElement: {
                type: 'JSXOpeningElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                },
                attributes: [],
                selfClosing: false
              },
              closingElement: {
                type: 'JSXClosingElement',
                name: {
                  type: 'JSXIdentifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],*/
    { code: '<this />', options: { jsx: true } },
    { code: '<Switch checkedChildren="开" unCheckedChildren={"关"} />', options: { jsx: true } },
    { code: '<a b="&notanentity;" />', options: { jsx: true } },
    { code: 'let child = <img src={url} key="img" />;', options: { jsx: true } },
    {
      code: '<img src="/cat.jpg" style={{ position: "absolute", left: mouse.x, top: mouse.y }} />',
      options: { jsx: true },
    },
    { code: '<Component {...{...props, y: 1 }} />', options: { jsx: true } },
    { code: '<Component {...props} y={1} />', options: { jsx: true } },
    {
      code: outdent`
        var div = (
          <div className='foo'>
            <img src='foo.gif'/>
            <img src='bar.gif'/>
          </div>
        );
      `,
      options: { jsx: true },
    },
    {
      code: outdent`
        <h1>
          Hello {name}
          !
        </h1>
      `,
      options: { jsx: true },
    },
    {
      code: outdent`
        var div = (
          <div>
            { images.map( src => <img src={src}/> ) }
          </div>
        );
      `,
      options: { jsx: true },
    },
    { code: '<div {...c}> {...children}{a}{...b}</div>', options: { jsx: true } },
    { code: 'function* test() { yield <Hey />;    }', options: { jsx: true } },
    { code: 'function* test() { yield (<Hey />); }', options: { jsx: true } },
    { code: '<div {...c}> {...children}{a}{...b}</div>', options: { jsx: true } },
    { code: 'function Meet({name = "world"}) { return <div>Hello, {name}</div>; }', options: { jsx: true } },
    { code: 'const d1 = <TestingOneThing y1 extra-data />;', options: { jsx: true } },
    { code: 'const d2 = <TestingOneThing extra-data="hello" />;', options: { jsx: true } },
    { code: '<a b={x ? <c /> : <d />} />', options: { jsx: true } },
    { code: '<Test {...{a: "foo"}} {...{b: 123}} />;', options: { jsx: true } },
    {
      code: outdent`
        ReactDOM.render(
          <CommentBox url="/api/comments" pollInterval={2000} />,
          document.getElementById('content')
        );
      `,
      options: { jsx: true },
    },
    { code: '<div>{0}</div>;', options: { jsx: true } },
    { code: '(<div />) < x;', options: { jsx: true } },
    { code: '<div>{() => (<div text="wat" />)}</div>', options: { jsx: true } },
    { code: '<a />;', options: { jsx: true } },
    { code: 'const c2 = <OneThing yy={100}  yy1="hello"/>;', options: { jsx: true } },
    { code: 'const c3 = <OneThing yxx="hello" ignore-prop />', options: { jsx: true } },
    { code: 'const d3 = <TestingOneThing extra-data="hello" yy="hihi" />', options: { jsx: true } },
    { code: 'const d4 = <TestingOneThing extra-data="hello" yy={9} direction={10} />', options: { jsx: true } },
    { code: 'const d5 = <TestingOneThing extra-data="hello" yy="hello" name="Bob" />', options: { jsx: true } },
    { code: 'const e3 = <TestingOptional y1="hello"/>', options: { jsx: true } },
    { code: 'const e4 = <TestingOptional y1="hello" y2={1000} />', options: { jsx: true } },
    { code: 'const e5 = <TestingOptional y1 y3/>', options: { jsx: true } },
    { code: 'const e6 = <TestingOptional y1 y3 y2={10} />', options: { jsx: true } },
    { code: 'const e2 = <TestingOptional y1 y3 extra-prop/>', options: { jsx: true } },
    { code: 'let k3 = <Comp a={10} b="hi"><Button /><AnotherButton /></Comp>', options: { jsx: true } },
    { code: 'var selfClosed2 = <div x="1" />', options: { jsx: true } },
    { code: 'var selfClosed5 = <div x={0} y="0" />', options: { jsx: true } },
    { code: 'var selfClosed6 = <div x={"1"} y="0" />', options: { jsx: true } },
    { code: 'var selfClosed7 = <div x={p} y="p" b />', options: { jsx: true } },
    { code: 'var openClosed4 = <div n="m">{p < p}</div>', options: { jsx: true } },
    { code: 'var rewrites1 = <div>{() => this}</div>', options: { jsx: true } },
    { code: 'var rewrites2 = <div>{[p, ...p, p]}</div>', options: { jsx: true } },
    { code: 'var rewrites3 = <div>{{p}}</div>', options: { jsx: true } },
    { code: 'var rewrites4 = <div a={() => this}></div>', options: { jsx: true, ranges: true } },
    { code: 'var rewrites5 = <div a={[p, ...p, p]}></div>', options: { jsx: true } },
    { code: 'var rewrites6 = <div a={{p}}></div>', options: { jsx: true, ranges: true } },
    { code: 'var whitespace1 = <div>      </div>', options: { jsx: true } },
    { code: 'var whitespace2 = <div>  {p}    </div>', options: { jsx: true } },
    { code: 'const Tag = (x) => <div></div>', options: { jsx: true } },
    { code: '<div>hi hi hi!</div>', options: { jsx: true } },
    { code: 'var m = <div x-y="val"></div>', options: { jsx: true } },

    { code: 'var o = <div x-yy="val"></div>', options: { jsx: true } },
    { code: 'var p = <div xx-yy="val"></div>', options: { jsx: true } },
    { code: 'var e = <div xxxxx="val"></div>', options: { jsx: true } },
    { code: 'const b3 = <MainButton {...{goTo:"home"}} extra />', options: { jsx: true } },
    { code: 'const c1 = <NoOverload  {...{onClick: (k) => {console.log(k)}}} extra />', options: { jsx: true } },
    { code: 'const d1 = <NoOverload1 {...{goTo:"home"}} extra  />', options: { jsx: true } },
    { code: 'let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>', options: { jsx: true } },
    { code: 'let k3 = <div> {1} {"That is a number"} </div>', options: { jsx: true } },
    { code: '<LeftRight left=<a /> right=<b>monkeys</b> />', options: { jsx: true } },
    { code: '<america state=<usa.california></usa.california> />', options: { jsx: true } },
    { code: '<america state=<a/> />', options: { jsx: true } },
    { code: '<div {...children}></div>', options: { jsx: true } },
    { code: '<div {...a }>{...b}</div>', options: { jsx: true, loc: true } },
    { code: 'let e1 = <EmptyProp {...{}} />', options: { jsx: true } },
    { code: 'let e2 = <EmptyProp {...j} />', options: { jsx: true } },
    { code: 'let e5 = <EmptyProp {...{ "data-prop": true}} />', options: { jsx: true } },
    { code: '<div>{() => <div text="wat" />}</div>', options: { jsx: true } },
    { code: '<Poisoned {...{x: "ok", y: "2"}} />', options: { jsx: true } },
    { code: 'let w = <Poisoned {...{x: 5, y: "2"}}/>', options: { jsx: true } },
    { code: 'let w1 = <Poisoned {...{x: 5, y: "2"}} X="hi" />', options: { jsx: true } },
    { code: '<div>\n</div>', options: { jsx: true } },
    { code: '<div attr="&#0123;&hellip;&#x7D;"></div>', options: { jsx: true } },
    { code: "<div attr='\"'></div>", options: { jsx: true } },
    { code: '<foo bar=<baz.zoo></baz.zoo> />', options: { jsx: true } },
    { code: '<a href={link}></a>', options: { jsx: true } },
    { code: '<img width={320}/>', options: { jsx: true, ranges: true } },
    { code: '<日本語></日本語>', options: { jsx: true } },
    {
      code: outdent`
        <em>
        One
        Two
        Three
        </em>
      `,
      options: { jsx: true },
    },

    { code: '<SolarSystem.Earth.America.USA.California.mountain-view />', options: { jsx: true, ranges: true } },
    { code: '<div> foo:bar</div>', options: { jsx: true, ranges: true, raw: true } },
    { code: '<div><li>Item 1</li><li>Item 1</li></div>', options: { jsx: true } },
    { code: "<div style={{color: 'red', fontWeight: 'bold'}} />", options: { jsx: true } },
    { code: '<h1>Hello {data.target}</h1>', options: { jsx: true } },
    {
      code: outdent`
        <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
          <h1>Move the mouse around!</h1>
          <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
        </div>
      `,
      options: { jsx: true },
    },
    { code: 'var element = <Hello name={name}/>', options: { jsx: true } },
    { code: 'var div = <div contentEditable />', options: { jsx: true } },
    { code: '<div {...this.props}/>', options: { jsx: true } },
    { code: '<Foo> <h1>Hello {name}!</h1>   </Foo>', options: { jsx: true } },

    { code: '<Foo> {true} </Foo>', options: { jsx: true } },

    { code: '<a>{ }</a>', options: { jsx: true } },
    { code: '<a>{b}</a>', options: { jsx: true } },
    { code: '<input disabled />', options: { jsx: true } },
    { code: '<a>{/* this is a comment */}</a>', options: { jsx: true } },
    { code: '<div>@test content</div>', options: { jsx: true } },
    { code: '<div><br />7x invalid-js-identifier</div>', options: { jsx: true } },
    { code: '<a.b></a.b>', options: { jsx: true } },
    { code: '<a>    </a>', options: { jsx: true } },
    { code: '<title>{ {caption} }</title>', options: { jsx: true, ranges: true } },
    { code: '"use strict"; <async />', options: { jsx: true } },
    { code: '<A.B.C.D.E.foo-bar />', options: { jsx: true } },
    { code: '<a>  <b><c/></b> </a>', options: { jsx: true } },

    { code: '<Test.X></Test.X>', options: { jsx: true } },
    { code: '<View {...this.props} {...this.state} />', options: { jsx: true } },
    { code: '<div />', options: { jsx: true } },

    { code: '<a>{}</a>', options: { jsx: true } },
    { code: '<a> a </a>', options: { jsx: true } },
    { code: '<a/>', options: { jsx: true } },
    { code: '<div><span></span></div>', options: { jsx: true } },
    { code: '<div>{ }</div>', options: { jsx: true, ranges: true, loc: true } },
    { code: '<div>&nbsp;&amp;</div>', options: { jsx: true, ranges: true, loc: true, raw: true } },
    { code: '<a><// line\n/a>;', options: { jsx: true, ranges: true } },
    { code: '<// line\na\n><\n/\na\n>;', options: { jsx: true, ranges: true } },
    { code: '<a></* block */\n/a>;', options: { jsx: true } },
    { code: '</* open fragment */>\n</ /* close fragment */>;', options: { jsx: true, ranges: true } },
    { code: '<a><  /a>', options: { jsx: true, ranges: true } },
  ]);
});
