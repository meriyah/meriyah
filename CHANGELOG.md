## [4.1.4](https://github.com/meriyah/meriyah/compare/v4.1.3...v4.1.4) (2021-02-28)



## [4.1.3](https://github.com/meriyah/meriyah/compare/v4.1.2...v4.1.3) (2021-02-28)



## [4.1.2](https://github.com/meriyah/meriyah/compare/v4.1.1...v4.1.2) (2021-02-10)



## [4.1.1](https://github.com/meriyah/meriyah/compare/v4.1.0...v4.1.1) (2021-02-09)


### Bug Fixes

* avoid rollup typescript cache ([d6462be](https://github.com/meriyah/meriyah/commit/d6462be14519dae16f1543918fe752d4bca9514d)), closes [#176](https://github.com/meriyah/meriyah/issues/176)



# [4.1.0](https://github.com/meriyah/meriyah/compare/v4.0.0...v4.1.0) (2021-02-07)


### Bug Fixes

* **jsx:** decode html entities for JSXText value ([f8121f0](https://github.com/meriyah/meriyah/commit/f8121f04dbb000fc74b664496f7cf22d72477e1c)), closes [#133](https://github.com/meriyah/meriyah/issues/133)
* **parser:** fix wrong loc for BinaryExpression ([ab1ab37](https://github.com/meriyah/meriyah/commit/ab1ab37f36c449d7a1247debdd4457f94c62bf1f)), closes [#169](https://github.com/meriyah/meriyah/issues/169)
* **parser:** fix wrong loc for TemplateLiteral ([a893c16](https://github.com/meriyah/meriyah/commit/a893c1664fdc0b403aa8cb482f9443d9d97c7e1d)), closes [#167](https://github.com/meriyah/meriyah/issues/167)


### Features

* add support of logical assignment ||=, &&=, and ??= ([2a5f12e](https://github.com/meriyah/meriyah/commit/2a5f12e2566f23ad280077c15dee16ca79e0d9ad)), closes [#168](https://github.com/meriyah/meriyah/issues/168)



# [4.0.0](https://github.com/meriyah/meriyah/compare/v3.1.6...v4.0.0) (2021-01-14)


### Bug Fixes

* **estree:** rename FieldDefinition -> PropertyDefinition, PrivateName -> PrivateIdentifier ([2a588e5](https://github.com/meriyah/meriyah/commit/2a588e5b420da50c81d0feccc82ce8adc9ca165a)), closes [#134](https://github.com/meriyah/meriyah/issues/134)
* **parser:** fixed 'async' as  'IsExpressionStart' ([5b7a592](https://github.com/meriyah/meriyah/commit/5b7a5929169bab10bf4dc31d64f2905414004964))
* **parser:** fixed issue with 'yield expr' ([5cd7c1d](https://github.com/meriyah/meriyah/commit/5cd7c1d7743dc6d19c323727eb758cadcd3040e0))


### chore

* update deps, add previous missing breaking change note ([286863e](https://github.com/meriyah/meriyah/commit/286863ec5ec212958c39a2c790095cec70315068))


### BREAKING CHANGES

* updated estree node names: FieldDefinition -> PropertyDefinition, PrivateName -> PrivateIdentifier



## [3.1.6](https://github.com/meriyah/meriyah/compare/v3.1.5...v3.1.6) (2020-11-07)


### Bug Fixes

* bypass type def of package.json ([d267336](https://github.com/meriyah/meriyah/commit/d2673360724a541f5789cd003aa952be75dda9a0)), closes [#155](https://github.com/meriyah/meriyah/issues/155)



## [3.1.5](https://github.com/meriyah/meriyah/compare/v3.1.4...v3.1.5) (2020-11-05)


### Bug Fixes

* fix wrong CommentType type definition ([641b6ee](https://github.com/meriyah/meriyah/commit/641b6ee0d2028775b5473af4962c0b7e215e3683))



## [3.1.4](https://github.com/meriyah/meriyah/compare/v3.1.3...v3.1.4) (2020-11-05)


### Bug Fixes

* fix wrong typescript def file location ([1ffac6e](https://github.com/meriyah/meriyah/commit/1ffac6e7dd475d696de6b726701a41cffc362f72)), closes [#153](https://github.com/meriyah/meriyah/issues/153)



## [3.1.3](https://github.com/meriyah/meriyah/compare/v3.1.2...v3.1.3) (2020-11-04)


### Bug Fixes

* fix wrong ParenthesizedExpression location ([db468c2](https://github.com/meriyah/meriyah/commit/db468c2c6a176afd44935ef94042fb8330dd600c)), closes [#152](https://github.com/meriyah/meriyah/issues/152)



## [3.1.2](https://github.com/meriyah/meriyah/compare/v3.1.1...v3.1.2) (2020-10-30)


### Bug Fixes

* **lexer:** fix line continuation with \r\n ([1423e81](https://github.com/meriyah/meriyah/commit/1423e8100075b66fa80624a9389aaaa12b809836)), closes [#146](https://github.com/meriyah/meriyah/issues/146)



## [3.1.1](https://github.com/meriyah/meriyah/compare/v3.1.0...v3.1.1) (2020-10-29)


### Bug Fixes

* **lexer:** \8 \9 are acceptable in web compatibility mode ([26a19a8](https://github.com/meriyah/meriyah/commit/26a19a86ce36df373c7ed3d3390a2d61570c06a6)), closes [#137](https://github.com/meriyah/meriyah/issues/137)
* bigint is a number literal ([2ad1a27](https://github.com/meriyah/meriyah/commit/2ad1a27c17161b78dc5883950b0b33088e00349a)), closes [#136](https://github.com/meriyah/meriyah/issues/136)
* fix ending loc of empty comment ([d62d0b8](https://github.com/meriyah/meriyah/commit/d62d0b8c158c819749840ed1756c35d90b00e670)), closes [#126](https://github.com/meriyah/meriyah/issues/126)
* fix infinite loop on broken class body ([22eb9f8](https://github.com/meriyah/meriyah/commit/22eb9f8ba4baed88e25f102e2642b79b95dc127a)), closes [#143](https://github.com/meriyah/meriyah/issues/143)
* fix range of ExportDeclaration/ClassDeclaration/ClassExpression after decorators ([81b07fb](https://github.com/meriyah/meriyah/commit/81b07fb92b70319033b44bd4b14c8470adebd4eb)), closes [#124](https://github.com/meriyah/meriyah/issues/124)
* fix wrongly captured directive with two literal expression statements ([9504b6a](https://github.com/meriyah/meriyah/commit/9504b6a0ab5c0ca340b328190bbfa113afd22ce9)), closes [#130](https://github.com/meriyah/meriyah/issues/130)
* **jsx:** fix JSXIdentifier literal value range and loc ([076e454](https://github.com/meriyah/meriyah/commit/076e454c231e788c0ff2778395924551747b4b71)), closes [#127](https://github.com/meriyah/meriyah/issues/127)
* **jsx:** fix missing raw for JSXAttribute.value ([bbd8b8a](https://github.com/meriyah/meriyah/commit/bbd8b8a2541e470b5799dbc78496e865df3b3382)), closes [#128](https://github.com/meriyah/meriyah/issues/128)
* **jsx:** fix wrong range and loc on JSXEmptyExpression ([11765ce](https://github.com/meriyah/meriyah/commit/11765ce5848efc689e3de5077766199cd4996146)), closes [#125](https://github.com/meriyah/meriyah/issues/125)
* **jsx:** JSXText node should have raw ([5ea7bda](https://github.com/meriyah/meriyah/commit/5ea7bdae48efc6afd843206cadb368b48375b5b7)), closes [#129](https://github.com/meriyah/meriyah/issues/129)



# [3.1.0](https://github.com/meriyah/meriyah/compare/v3.0.5...v3.1.0) (2020-10-27)


### Bug Fixes

* fix loc on hashbang comment ([f139dce](https://github.com/meriyah/meriyah/commit/f139dcec6b78690e39d6bc4a446a2a231850bebc))
* fix range on HTMLClose comment on first line ([c445b90](https://github.com/meriyah/meriyah/commit/c445b90fa0f3c8373bfc4837c7d4b8473b1c80aa))
* fix wrong loc in template expressions ([aa0e992](https://github.com/meriyah/meriyah/commit/aa0e9924016065800af6b2b52fabeeef634a13c0)), closes [#123](https://github.com/meriyah/meriyah/issues/123)
* properly support loc on HTMLClose comment ([f72dd4f](https://github.com/meriyah/meriyah/commit/f72dd4fdd9a581f5db866682a88475beb4cbd8b0))


### Features

* support loc flag for onComment and onToken ([287b77c](https://github.com/meriyah/meriyah/commit/287b77cd155e3c44d25b694bf47600883e5a0dca)), closes [#95](https://github.com/meriyah/meriyah/issues/95)


### Performance Improvements

* **lexer:** improved lexer perf ([bc5e647](https://github.com/meriyah/meriyah/commit/bc5e6473312d2acee991b62a35be37fb24a1e533))



## [3.0.5](https://github.com/meriyah/meriyah/compare/v3.0.4...v3.0.5) (2020-10-25)


### Bug Fixes

* move optional-chaining out of next ([7504c64](https://github.com/meriyah/meriyah/commit/7504c646e3d9960aed9fd0949110cb8cb65b7b05)), closes [#117](https://github.com/meriyah/meriyah/issues/117)



## [3.0.4](https://github.com/meriyah/meriyah/compare/v3.0.3...v3.0.4) (2020-10-25)


### Bug Fixes

* follow latest decorator proposal ([e27b9d6](https://github.com/meriyah/meriyah/commit/e27b9d6278f572d1e50ebb9804a060d1f5f1990f)), closes [#105](https://github.com/meriyah/meriyah/issues/105)
* ForInOfLoopInitializer only applies in strict mode ([5f6f0d8](https://github.com/meriyah/meriyah/commit/5f6f0d874c8dff69aae5e2cbc8396b18833df085)), closes [#116](https://github.com/meriyah/meriyah/issues/116)
* support decorator before and after "export" keyword ([f3898ff](https://github.com/meriyah/meriyah/commit/f3898fffad601f70148ce147bb0b7710641d2814))



## [3.0.3](https://github.com/meriyah/meriyah/compare/v3.0.2...v3.0.3) (2020-10-16)


### Bug Fixes

* add missing optional flag on CallExpression ([903c7f5](https://github.com/meriyah/meriyah/commit/903c7f5d8c296a2517d695a1948d52e7b5115238)), closes [#110](https://github.com/meriyah/meriyah/issues/110)
* auto insert semicolon for do-while statement ([faa96bb](https://github.com/meriyah/meriyah/commit/faa96bb299f10bddfb05177ed89b94087eb4e71e)), closes [#102](https://github.com/meriyah/meriyah/issues/102)
* bigint property should exclude the ending 'n' ([e7ed3df](https://github.com/meriyah/meriyah/commit/e7ed3df61d20d185ee7afd955c019354959da10f)), closes [#111](https://github.com/meriyah/meriyah/issues/111)
* export version directly from package.json ([46a7d69](https://github.com/meriyah/meriyah/commit/46a7d6932ad83c431500a67bd967150920ab50af)), closes [#107](https://github.com/meriyah/meriyah/issues/107)
* fix [] and () inside the ChainExpression ([fa72f93](https://github.com/meriyah/meriyah/commit/fa72f933e1ca444a67b5640ab9d40b96b3102c29))
* fix finally block start, follow other parsers on comment start and end ([fe00a67](https://github.com/meriyah/meriyah/commit/fe00a67ad192ec7d7b81088b3caabca1cef44ebf)), closes [#104](https://github.com/meriyah/meriyah/issues/104)
* fix missing static for computed class property ([bd00159](https://github.com/meriyah/meriyah/commit/bd00159c8f22875937237d2a0f5f7cba09b0150f)), closes [#106](https://github.com/meriyah/meriyah/issues/106)
* fix TemplateElement range and loc ([2a3632c](https://github.com/meriyah/meriyah/commit/2a3632cc2012067b897ffd7776c0bdaa904d20e9))
* fix wrong cooked value in TemplateElement, fix wrong loc and range in various template nodes ([ff71744](https://github.com/meriyah/meriyah/commit/ff71744d5b20b87c3bfbba6534656d3768215207)), closes [#109](https://github.com/meriyah/meriyah/issues/109) [#108](https://github.com/meriyah/meriyah/issues/108)



## [3.0.2](https://github.com/meriyah/meriyah/compare/v3.0.0...v3.0.2) (2020-10-06)


### Bug Fixes

* **parser:** directive is only for statement consisting entirely of a string literal ([8186dc1](https://github.com/meriyah/meriyah/commit/8186dc122d9cc4f7df9ebf95fbb3206b5df42dc0)), closes [#99](https://github.com/meriyah/meriyah/issues/99)
* **parser:** follow latest estree spec on ExportAllDeclaration ([7a7fc76](https://github.com/meriyah/meriyah/commit/7a7fc76f2b59faf0b5db069094a3b2584bbbe77a)), closes [#97](https://github.com/meriyah/meriyah/issues/97)
* fix wrong ChainExpression wrapper ([a33771c](https://github.com/meriyah/meriyah/commit/a33771c308a47d37deb8c9c452b4cbb896b52379)), closes [#98](https://github.com/meriyah/meriyah/issues/98)



## [3.0.1](https://github.com/meriyah/meriyah/compare/v3.0.0...v3.0.1) (2020-10-06)


### Bug Fixes

* **parser:** directive is only for statement consisting entirely of a string literal ([8186dc1](https://github.com/meriyah/meriyah/commit/8186dc122d9cc4f7df9ebf95fbb3206b5df42dc0)), closes [#99](https://github.com/meriyah/meriyah/issues/99)
* **parser:** follow latest estree spec on ExportAllDeclaration ([7a7fc76](https://github.com/meriyah/meriyah/commit/7a7fc76f2b59faf0b5db069094a3b2584bbbe77a)), closes [#97](https://github.com/meriyah/meriyah/issues/97)
* fix wrong ChainExpression wrapper ([a33771c](https://github.com/meriyah/meriyah/commit/a33771c308a47d37deb8c9c452b4cbb896b52379)), closes [#98](https://github.com/meriyah/meriyah/issues/98)



# [3.0.0](https://github.com/meriyah/meriyah/compare/v2.1.2...v3.0.0) (2020-09-21)



## [2.1.2](https://github.com/meriyah/meriyah/compare/v2.1.1...v2.1.2) (2020-09-21)


### Bug Fixes

* **estree:** fix the estree interface for BigIntLiteral, cleanup RegExpLiteral ([100c9ad](https://github.com/meriyah/meriyah/commit/100c9ad2b1c10d44f547b87d78626de09faaa2c4))
* **lexer:** store correct bigint token value ([964e678](https://github.com/meriyah/meriyah/commit/964e678dea3676931409cfb3aec7bb1edd4a94c6)), closes [#93](https://github.com/meriyah/meriyah/issues/93)


### BREAKING CHANGES

* **lexer:** upgraded ts target from es2018 to es2020, dropped nodejs v6 and v8 support



## [2.1.1](https://github.com/meriyah/meriyah/compare/v1.9.6...v2.1.1) (2020-07-24)


### Bug Fixes

* **lexer:** fix missed new line char in jsx parser ([f8be7de](https://github.com/meriyah/meriyah/commit/f8be7de10efc1b3235f4d45e6783635ae064398d)), closes [#90](https://github.com/meriyah/meriyah/issues/90)
* **parser:** fix endless loop on broken jsx ([9ee78ac](https://github.com/meriyah/meriyah/commit/9ee78ac84d9c58cb00def0fb32c2ae0f922291d7)), closes [#91](https://github.com/meriyah/meriyah/issues/91)
* rename CoalesceExpression ([2256168](https://github.com/meriyah/meriyah/commit/2256168c1bbe53b6c618764516e721c765eeb79f))
* **lexer:** fix regexp char class \u{hhhh} which requires the u flag ([1fdffb6](https://github.com/meriyah/meriyah/commit/1fdffb6b17935916e058166b2ac6dee522f24b85)), closes [#79](https://github.com/meriyah/meriyah/issues/79)
* **parser:** fixes [#70](https://github.com/meriyah/meriyah/issues/70) ([2ded017](https://github.com/meriyah/meriyah/commit/2ded017436183eb29dd8e58d1d496c84a00b6853))
* **scan:** token start should skip leading white spaces and comments ([64eea11](https://github.com/meriyah/meriyah/commit/64eea116bd197a5ebb34dfeab2100d1425a08857)), closes [#81](https://github.com/meriyah/meriyah/issues/81)


### Features

* **all:** added Unicode v.13 support ([550f86f](https://github.com/meriyah/meriyah/commit/550f86fefbb6412b95f2f57dd5c598706291a060))
* **parser:** add .range: [start, end] to improve compatibility with ESTree tools ([f60ae26](https://github.com/meriyah/meriyah/commit/f60ae26e8d7d999fcb13ac60cf1e16d8ae97f3df))
* **parser:** support latest ESTree spec on optional chaining ([055eb1c](https://github.com/meriyah/meriyah/commit/055eb1c180c4922b5971c32e9e8e1fc079ef7c33))



## [1.9.6](https://github.com/meriyah/meriyah/compare/ade6e8f757beb2220783e7ab3bc6615d90bcdc91...v1.9.6) (2020-01-19)


### Bug Fixes

* **all:** fixed issue with TS bundle 'const enum'. Values out of order and tokens got wrong values ([4ed317c](https://github.com/meriyah/meriyah/commit/4ed317cdeb4ee649e818c30212e448f331fc6596))
* **all:** Improved ESTree compat ([4192641](https://github.com/meriyah/meriyah/commit/4192641c1ad45c4989965a6ee9ca81d92c6891ca))
* **all:** used logical names to avoid confusions ([6f25b7b](https://github.com/meriyah/meriyah/commit/6f25b7b4fde7d35cb3ec84935dc8e8bbb6fbb815))
* **chore:** improved line and coloumn tracking - [#46](https://github.com/meriyah/meriyah/issues/46) ([dc2f3be](https://github.com/meriyah/meriyah/commit/dc2f3bef49a32f5a3215522220f2b33f713eb6c3))
* **lexer:** dedupe some code ([bc86b42](https://github.com/meriyah/meriyah/commit/bc86b422f3baa1e5e5cb83f2832eebf19f41a7c9))
* **lexer:** fixed a optional chaining token bug introduced earlier ([79e8fa3](https://github.com/meriyah/meriyah/commit/79e8fa31c04458ad796653064cd17e9449c875c4))
* **lexer:** fixed CRLF issues - [#46](https://github.com/meriyah/meriyah/issues/46) ([43bc755](https://github.com/meriyah/meriyah/commit/43bc7551af1d3b93453ae592c87b113e52f4252d))
* **lexer:** fixed incorrect error messages ([1934295](https://github.com/meriyah/meriyah/commit/1934295c947ee70d857b56773d310428d485f257))
* **lexer:** fixed issue with PS and LS between tokens ([3dd08b3](https://github.com/meriyah/meriyah/commit/3dd08b3ed6eb17247b90d021b8e38cee679dd249))
* **lexer:** fixed issue with raw in numeric scanning ([db21faf](https://github.com/meriyah/meriyah/commit/db21faf09ca54a3766666fc5dfc9b65d519ca8a3))
* **lexer:** fixed JSX issue break bundled build only and in the REPL ([32f347f](https://github.com/meriyah/meriyah/commit/32f347f5399e37e2ff5d7a009a76acede4145965))
* **lexer:** fixed JSX issue in lexer. Caused only the bundled build to break on JSX parsing. ([0bc45af](https://github.com/meriyah/meriyah/commit/0bc45af2e562c1eebede23bf125ecad41c80a914))
* **lexer:** fixed loc tracking for jsx and optimized jsx scanning ([708a1a6](https://github.com/meriyah/meriyah/commit/708a1a63374a4fdbbf422028d66b8e35f26a1247))
* **lexer:** fixed potensial issue with BOM ([b380d62](https://github.com/meriyah/meriyah/commit/b380d6275293045808ca62951b3a5334b8536e31))
* **lexer:** fixed WS skipping issue ([bf27362](https://github.com/meriyah/meriyah/commit/bf27362f06f15031aaa148f25643a60a941cdbf1))
* **lexer:** fixed ZWJ issue in identifierPart validation ([3708214](https://github.com/meriyah/meriyah/commit/3708214121e8de4d74560755ed2b6fa673755f70))
* **lexer:** improved identifier scanning ([bb65cd7](https://github.com/meriyah/meriyah/commit/bb65cd744415ed41fe690cb4cd6f298f5049a8f5))
* **lexer:** improved identifier scanning performance ([29c1d3d](https://github.com/meriyah/meriyah/commit/29c1d3d993f9e345bf42ea9528464643f5dfa592))
* **lexer:** improved identifier scanning performance ([15131d4](https://github.com/meriyah/meriyah/commit/15131d4738d293a72ee542d924531f67518236a1))
* **lexer:** improved line counting ([c29be84](https://github.com/meriyah/meriyah/commit/c29be847f393d05fcc0bdcb322a5e4507da5d002))
* **lexer:** improved punctuator scanning ([ddef09f](https://github.com/meriyah/meriyah/commit/ddef09f4ca1cc54c6fe431a93ad839b3b533d78b))
* **lexer:** improved scanner performance ([c637ee5](https://github.com/meriyah/meriyah/commit/c637ee5ca277c5347690d4ba94ce919a969aaebd))
* **lexer:** improved single line comment scanning ([9370535](https://github.com/meriyah/meriyah/commit/937053511de83f296befc510ca6ebc481a13ffcb))
* **lexer:** improved template literal scanning ([68175f6](https://github.com/meriyah/meriyah/commit/68175f6114e2fd9eab099dfaba05c49505f2fdfc))
* **lexer:** improved template scanning ([a2af86f](https://github.com/meriyah/meriyah/commit/a2af86ff88028fc3b6c3a22d9e0f8f53bd12150d))
* **lexer:** improved unicode escape scanning ([61c471b](https://github.com/meriyah/meriyah/commit/61c471b53a12fb6c460fe961d4f37b925592ce86))
* **lexer:** minor optimization tweaks ([20a118c](https://github.com/meriyah/meriyah/commit/20a118c67db5bbd179d9a328d47a268e40b50f6a))
* **lexer:** optimized number scanning ([0a09e9e](https://github.com/meriyah/meriyah/commit/0a09e9ed7be4891b6cfa2c4e004cbc15eb7be399))
* **lexer:** optimized WS skipping and comment scanning ([9f85539](https://github.com/meriyah/meriyah/commit/9f855395e9691c03cbeff3ea9d9c17a3f104d37b))
* **lexer:** performance tweaks ([01557c8](https://github.com/meriyah/meriyah/commit/01557c8d1784fad68971fd52916927efee603e10))
* **lexer:** performance tweaks ([109fdbb](https://github.com/meriyah/meriyah/commit/109fdbbd3a77e85392f49f9d68b699ebb25a0fb7))
* **lexer:** simplified a few things in the lexer ([8415be7](https://github.com/meriyah/meriyah/commit/8415be7b7b8772e8d780a3e71d2a3aa67be95bb5))
* **lexer:** simplified SMP scanning ([58f4a30](https://github.com/meriyah/meriyah/commit/58f4a30c3228e49c310c4abf398ea1c3c033e1b1))
* **lexer:** tweaked ident scanning ([a205210](https://github.com/meriyah/meriyah/commit/a205210e66dcf2122b5a454979e398d2f9b8acf6))
* **lexer:** tweaked number scanning ([e2d78cc](https://github.com/meriyah/meriyah/commit/e2d78ccb6df9cc5a5647cfedb1ef603729e361e0))
* **lexer:** tweaked numeric separators implementation ([4cfcb28](https://github.com/meriyah/meriyah/commit/4cfcb28fb71a062d91a76e700374006780ee578f))
* **lexer:** use direct lookup and avoid bitmasks for idStart & idContinue ([901bfb0](https://github.com/meriyah/meriyah/commit/901bfb083282304047fdfc72617a9bad6d5d74e3))
* **parser:**  fixed useless context definition, since its value is never read ([7eec823](https://github.com/meriyah/meriyah/commit/7eec823cdc54a2912202bcbcd52048f5d5aee8e4))
* **parser:**  swapped names on bitmasks for destruct and assign ([f3eb024](https://github.com/meriyah/meriyah/commit/f3eb02455c9ad8d0a62fbde052cd5b103b7f046f))
* **parser:** added 'onComment' types ([3ce01f3](https://github.com/meriyah/meriyah/commit/3ce01f3a8704dc12301a1d790bd53a1a11aae23d))
* **parser:** Adds error loc object to be Acorn compat. fixes [#43](https://github.com/meriyah/meriyah/issues/43) . ([a474cd7](https://github.com/meriyah/meriyah/commit/a474cd7cf69c5098c8c4685b23fa8e84cde58656))
* **parser:** adjusted loc and ranges for JSX AST nodes ([7073fdd](https://github.com/meriyah/meriyah/commit/7073fddeafdb3d75845ffc9e7391d149b5225915))
* **parser:** avoid 'push' in module parsing (performance) ([e99a8a8](https://github.com/meriyah/meriyah/commit/e99a8a8997ceea08aadc14dae78a228c616242bf))
* **parser:** avoid reinterpretation to pattern if not needed ([671dc57](https://github.com/meriyah/meriyah/commit/671dc573cf5046fdf828bb955770561e380f2e16))
* **parser:** avoid setting 'PropertyKind' if a field definition ([9498c55](https://github.com/meriyah/meriyah/commit/9498c5524d96179973e0d407273a4b0befbda04c))
* **parser:** changed name on options to be Acorn compat ([43b0029](https://github.com/meriyah/meriyah/commit/43b00299bdd7bd14c2f42adfb74daf6e597cd5db))
* **parser:** Context based escape keyword validation ([17d4649](https://github.com/meriyah/meriyah/commit/17d46497c7b75aa3d56009ecfb4df777430ab7b9))
* **parser:** dedupe class field parsing ([4c61090](https://github.com/meriyah/meriyah/commit/4c610901cc7777cc7c3136b39d228c2aa71c1880))
* **parser:** dedupe even more logic for perf reasons ([6af320c](https://github.com/meriyah/meriyah/commit/6af320c810c31af5ce8ba911d51469116097b737))
* **parser:** dedupe some code ([21e4449](https://github.com/meriyah/meriyah/commit/21e4449cd70fec6c2d3c8e01af37f528dd4b771c))
* **parser:** dedupe some code ([ca79f80](https://github.com/meriyah/meriyah/commit/ca79f80f8329f04a45dbbacf4a027aaa937d56f1))
* **parser:** dedupe some code ([c41a671](https://github.com/meriyah/meriyah/commit/c41a671a8e03e6b84293f0eba16247feebaceb27))
* **parser:** dedupe some code ([0a53f77](https://github.com/meriyah/meriyah/commit/0a53f77446eeeaa70e77f5ddfc02690ccc1817ec))
* **parser:** dedupe some code ([91e0233](https://github.com/meriyah/meriyah/commit/91e023390a0a57170a62796d2a04368bc9216ad2))
* **parser:** dedupe some code ([42f1afa](https://github.com/meriyah/meriyah/commit/42f1afa1f171aa19394734eeb5dc438151c7ab0a))
* **parser:** dedupe some code ([16c95b1](https://github.com/meriyah/meriyah/commit/16c95b1111cd33115b2ef7fa8d5bc66a5e2aa183))
* **parser:** dedupe some code ([82d9407](https://github.com/meriyah/meriyah/commit/82d9407882593a4af6eff13733128fc39ec255fc))
* **parser:** dedupe some code ([3c1409a](https://github.com/meriyah/meriyah/commit/3c1409ad224ccb3092ebb33959800e79f388fc9c))
* **parser:** dedupe some code ([5265848](https://github.com/meriyah/meriyah/commit/52658489e1896c07e97dae936e33c123400d1f67))
* **parser:** dedupe some code ([51fcd14](https://github.com/meriyah/meriyah/commit/51fcd143baef72619074377bbc492cf97861c6e4))
* **parser:** dedupe some code ([0858e3b](https://github.com/meriyah/meriyah/commit/0858e3bcdc2ae766b4e4c2b6f1f2a73605ce5f97))
* **parser:** dedupe some code and improved performance ([b972e90](https://github.com/meriyah/meriyah/commit/b972e90bd19b11dd695af6ef7c8f273f3677e0d8))
* **parser:** dedupe some logic ([de7d970](https://github.com/meriyah/meriyah/commit/de7d9706aeabf50327cabc756aab944058efd67f))
* **parser:** dedupe some logic for perf reasons ([fd7f2d8](https://github.com/meriyah/meriyah/commit/fd7f2d8bdb73161f78b167dc32b38f59c9b3b9d6))
* **parser:** Dedupe some logic to reduce branching ([a69476c](https://github.com/meriyah/meriyah/commit/a69476ca2003b7b771160b0ff6e01cd6df5a9bb3))
* **parser:** export Options & ESTree TS types ([9e8ff6c](https://github.com/meriyah/meriyah/commit/9e8ff6c83731a5958d6e89ec6132db43da38a85d))
* **parser:** Fix a bunch of edge cases ([96126e4](https://github.com/meriyah/meriyah/commit/96126e492b1b714edd2d08f3d4b788b14415bf12))
* **parser:** Fix a bunch of edge cases ([edfe03c](https://github.com/meriyah/meriyah/commit/edfe03c891d3442b8368fd64567a7345c72e18f3))
* **parser:** fixed __proto__ edge cases ([91cdefd](https://github.com/meriyah/meriyah/commit/91cdefd3630bd36fd84e611f7f82558183db23cd))
* **parser:** Fixed "ecma262 PR 1174" implementation ([0bd2a60](https://github.com/meriyah/meriyah/commit/0bd2a605fa9a23bb88becb86f305423ba98ffbc9))
* **parser:** fixed [#37](https://github.com/meriyah/meriyah/issues/37) ([6c28caf](https://github.com/meriyah/meriyah/commit/6c28cafec6823e86963fe8448781403e33c3e0e0))
* **parser:** fixed a bunch of edge cases ([14160c5](https://github.com/meriyah/meriyah/commit/14160c59e9791b83d477a31ecb8569da77a1df37))
* **parser:** fixed a bunch of edge cases ([1a100ba](https://github.com/meriyah/meriyah/commit/1a100bac63ec3bdf7d6488516d1d185c4031c59f))
* **parser:** fixed a bunch of edge cases ([fe941bc](https://github.com/meriyah/meriyah/commit/fe941bc64d60a0fef3b4013afed52b3ab17a23a6))
* **parser:** fixed a bunch of edge cases ([2fd9c4e](https://github.com/meriyah/meriyah/commit/2fd9c4e79a6058b7529aff54a3cc2a74b3c5771d))
* **parser:** Fixed a bunch of edge cases ([d7e08fe](https://github.com/meriyah/meriyah/commit/d7e08fef14d7f6757d481041d030d1fb7623a242))
* **parser:** Fixed a bunch of edge cases ([9854a83](https://github.com/meriyah/meriyah/commit/9854a83351f268431dd2d72763aa1dc94cd9200a))
* **parser:** fixed a couple of edge cases ([f4de592](https://github.com/meriyah/meriyah/commit/f4de592ea791eef60fc84849fab77b830ad6b37a))
* **parser:** fixed a few edge cases ([0a425ba](https://github.com/meriyah/meriyah/commit/0a425bac4f49734b042d4e05b1c0de0b0e1268fd))
* **parser:** fixed a few edgy cases ([43130ac](https://github.com/meriyah/meriyah/commit/43130ac9ce7e0d822bc58f9d278709afd83ee33f))
* **parser:** fixed a few edgy cases for  escape keywords ([5165c2e](https://github.com/meriyah/meriyah/commit/5165c2e1bfc8287f8cb39749c03924c78b485660))
* **parser:** fixed a few non-throwing edge cases ([c9e08cd](https://github.com/meriyah/meriyah/commit/c9e08cda3a608f5de40d52e16dac7febd9fda8e8))
* **parser:** fixed a few non-throwing edge cases ([8977bd8](https://github.com/meriyah/meriyah/commit/8977bd8e57823225cf721990bf129ff49111dae1))
* **parser:** fixed a slip up ([e9f5950](https://github.com/meriyah/meriyah/commit/e9f59507504379fcffce2e6dde46595d4a5b5684))
* **parser:** fixed a slip-up ([7aab914](https://github.com/meriyah/meriyah/commit/7aab91440be28bbcd66a4199ee0f3649cb764014))
* **parser:** fixed an issue where async as ident wasn't assignable ([48b67c3](https://github.com/meriyah/meriyah/commit/48b67c3560ce226f5d73a06d2ce817a28bc7141b))
* **parser:** fixed AST output for optional chaining ([18d6735](https://github.com/meriyah/meriyah/commit/18d6735a888a15977018c9631733f145d660d3a0))
* **parser:** fixed async arrow edge cases ([65e6c20](https://github.com/meriyah/meriyah/commit/65e6c203bd287b9320fe0144a591ec743679866b))
* **parser:** fixed async await edge cases ([7ffdea3](https://github.com/meriyah/meriyah/commit/7ffdea3d6e97f4254ccae9b7a0e8a361c226efce))
* **parser:** fixed bunch of class field edge cases ([48077ab](https://github.com/meriyah/meriyah/commit/48077ab9665713cd0c82833a452af3da56c81885))
* **parser:** fixed bunch of class field edge cases ([75c881a](https://github.com/meriyah/meriyah/commit/75c881a1d2fcf39560904746722f4021b43db4b7))
* **parser:** fixed bunch of edge cases ([f18f5b4](https://github.com/meriyah/meriyah/commit/f18f5b467eac24c5c0528a5b72edeaec68d91132))
* **parser:** fixed class field edge cases ([de0d0b5](https://github.com/meriyah/meriyah/commit/de0d0b596497ef24da01e1b5f3c0258588b5e986))
* **parser:** fixed computed property names - added missing "parseMemberOrUpdateExpression" ([01add5d](https://github.com/meriyah/meriyah/commit/01add5d07bbdff6fca1978cb50da07b49407ecc3))
* **parser:** fixed confusing error message ([a6e0e71](https://github.com/meriyah/meriyah/commit/a6e0e71e17d4da1b9469abdc78e4d176d2524628))
* **parser:** fixed const enum values and extended API tests to guard against TS issues ([c69ac52](https://github.com/meriyah/meriyah/commit/c69ac520d9dfeca8e9e1059012793f58c7d2e70f))
* **parser:** fixed directive prologue edge cases ([9092515](https://github.com/meriyah/meriyah/commit/9092515322666e77402ac83802b10645e49329f2))
* **parser:** fixed duplicate call to 2parseMemberOrUpdateExpression" ([501b76c](https://github.com/meriyah/meriyah/commit/501b76c41036210d035509b81f07f68700ca5bc3))
* **parser:** fixed edge cases ([b7cc2f8](https://github.com/meriyah/meriyah/commit/b7cc2f827a2ce06dec6b8cb0ca7b489a77f42c61))
* **parser:** fixed edge cases ([6397c0f](https://github.com/meriyah/meriyah/commit/6397c0fa4cff32d0ccd562054061c0923b3c5195))
* **parser:** fixed edge cases and corrected a few tests ([c2c56da](https://github.com/meriyah/meriyah/commit/c2c56dad9e84038742156ffdf183a75184a28518))
* **parser:** fixed edge cases and test coverage ([e1da2d2](https://github.com/meriyah/meriyah/commit/e1da2d29c38b3ce288d3c756de20c15d490da1f3))
* **parser:** fixed edgy cases ([a4434ef](https://github.com/meriyah/meriyah/commit/a4434ef75c53158dcaf56f3ffaee21a177b4123f))
* **parser:** fixed escape keyword edgy cases ([6c48765](https://github.com/meriyah/meriyah/commit/6c487651a2bf62a8c36c80803cb5922be34693c6))
* **parser:** fixed escape keywords ([de9c43b](https://github.com/meriyah/meriyah/commit/de9c43b10dde8fce845fca9e1aa7f7d3274c67fb))
* **parser:** fixed eval and arguments validations ([1a927be](https://github.com/meriyah/meriyah/commit/1a927be61aa05f1847db5878a4e829d684611811))
* **parser:** Fixed for-statement edge case ([544a7e7](https://github.com/meriyah/meriyah/commit/544a7e7c99ec59a01e0ef0903ec37c57b1f08976))
* **parser:** fixed for-statement ranges ([68481ee](https://github.com/meriyah/meriyah/commit/68481eee7c5d42e20ae75f271eb4b2aeda133fe3))
* **parser:** fixed import call and added 'ImportExpression' AST node ([f735377](https://github.com/meriyah/meriyah/commit/f735377fe3eb9476e1c16f5e1dd83df4c0d8a70f))
* **parser:** fixed import call implementation ([cb09a9c](https://github.com/meriyah/meriyah/commit/cb09a9cb1abb5819d781c8471380b542c851052a))
* **parser:** Fixed incorrect capitalized option ([917a0f1](https://github.com/meriyah/meriyah/commit/917a0f17afbdeba20eacce4dbcc8bb2c2b963d3e))
* **parser:** fixed incorrect error locations ([6d894e5](https://github.com/meriyah/meriyah/commit/6d894e5425a134a163ddfddd74a681b55308fa0f))
* **parser:** fixed issue with  OctalEscapeSequence discovered by fuzzer ([5d62f79](https://github.com/meriyah/meriyah/commit/5d62f79160c202a5d49648b2dcc6d912be3693c2))
* **parser:** fixed issue with a directive preceding an 'use strict' directive containing  an OctalEscapeSequence ([84bd498](https://github.com/meriyah/meriyah/commit/84bd4986de30bc407745a72bb5b5e27268e9030e))
* **parser:** fixed issue with module code not in strict mode in a few cases ([c6d24b6](https://github.com/meriyah/meriyah/commit/c6d24b6883a738f74b31068ab06aa201bffdd464))
* **parser:** fixed issue with private field didn't pass the 'kind' state ([bd6ec68](https://github.com/meriyah/meriyah/commit/bd6ec689cf4e582f2c7f405f4f7b948e9c5db07b))
* **parser:** Fixed issue with single line comment extraction. Exposed parser obj instead of comment end value ([a9a8958](https://github.com/meriyah/meriyah/commit/a9a8958018c66feff8466cbd26b1babb7c92503b))
* **parser:** fixed issue with template & sequence expr ([627cf3b](https://github.com/meriyah/meriyah/commit/627cf3b73ca99c76941516f08ac11af226d94915))
* **parser:** fixed JSX non failing cases ([e5bc9de](https://github.com/meriyah/meriyah/commit/e5bc9defe5fe54499d7085e7397c4c156ade8b2b))
* **parser:** fixed lexical edge case ([98c6ee7](https://github.com/meriyah/meriyah/commit/98c6ee796740feb12f635e47cc9b954bb9fa649d))
* **parser:** fixed lgtm warnings ([558ba1f](https://github.com/meriyah/meriyah/commit/558ba1fcb9130c887c52ee24ac6f5f7addb092ca))
* **parser:** fixed lgtm warnings ([e14cb97](https://github.com/meriyah/meriyah/commit/e14cb975f3ca5ac4b0d732c3da77910de4fe59ff))
* **parser:** fixed lgtm warnings ([0d20e52](https://github.com/meriyah/meriyah/commit/0d20e5277ccc9ff375ec067458f5c304b2e95028))
* **parser:** fixed LGTM warnings ([7746e25](https://github.com/meriyah/meriyah/commit/7746e25b9910d30b3170cefd2d295c85a261c5bc))
* **parser:** fixed LGTM warnings ([d58536e](https://github.com/meriyah/meriyah/commit/d58536e123fe5d5a1ccb489b95edb5842487e035))
* **parser:** fixed LGTM warnings ([c3efc64](https://github.com/meriyah/meriyah/commit/c3efc645b18743a9e09cbddce2d3786232efb422))
* **parser:** Fixed LGTM warnings ([7d36ae3](https://github.com/meriyah/meriyah/commit/7d36ae3b0ab7dc6061d8d6716afe5a62f78e9edf))
* **parser:** fixed negative bitmask values ([972a6f0](https://github.com/meriyah/meriyah/commit/972a6f01297c5c2268f15867349547a3c8e5ec67))
* **parser:** Fixed non-failing cases ([2e3ff8d](https://github.com/meriyah/meriyah/commit/2e3ff8d8f7ae1702f7c9d9c077e4c23226bceb6b))
* **parser:** Fixed object lit edge cases ([1c0c2e8](https://github.com/meriyah/meriyah/commit/1c0c2e8d1b8d7122a7a3dc12d5948487e740f054))
* **parser:** fixed possible conflicts ([b72ffe2](https://github.com/meriyah/meriyah/commit/b72ffe22adfe2cec0511f69877cc82f4e14575d8))
* **parser:** fixed possible performance regression ([80c75de](https://github.com/meriyah/meriyah/commit/80c75de7d1fe7f83fc12a697121a43df7fdd037d))
* **parser:** fixed template expression edge cases ([281ad30](https://github.com/meriyah/meriyah/commit/281ad3071fc4b8289b32d144d443c3608a969012))
* **parser:** fixed Test262 test suite edge cases ([c9545fe](https://github.com/meriyah/meriyah/commit/c9545fe968ffe32221af587f120aaeb8213993c7))
* **parser:** fixed unused func params ([12ba7e6](https://github.com/meriyah/meriyah/commit/12ba7e6f84a5a9bb4168552e39a265ab72e8e88b))
* **parser:** fixed wrong line count in single line comment ([c35b6d0](https://github.com/meriyah/meriyah/commit/c35b6d08b6c18df656aa8e5fbaebb1bf90b877d2))
* **parser:** Fixes [#25](https://github.com/meriyah/meriyah/issues/25) ([c2b96cb](https://github.com/meriyah/meriyah/commit/c2b96cb3de7aabd10045f08b81539ef37bad71cc))
* **parser:** fixes [#31](https://github.com/meriyah/meriyah/issues/31) ([7576780](https://github.com/meriyah/meriyah/commit/7576780a9467ac897fe7a69ebef93c613e0790dc))
* **parser:** fixes [#38](https://github.com/meriyah/meriyah/issues/38) ([9834975](https://github.com/meriyah/meriyah/commit/9834975321cad92d1d79795354ae41dc600a0285))
* **parser:** Fixes [#5](https://github.com/meriyah/meriyah/issues/5) ([7805610](https://github.com/meriyah/meriyah/commit/78056102d8ceb0e60a987c2b19ea6833c3f0b7a7))
* **parser:** fixes [#58](https://github.com/meriyah/meriyah/issues/58) ([bbfc5c2](https://github.com/meriyah/meriyah/commit/bbfc5c2e1e9e5748ef496544a785d12454179a53))
* **parser:** fixes assignment edge cases ([b2cf29f](https://github.com/meriyah/meriyah/commit/b2cf29f0b13d5a884295cd8d5238becb07a1325c))
* **parser:** fixes do while edge cases ([024e459](https://github.com/meriyah/meriyah/commit/024e4595805af50b677bbb0d6092b0243dd902dc))
* **parser:** fixes loc tracking for optional chaining ([e875e14](https://github.com/meriyah/meriyah/commit/e875e14579bab71df8fc00094f296c37dfea89db))
* **parser:** fixes yield edge cases ([54d5669](https://github.com/meriyah/meriyah/commit/54d56691dde6e77c0c86555b638f8c6fb51fce86))
* **parser:** implemented optional chaining ([cc334f3](https://github.com/meriyah/meriyah/commit/cc334f3ceafa77bd55187a8252962ce3c6369311))
* **parser:** Improved a bunch of yield edge cases ([e58ea2b](https://github.com/meriyah/meriyah/commit/e58ea2b1c8f515ab03a6e4859bc983809aa7fc2c))
* **parser:** improved comment extraction ([1f1daf9](https://github.com/meriyah/meriyah/commit/1f1daf926c37139ea72c98799c769819ec66f174))
* **parser:** improved error reporting for duplicate bindings ([0483d25](https://github.com/meriyah/meriyah/commit/0483d25f3794f0b8d339f1e920d036b443e0eaca))
* **parser:** improved module code parsing ([9ecef95](https://github.com/meriyah/meriyah/commit/9ecef95779b2de807bc54e59e8389dd30b387008))
* **parser:** improved nullish coalescing  performance ([83cbdd5](https://github.com/meriyah/meriyah/commit/83cbdd54323e467d7dfb626fd18646aa4f366ecf))
* **parser:** improved optional chaing implementation ([c8532d9](https://github.com/meriyah/meriyah/commit/c8532d9a95fd611fe902771fe0a07eb7d5681b27))
* **parser:** improved optional chaining implementation ([90c139c](https://github.com/meriyah/meriyah/commit/90c139ce36af5fdd2500e365f23ed305445bfdec))
* **parser:** improved optional chaining implementation ([2766dd9](https://github.com/meriyah/meriyah/commit/2766dd9303a3775a09492f4ca9bfd68015b0dd0d))
* **parser:** improved performance - create less lexical scopes ([8485cbb](https://github.com/meriyah/meriyah/commit/8485cbb9d6a75a2a4d9cbbfaef1b29278bc94ac7))
* **parser:** improved performance for edgy cases ([c8a3677](https://github.com/meriyah/meriyah/commit/c8a3677cc1d834b6aa93e1ef67d8b30e2349b0f2))
* **parser:** improved performance for import default ([e814e36](https://github.com/meriyah/meriyah/commit/e814e3603cafb6ec10b99c03744513b1e7310e43))
* **parser:** JSX attributes must only be assigned a non-empty 'expression' ([712d8e6](https://github.com/meriyah/meriyah/commit/712d8e6030e4ab60714747e66bcfe9210eead021))
* **parser:** make nested async arrow assignable ([83c8db0](https://github.com/meriyah/meriyah/commit/83c8db0514d3605a8ae5e7936e9d71bb0f583642))
* **parser:** minor refactoring & performance tweaks ([39dc0e7](https://github.com/meriyah/meriyah/commit/39dc0e79000854cc35362f4e79b1c9bfdadc6910))
* **parser:** minor tweaks ([6a14bab](https://github.com/meriyah/meriyah/commit/6a14babb6200c8d953ad00433ae095c78e7cdbf9))
* **parser:** minor tweaks ([35ead44](https://github.com/meriyah/meriyah/commit/35ead44cb0fee7160ec0ce02e062a17a5cb83526))
* **parser:** minor tweaks ([7080dee](https://github.com/meriyah/meriyah/commit/7080dee35b7bb64d40932df1a100b9e4783a1cd1))
* **parser:** moved enums to common.ts for improved readability ([09683b4](https://github.com/meriyah/meriyah/commit/09683b4e83b704c146fe144c1c6aa3a0fa3f7c92))
* **parser:** moved func flags to 'common.ts' ([21e771d](https://github.com/meriyah/meriyah/commit/21e771d4f4f165bc83f064a581afa02772256169))
* **parser:** now unsets 'SimpleParameterList' masks correctly ([f48b486](https://github.com/meriyah/meriyah/commit/f48b486a1eb8b8de031725c62b3e0264fabadc44))
* **parser:** optimization tweaks ([9e983a8](https://github.com/meriyah/meriyah/commit/9e983a8ed9e2a0e3cd7531ffbfedd74fa5a49702))
* **parser:** optimization tweaks ([49b78e3](https://github.com/meriyah/meriyah/commit/49b78e3eac08c70c161275bbe009055a9829739f))
* **parser:** optimized class field parsing ([2c1bf99](https://github.com/meriyah/meriyah/commit/2c1bf99d7e7f0911c423c30528dc97fcdb8e13c5))
* **parser:** pass 'inClass' as function argument ([5129b0a](https://github.com/meriyah/meriyah/commit/5129b0a5ee6b99cee40504d0fbb17241c91b9605))
* **parser:** performance improvements ([39f0a80](https://github.com/meriyah/meriyah/commit/39f0a802396d577d9dd3cb7153b4c158c660dd71))
* **parser:** performance improvements ([5bd745a](https://github.com/meriyah/meriyah/commit/5bd745ab7069ca3cd74af1e21fcb85dfc7f6a201))
* **parser:** performance improvements ([89c4006](https://github.com/meriyah/meriyah/commit/89c400678e18eb0814193964717f8af42c23e354)), closes [#21](https://github.com/meriyah/meriyah/issues/21)
* **parser:** performance improvements ([7f2c32f](https://github.com/meriyah/meriyah/commit/7f2c32ff7b657fc7764c1d22d021726d735804d6))
* **parser:** performance improvements ([62c2d6f](https://github.com/meriyah/meriyah/commit/62c2d6f0f87e5e1770ac00656092e29624fc146f))
* **parser:** permanently fixed yield edge cases ([6166b2b](https://github.com/meriyah/meriyah/commit/6166b2ba9703107ca0eb2c41e747e2970f51d770))
* **parser:** prevented a possible var name conflict ([fc310db](https://github.com/meriyah/meriyah/commit/fc310dba10cf46824efe8856c9bfa615897bdacb))
* **parser:** reduced branching and simplified for parenthesized arrow head & async arrow ([25a5bff](https://github.com/meriyah/meriyah/commit/25a5bffc4364f0d26f5903d55d4985d76e887c2b))
* **parser:** refactored and simplified location tracking ([0899ad3](https://github.com/meriyah/meriyah/commit/0899ad37fab3cec42545727f7b79b77fa7d55c66))
* **parser:** Refactoring SyntaxError messages ([66098ea](https://github.com/meriyah/meriyah/commit/66098ea443b91ae12b15e55a7d1577f9a2b81f66))
* **parser:** removed reduntant empty binding validations ([cf98ab5](https://github.com/meriyah/meriyah/commit/cf98ab53a12915dfdc84e56e6ae49d7276643170))
* **parser:** removed some unused code and simplified a few things ([4ffe12d](https://github.com/meriyah/meriyah/commit/4ffe12d597367dd75c45651558b406e390617730))
* **parser:** removed some useless code ([597eaf2](https://github.com/meriyah/meriyah/commit/597eaf25d36ab4971a07df391321ec97fb0c911f))
* **parser:** removed unnecessary func args ([6c44bb7](https://github.com/meriyah/meriyah/commit/6c44bb75d86ff269f5bfcf61c6bf7d5ebe43b3b6))
* **parser:** removed unused code ([f423485](https://github.com/meriyah/meriyah/commit/f423485ea1a6af1ca75530a7d61fca7e3c10caf9))
* **parser:** removed unused code ([db4231b](https://github.com/meriyah/meriyah/commit/db4231bd49e20f34fd6ef0ec7332e301c0fb018e))
* **parser:** removed unused code and improved test coverage ([7b4b56f](https://github.com/meriyah/meriyah/commit/7b4b56fd1ee9a97cbcd1003652aff72895f0a5aa))
* **parser:** rename 'OptionalChain' AST node to 'OptionalExpression'. ([a184f67](https://github.com/meriyah/meriyah/commit/a184f6782d86fd18192a32684f5ae9775905fcdb))
* **parser:** renamed deFacto opt to "specDeviation" ([d2e7e08](https://github.com/meriyah/meriyah/commit/d2e7e08fc0c276de348e75f539d17eb739a0a0b8))
* **parser:** simplified arrow parsing ([db388db](https://github.com/meriyah/meriyah/commit/db388db66fb8bbbaa1f41d989bfa07fc93553d21))
* **parser:** simplified assignment expr parsing ([ce89217](https://github.com/meriyah/meriyah/commit/ce89217ec96d7d912fff747b4a0b6050963fc9de))
* **parser:** simplified async arrow parsing ([fb046c7](https://github.com/meriyah/meriyah/commit/fb046c777d1a000b7e744140990468e6d422af10)), closes [#22](https://github.com/meriyah/meriyah/issues/22)
* **parser:** simplified DestructuringAssignmentTarget validation ([6f04c41](https://github.com/meriyah/meriyah/commit/6f04c41dd868caad00f1db0bdc35499f1e7e18b0))
* **parser:** simplified DestructuringAssignmentTarget validation ([1ce5eb0](https://github.com/meriyah/meriyah/commit/1ce5eb04e2c614a2d205921d79fc6dc609212e8a))
* **parser:** simplified some logic ([7978118](https://github.com/meriyah/meriyah/commit/79781187d51b5e4dc3bd139864c8eb7d2606c844))
* **parser:** Skips one validation - Token.IsLogical will not "exist" unless "next" option enabled ([6941da7](https://github.com/meriyah/meriyah/commit/6941da78bde97a17ef084e5bfd69bc8577ac4387))
* **parser:** small corrections to line offset ([99406ac](https://github.com/meriyah/meriyah/commit/99406acc075d69d1555927efb10bf9c316fd65d6))
* **parser:** start with empty label set ([90d2d78](https://github.com/meriyah/meriyah/commit/90d2d78b423a7c7f5bfe9beeda4e7e02340c1fb5))
* **parser:** test import call both for module and script code ([66fe1b0](https://github.com/meriyah/meriyah/commit/66fe1b0d8cd9bf03c835dfcb5d6117525359554e))
* **parser:** throws on `super()` used in class field ([b659e5b](https://github.com/meriyah/meriyah/commit/b659e5b39f593814668b37392374fc74b77306c7))
* **parser:** tweaked and optimized JSX lexer code ([a701555](https://github.com/meriyah/meriyah/commit/a701555fc8a77f0415a10b04e0fbf176f94fb7c6))
* **parser:** tweaked await and yield parsing ([2bfe889](https://github.com/meriyah/meriyah/commit/2bfe8899c905f008c79f38c01c973ba087a715d3))
* **parser:** tweaked bit masks ([2b623cd](https://github.com/meriyah/meriyah/commit/2b623cd1a1e31a9a9c8de2acf7a3a1b73500325d))
* **parser:** tweaked bit masks ([1cb0718](https://github.com/meriyah/meriyah/commit/1cb0718828ea4cf518158dbe5e2b9e5c45aa7ada))
* **parser:** tweaked bit masks and improved performance ([a1f41a5](https://github.com/meriyah/meriyah/commit/a1f41a5ed64f86a44482945600c3afc2a9d60969))
* **parser:** tweaked performance ([4b7a9b5](https://github.com/meriyah/meriyah/commit/4b7a9b5daf970efece7ca1331b3b725ee2a74417))
* **parser:** tweaked ranges implementation ([e443537](https://github.com/meriyah/meriyah/commit/e443537c600b83932b69f36287cd08b0331225a3))
* **parser:** tweaked some code ([6acf9ad](https://github.com/meriyah/meriyah/commit/6acf9adb49ff72ed4cc486e1b607b7ca49f58335))
* **parser:** tweaked the label tracking ([77702c8](https://github.com/meriyah/meriyah/commit/77702c85b4bd4b7f407a01c717e5c12dbd2455be))
* **parser:** update group.ts ([cc915cc](https://github.com/meriyah/meriyah/commit/cc915cc4f502a424adf2d73cf068964b083d1dc3))
* **parser:** Use 'const' instead of 'let' ([f1bc71f](https://github.com/meriyah/meriyah/commit/f1bc71fab231a632ecaede604a6d7fdc585a4142))
* **parser:** WIP: fixed and optimized await edge cases ([7f006fc](https://github.com/meriyah/meriyah/commit/7f006fc0275bb17526563e72d3f1aab6c41be035))
* **parser:** WIP! await & yield edge cases ([13ce4e6](https://github.com/meriyah/meriyah/commit/13ce4e692c7ed535ea99eeab6d51cdee1f5e721f))
* **parser:** WIP! fixes bunch of yield edge case ([46b7cba](https://github.com/meriyah/meriyah/commit/46b7cba43ab2ebc482f387fd4c9d725de2bdc1f4))
* **scanner:** dedupe some scanner code and tweaked bit masks ([1e9d1b1](https://github.com/meriyah/meriyah/commit/1e9d1b1f42709fbb5e97adecaacdcb0756958dcf))


### Features

* **all:** added benchmark ([8a525b3](https://github.com/meriyah/meriyah/commit/8a525b36e290d4d6f8c8dd0dafc55ea77c6dec3e))
* **all:** Emit errors in standard format for compilers ([7f83f6a](https://github.com/meriyah/meriyah/commit/7f83f6a368c1b0fdd4d724f075887f140577bd0f))
* **lexer:** added lexer souce code ([ade6e8f](https://github.com/meriyah/meriyah/commit/ade6e8f757beb2220783e7ab3bc6615d90bcdc91))
* **lexer:** implement numeric literal scanning ([8ba7461](https://github.com/meriyah/meriyah/commit/8ba7461e9a2cfbafbf180da1792070b641c76e0a))
* **parser:**  enable line/column location information to each node ([75c43c7](https://github.com/meriyah/meriyah/commit/75c43c7005a8fc69fbbbf283556dec1c67ae354b))
* **parser:** 'export' '*' 'as' IdentifierName 'from' ModuleSpecifier ';' ([01db03c](https://github.com/meriyah/meriyah/commit/01db03c08816ffdb092ebd890130bfd189f5e3eb))
* **parser:** added 'sourceFile' option ([0c62a08](https://github.com/meriyah/meriyah/commit/0c62a08f9d176d37772f406cfac379cae4bdb599))
* **parser:** added label tracking ([930f825](https://github.com/meriyah/meriyah/commit/930f8251171a7f9e2219916a3b007efa179d7ac1))
* **parser:** added new option to allow edge cases that deviate from the spec ([30d8c23](https://github.com/meriyah/meriyah/commit/30d8c23bdb6d0a3b5f301e8c4b82d21c45f8c50f))
* **parser:** added option to enable non-standard parenthesized expression node ([82d423d](https://github.com/meriyah/meriyah/commit/82d423dc72a13b7cc745e9bbc664a678bff879d2))
* **parser:** added parser code ([866b546](https://github.com/meriyah/meriyah/commit/866b5460afa65a81cf4c6136352eb67db1629aec))
* **parser:** Distinguish Identifier from IdentifierPattern ([68da76b](https://github.com/meriyah/meriyah/commit/68da76b209ac871bb9d4b6d8f7b186c7709c7ea2))
* **parser:** Implemented Class Public Instance Fields (WIP) ([c08d907](https://github.com/meriyah/meriyah/commit/c08d907060f7f23d9fbdbae4804b83edd89c0fda))
* **parser:** implemented dynamic import (stage 3) ([64a54a8](https://github.com/meriyah/meriyah/commit/64a54a80560870dec179e1e4003b911cd2526363))
* **parser:** implemented import.meta as well ([e838c8e](https://github.com/meriyah/meriyah/commit/e838c8ea675bd9e2bc096fde87098275cf533873))
* **parser:** implemented support for v8 Intrinsic ([5e41577](https://github.com/meriyah/meriyah/commit/5e41577ab64cebdd98623c787310410328ffd568))
* **parser:** implements nullish coalescing (stage 3) ([f38480d](https://github.com/meriyah/meriyah/commit/f38480d3498da64270ed44c1802a75a9d3366b44))
* **parser:** implements ranges ([73ede30](https://github.com/meriyah/meriyah/commit/73ede309f518430f53a1a5adb7b3a1ce648ec781))
* **parser:** support latest TC39 specs ([82cb1f4](https://github.com/meriyah/meriyah/commit/82cb1f41209ea28792ceb4143007631b6dbd7295))
* **parser:** WIP: Enable JSX parsing ([9dd80d4](https://github.com/meriyah/meriyah/commit/9dd80d448e9877323a2edf12a9cde9c48fde411d))
* **parser:** WIP! Implements optional chaining ([09425fc](https://github.com/meriyah/meriyah/commit/09425fca1798fb2a82a893572005528dea301b62))


### Reverts

* Revert "Update parser.ts" ([9671b37](https://github.com/meriyah/meriyah/commit/9671b377b4089ee4ef69f6ab282b07c1d21fb974))
* Revert "dsaf" ([74edb5b](https://github.com/meriyah/meriyah/commit/74edb5b618a72f722d133a017a7a1fca5c2b063c))



