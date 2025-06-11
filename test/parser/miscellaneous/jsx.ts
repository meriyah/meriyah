import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - JSX', () => {
  for (const arg of [
    '<Component {...x}></Component>;',
    '<Component.Test />;',
    '<div>{...this.props.children}</div>;',
    '{foo && <Something foo={foo} /> }',
    '<Component:Test />;',
    '<Component.Test />;',
    `<></>;

    <
    >
      text
    </>;`,
    '<div>{this.props.children}</div>;',
    '<a>{}</a>;',
    '<p>{1/2}</p>',
    '<p>{/w/.test(s)}</p>',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsJSX);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsJSX);
      });
    });
  }

  fail('Miscellaneous - JSX (fail)', [
    ['<', Context.None],
    ['<foo', Context.None],
    ['>', Context.None],
    ['<>', Context.None],
    ['< >', Context.None],
    ['</>', Context.None],
    ['<><//>', Context.None],
    ['<', Context.OptionsJSX],
    ['>', Context.OptionsJSX],
    ['<>', Context.OptionsJSX],
    ['< >', Context.OptionsJSX],
    ['</>', Context.OptionsJSX],
    ['<><//>', Context.OptionsJSX],
    ['<p>', Context.OptionsJSX],
    ['<p></q>', Context.OptionsJSX],
    ['<p></>', Context.OptionsJSX],
    ['<p><q></p>', Context.OptionsJSX],
    ['<1/>', Context.OptionsJSX],
    [`<div id={}></div>`, Context.OptionsJSX],
    ['<div>one</div><div>two</div>', Context.OptionsJSX],
    ['</>', Context.OptionsJSX],
    ['<a/!', Context.OptionsJSX],
    ['<img src={}>', Context.OptionsJSX],
    ['<a b=: />', Context.OptionsJSX],
    ['<xyz. />', Context.OptionsJSX],
    ['<.abc />', Context.OptionsJSX],
    ['<Foo></Bar>', Context.OptionsJSX],
    ['<dd><e></e></dddd>;', Context.OptionsJSX],
    ['<{...b} {...a }>{...b}</{...b}>', Context.OptionsJSX],
    ['<f><g/></ff>;', Context.OptionsJSX],
    ['<:path />', Context.OptionsJSX],
    ['<path></svg:path>', Context.OptionsJSX],
    ['<foo.bar></foo.baz>', Context.OptionsJSX],
    ['<chinese:alladinfoo.bar></foo.baz>', Context.OptionsJSX],
    ['<foo:bar></foo.baz>', Context.OptionsJSX],
    ['<foo:bar.baz></foo.baz:bar>', Context.OptionsJSX],
    ['<foo.bar></foo.baz>', Context.OptionsJSX],
    ['var x = <div>one</div> /* intervening comment */ <div>two</div>;', Context.OptionsJSX],
    ['<tag className=></tag>', Context.OptionsJSX],
    ['<tag ${"className"}="tag"></tag>', Context.OptionsJSX],
    ['<a: />;', Context.OptionsJSX],
    ['<:a />;', Context.OptionsJSX],
    ['<a></b>', Context.OptionsJSX],
    ['<a foo="bar;', Context.OptionsJSX],
    ['<a:b></b>;', Context.OptionsJSX],
    ['<a.b:c></a.b:c>;', Context.OptionsJSX],
    ['<a[foo]></a[foo]>;', Context.OptionsJSX],
    ['<a["foo"]></a["foo"]>;', Context.OptionsJSX],
    ['<a b={}>;', Context.OptionsJSX],
    ['var x = <div>one</div><div>two</div>;', Context.OptionsJSX],
    ['<div {props} />;', Context.OptionsJSX],
    ['<div {...props}>stuff</div {...props}>;', Context.OptionsJSX],
    ['<a>></a>;', Context.OptionsJSX],
    ['<a b=}>;', Context.OptionsJSX],
    [' > ;', Context.OptionsJSX],
    ['<a>;</>;', Context.OptionsJSX],
    ['<a b></b>;', Context.OptionsJSX],
    ['<a.b.c></a>;', Context.OptionsJSX],
    [' < .a > ;', Context.OptionsJSX],
    ['a > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['<.a></.a>', Context.OptionsJSX],
    ['<a.></a.>', Context.OptionsJSX],
    ['<div className"app">', Context.OptionsJSX],
    ['<div {props} />', Context.OptionsJSX],
    ['<a>></a>', Context.OptionsJSX],
    ['<div {...props}>stuff</div {...props}>', Context.OptionsJSX],
    ['<a><</a>', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['[foo] > ;', Context.OptionsJSX],
    ['var x = <div>one</div>, <div>two</div>;', Context.OptionsJSX],
    ['<p>{/}</p>', Context.OptionsJSX],
    ['<div=""></div>', Context.OptionsJSX],
    ['<div =""></div>', Context.OptionsJSX],
    ['<div=1></div>', Context.OptionsJSX],
    ['<div=div></div>', Context.OptionsJSX],
    ['<div=/>', Context.OptionsJSX],
    ['<div=-/>', Context.OptionsJSX],
    ['<div=/>', Context.OptionsJSX],
    ['<div =/>', Context.OptionsJSX],
    ['<div=+-%&([)]}.../>', Context.OptionsJSX],
  ]);

  pass('Miscellaneous - JSX (pass)', [
    [`<!--ccc-->`, Context.OptionsJSX],
    [
      `class Columns extends React.Component {
        render() {
          return (
            <>
              <td>Hello</td>
              <td>World</td>
            </>
          );
        }
      }`,
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc,
    ],
    [`<div>{111}</div>`, Context.OptionsJSX | Context.OptionsRanges],
    [`<div></div>`, Context.OptionsJSX | Context.OptionsRanges],
    [`<div {...[<div/>]} />`, Context.OptionsJSX | Context.OptionsRanges],
    [`<div >{111}</div>`, Context.OptionsJSX],
    [`<div >xxx{111}xxx{222}</div>`, Context.OptionsJSX | Context.OptionsRanges],
    [`<div >xxx{function(){return <div id={aaa}>111</div>}}xxx{222}</div>`, Context.OptionsJSX | Context.OptionsRanges],
    [`<ul><li>111</li><li>222</li><li>333</li><li>444</li></ul>`, Context.OptionsJSX | Context.OptionsRanges],
    [`<div id="复杂结构">xxx{function(){return <div id={aaa}>111</div>}}xxx{222}</div>`, Context.OptionsJSX],
    [`<ul>  <li>  </li> <li>x</li> </ul>`, Context.OptionsJSX],
    [`<option><b>dddd</b><script>333</script><xmp>eee</xmp><template>eeeee</template></option>`, Context.OptionsJSX],
    [
      `<div id={aa} class="className" > t </div>`,
      Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw,
    ],
    [`<div id={function(){ return <div/> }} class="className"><p>xxx</p></div>`, Context.OptionsJSX],
    [`<div id={aa} title={ bb } {...{a:1}} class="className" ></div>`, Context.OptionsJSX],
    [`<X prop="2"><Y /><Z /></X>`, Context.OptionsJSX],
    [`<X>{a} {b}</X>`, Context.OptionsJSX],
    [`<X data-prop={x ? <Y prop={2} /> : <Z>\n</Z>}></X>`, Context.OptionsJSX],
    [`/** @jsx CUSTOM_DOM */<a></a>`, Context.OptionsJSX],
    [
      `import React from 'react'
     const Component = () => (
       <div>Hello, World</div>
     )`,
      Context.OptionsJSX | Context.Module | Context.Strict,
    ],
    [
      `<Basic>
       <BasicChild>
         <BasicChild>
           <BasicChild>
             Title 2
           </BasicChild>
         </BasicChild>
       </BasicChild>
     </Basic>`,
      Context.OptionsJSX | Context.Module | Context.Strict,
    ],
    [
      `<div>
     one
     <div>
       two
       <span>
         three
       </span>
     </div>
   </div>`,
      Context.OptionsJSX,
    ],
    [`<>Fragment</>`, Context.OptionsJSX],
    [`<p>hello,world</p>`, Context.OptionsJSX],
    [`<></>`, Context.OptionsJSX | Context.OptionsRanges],
    [`<    ></   >`, Context.OptionsJSX | Context.OptionsRanges],
    [`< /*starting wrap*/ ></ /*ending wrap*/>;`, Context.OptionsJSX],
    [`<>hi</>;`, Context.OptionsJSX],
    [`<><div>JSXElement</div>JSXText{'JSXExpressionContainer'}</>`, Context.OptionsJSX],
    [`<><span>hi</span><div>bye</div></>;`, Context.OptionsJSX],
    [`<><span>1</span><><span>2.1</span><span>2.2</span></><span>3</span></>;`, Context.OptionsJSX],
    [`<><span> hi </span> <div>bye</div> </>`, Context.OptionsJSX],
    [
      `<>
     <>
       <>
        Ghost!
       </>
     </>
   </>`,
      Context.OptionsJSX,
    ],
    [
      `<>
     <>
       <>
         super deep
       </>
     </>
   </>`,
      Context.OptionsJSX,
    ],
    [
      `<dl>
     {props.items.map(item => (
       <React.Fragment key={item.id}>
         <dt>{item.term}</dt>
         <dd>{item.description}</dd>
       </React.Fragment>
     ))}
   </dl>`,
      Context.OptionsJSX,
    ],

    [
      `<em>
     One
     Two
     Three
     </em>`,
      Context.OptionsJSX,
    ],
    [
      '<SolarSystem.Earth.America.USA.California.mountain-view></SolarSystem.Earth.America.USA.California.mountain-view>',
      Context.OptionsJSX | Context.OptionsNext,
    ],
    ['function *g() { yield <h1>Hello</h1> }', Context.OptionsJSX | Context.OptionsNext],
    ['<a>{`${1}`}</a>', Context.OptionsJSX | Context.OptionsNext],
    ['<strong><em><a href="{link}"><test/></a></em></strong>', Context.OptionsJSX | Context.OptionsNext],
    ['<x y="&#123abc &#123;" />', Context.OptionsJSX | Context.OptionsNext],
    ['<a b="&#xA2; &#x00A3;"/>', Context.OptionsJSX | Context.OptionsNext],
    ['<p q="Just my &#xA2;2" />', Context.OptionsJSX | Context.OptionsNext],
    ['class C {  static a = <C.z></C.z> }', Context.OptionsJSX | Context.OptionsNext],

    ['<n:a n:v />', Context.OptionsJSX],

    ['<n:a />', Context.OptionsJSX | Context.OptionsRanges],
    ['<a:b><a:b></a:b></a:b>;', Context.OptionsJSX | Context.OptionsRanges],
    ['<A aa={aa.bb.cc} bb={bb.cc.dd}><div>{aa.b}</div></A>', Context.OptionsJSX],

    ['var component = <Component {...props} />;', Context.OptionsJSX],
    [
      `class SayHello extends React.Component {
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
    }`,
      Context.OptionsJSX,
    ],
    ['<a>{\r\n}</a>', Context.OptionsJSX],
    ['<a>{/* this\nis\na\nmulti-line\ncomment */}</a>', Context.OptionsJSX],
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
    ['<this />', Context.OptionsJSX],
    ['<Switch checkedChildren="开" unCheckedChildren={"关"} />', Context.OptionsJSX],
    ['<a b="&notanentity;" />', Context.OptionsJSX],
    ['let child = <img src={url} key="img" />;', Context.OptionsJSX],
    ['<img src="/cat.jpg" style={{ position: "absolute", left: mouse.x, top: mouse.y }} />', Context.OptionsJSX],
    ['<Component {...{...props, y: 1 }} />', Context.OptionsJSX],
    ['<Component {...props} y={1} />', Context.OptionsJSX],
    [
      `var div = (
      <div className='foo'>
        <img src='foo.gif'/>
        <img src='bar.gif'/>
      </div>
    );`,
      Context.OptionsJSX,
    ],
    [
      `<h1>
     Hello {name}
     !
   </h1>`,
      Context.OptionsJSX,
    ],
    [
      `var div = (
      <div>
        { images.map( src => <img src={src}/> ) }
      </div>
    );`,
      Context.OptionsJSX,
    ],
    ['<div {...c}> {...children}{a}{...b}</div>', Context.OptionsJSX],
    ['function* test() { yield <Hey />;    }', Context.OptionsJSX],
    ['function* test() { yield (<Hey />); }', Context.OptionsJSX],
    ['<div {...c}> {...children}{a}{...b}</div>', Context.OptionsJSX],
    ['function Meet({name = "world"}) { return <div>Hello, {name}</div>; }', Context.OptionsJSX],
    ['const d1 = <TestingOneThing y1 extra-data />;', Context.OptionsJSX],
    ['const d2 = <TestingOneThing extra-data="hello" />;', Context.OptionsJSX],
    ['<a b={x ? <c /> : <d />} />', Context.OptionsJSX],
    ['<Test {...{a: "foo"}} {...{b: 123}} />;', Context.OptionsJSX],
    [
      `ReactDOM.render(
        <CommentBox url="/api/comments" pollInterval={2000} />,
        document.getElementById('content')
      );`,
      Context.OptionsJSX,
    ],
    ['<div>{0}</div>;', Context.OptionsJSX],
    ['(<div />) < x;', Context.OptionsJSX],
    ['<div>{() => (<div text="wat" />)}</div>', Context.OptionsJSX],
    ['<a />;', Context.OptionsJSX],
    ['const c2 = <OneThing yy={100}  yy1="hello"/>;', Context.OptionsJSX],
    ['const c3 = <OneThing yxx="hello" ignore-prop />', Context.OptionsJSX],
    ['const d3 = <TestingOneThing extra-data="hello" yy="hihi" />', Context.OptionsJSX],
    ['const d4 = <TestingOneThing extra-data="hello" yy={9} direction={10} />', Context.OptionsJSX],
    ['const d5 = <TestingOneThing extra-data="hello" yy="hello" name="Bob" />', Context.OptionsJSX],
    ['const e3 = <TestingOptional y1="hello"/>', Context.OptionsJSX],
    ['const e4 = <TestingOptional y1="hello" y2={1000} />', Context.OptionsJSX],
    ['const e5 = <TestingOptional y1 y3/>', Context.OptionsJSX],
    ['const e6 = <TestingOptional y1 y3 y2={10} />', Context.OptionsJSX],
    ['const e2 = <TestingOptional y1 y3 extra-prop/>', Context.OptionsJSX],
    ['let k3 = <Comp a={10} b="hi"><Button /><AnotherButton /></Comp>', Context.OptionsJSX],
    ['var selfClosed2 = <div x="1" />', Context.OptionsJSX],
    ['var selfClosed5 = <div x={0} y="0" />', Context.OptionsJSX],
    ['var selfClosed6 = <div x={"1"} y="0" />', Context.OptionsJSX],
    ['var selfClosed7 = <div x={p} y="p" b />', Context.OptionsJSX],
    ['var openClosed4 = <div n="m">{p < p}</div>', Context.OptionsJSX],
    ['var rewrites1 = <div>{() => this}</div>', Context.OptionsJSX],
    ['var rewrites2 = <div>{[p, ...p, p]}</div>', Context.OptionsJSX],
    ['var rewrites3 = <div>{{p}}</div>', Context.OptionsJSX],
    ['var rewrites4 = <div a={() => this}></div>', Context.OptionsJSX | Context.OptionsRanges],
    ['var rewrites5 = <div a={[p, ...p, p]}></div>', Context.OptionsJSX],
    ['var rewrites6 = <div a={{p}}></div>', Context.OptionsJSX | Context.OptionsRanges],
    ['var whitespace1 = <div>      </div>', Context.OptionsJSX],
    ['var whitespace2 = <div>  {p}    </div>', Context.OptionsJSX],
    ['const Tag = (x) => <div></div>', Context.OptionsJSX],
    ['<div>hi hi hi!</div>', Context.OptionsJSX],
    ['var m = <div x-y="val"></div>', Context.OptionsJSX],

    ['var o = <div x-yy="val"></div>', Context.OptionsJSX],
    ['var p = <div xx-yy="val"></div>', Context.OptionsJSX],
    ['var e = <div xxxxx="val"></div>', Context.OptionsJSX],
    ['const b3 = <MainButton {...{goTo:"home"}} extra />', Context.OptionsJSX],
    ['const c1 = <NoOverload  {...{onClick: (k) => {console.log(k)}}} extra />', Context.OptionsJSX],
    ['const d1 = <NoOverload1 {...{goTo:"home"}} extra  />', Context.OptionsJSX],
    ['let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>', Context.OptionsJSX],
    ['let k3 = <div> {1} {"That is a number"} </div>', Context.OptionsJSX],
    ['<LeftRight left=<a /> right=<b>monkeys</b> />', Context.OptionsJSX],
    ['<america state=<usa.california></usa.california> />', Context.OptionsJSX],
    ['<america state=<a/> />', Context.OptionsJSX],
    ['<div {...children}></div>', Context.OptionsJSX],
    ['<div {...a }>{...b}</div>', Context.OptionsJSX | Context.OptionsLoc],
    ['let e1 = <EmptyProp {...{}} />', Context.OptionsJSX],
    ['let e2 = <EmptyProp {...j} />', Context.OptionsJSX],
    ['let e5 = <EmptyProp {...{ "data-prop": true}} />', Context.OptionsJSX],
    ['<div>{() => <div text="wat" />}</div>', Context.OptionsJSX],
    ['<Poisoned {...{x: "ok", y: "2"}} />', Context.OptionsJSX],
    ['let w = <Poisoned {...{x: 5, y: "2"}}/>', Context.OptionsJSX],
    ['let w1 = <Poisoned {...{x: 5, y: "2"}} X="hi" />', Context.OptionsJSX],
    ['<div>\n</div>', Context.OptionsJSX],
    ['<div attr="&#0123;&hellip;&#x7D;"></div>', Context.OptionsJSX],
    [`<div attr='"'></div>`, Context.OptionsJSX],
    ['<foo bar=<baz.zoo></baz.zoo> />', Context.OptionsJSX],
    ['<a href={link}></a>', Context.OptionsJSX],
    ['<img width={320}/>', Context.OptionsJSX | Context.OptionsRanges],
    ['<日本語></日本語>', Context.OptionsJSX],
    [
      `<em>
     One
     Two
     Three
     </em>`,
      Context.OptionsJSX,
    ],

    ['<SolarSystem.Earth.America.USA.California.mountain-view />', Context.OptionsJSX | Context.OptionsRanges],
    ['<div> foo:bar</div>', Context.OptionsJSX | Context.OptionsRanges | Context.OptionsRaw],
    ['<div><li>Item 1</li><li>Item 1</li></div>', Context.OptionsJSX],
    [`<div style={{color: 'red', fontWeight: 'bold'}} />`, Context.OptionsJSX],
    ['<h1>Hello {data.target}</h1>', Context.OptionsJSX],
    [
      `<div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
     <h1>Move the mouse around!</h1>
     <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
   </div>`,
      Context.OptionsJSX,
    ],
    ['var element = <Hello name={name}/>', Context.OptionsJSX],
    ['var div = <div contentEditable />', Context.OptionsJSX],
    ['<div {...this.props}/>', Context.OptionsJSX],
    ['<Foo> <h1>Hello {name}!</h1>   </Foo>', Context.OptionsJSX],

    ['<Foo> {true} </Foo>', Context.OptionsJSX],

    ['<a>{ }</a>', Context.OptionsJSX],
    ['<a>{b}</a>', Context.OptionsJSX],
    ['<input disabled />', Context.OptionsJSX],
    ['<a>{/* this is a comment */}</a>', Context.OptionsJSX],
    ['<div>@test content</div>', Context.OptionsJSX],
    ['<div><br />7x invalid-js-identifier</div>', Context.OptionsJSX],
    ['<a.b></a.b>', Context.OptionsJSX],
    ['<a>    </a>', Context.OptionsJSX],
    ['<title>{ {caption} }</title>', Context.OptionsJSX | Context.OptionsRanges],
    ['"use strict"; <async />', Context.OptionsJSX],
    ['<A.B.C.D.E.foo-bar />', Context.OptionsJSX],
    ['<a>  <b><c/></b> </a>', Context.OptionsJSX],

    ['<Test.X></Test.X>', Context.OptionsJSX],
    ['<View {...this.props} {...this.state} />', Context.OptionsJSX],
    ['<div />', Context.OptionsJSX],

    ['<a>{}</a>', Context.OptionsJSX],
    ['<a> a </a>', Context.OptionsJSX],
    ['<a/>', Context.OptionsJSX],
    ['<div><span></span></div>', Context.OptionsJSX],
    ['<div>{ }</div>', Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc],
    ['<div>&nbsp;&amp;</div>', Context.OptionsJSX | Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw],
    ['<a><// line\n/a>;', Context.OptionsJSX | Context.OptionsRanges],
    ['<// line\na\n><\n/\na\n>;', Context.OptionsJSX | Context.OptionsRanges],
    ['<a></* block */\n/a>;', Context.OptionsJSX],
    ['</* open fragment */>\n</ /* close fragment */>;', Context.OptionsJSX | Context.OptionsRanges],
    ['<a><  /a>', Context.OptionsJSX | Context.OptionsRanges],
  ]);
});
