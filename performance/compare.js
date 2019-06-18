// The Cherow benchmark page is very heavily based (virtual copy with a few modifications)
// on the the Esprima's compare.html benchmark page
// http://esprima.org/test/compare.html

// Original copyright is included below:
/*
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var setupBenchmarks,
    parsers,
    fixtureList,
    resources,
    suite;

parsers = [
{
    name: 'Meriyah',
    src: '../meriyah.umd.js',
    version: function () {
        return window.meriyah.version;
    },
    parse: function (code) {
        var syntax = window.meriyah.parseScript(code, { ranges: false, locations: false });
        return syntax.body.length;
    }
},
{
    name: 'Cherow',
    src: '../cherow.umd.js',
    version: function () {
        return '1.6.9';
    },
    parse: function (code) {
        var syntax = window.kleuver.parseScript(code, { ranges: false, locations: false });
        return syntax.body.length;
    }
},
{
    name: 'Acorn',
    link: 'https://github.com/marijnh/acorn',
    src: 'https://unpkg.com/acorn',
    version: function () {
        return window.acorn.version;
    },
    parse: function (code) {
        var syntax = window.acorn.parse(code, { ranges: true, locations: true });
        return syntax.body.length;
    }
},
{
    name: 'Esprima',
    link: 'https://github.com/jquery/esprima',
    src: 'https://unpkg.com/esprima',
    version: function () {
        return window.esprima.version;
    },
    parse: function (code) {
        var syntax = window.esprima.parse(code, { range: true, loc: true });
        return syntax.body.length;
    }
},
];

fixtureList = [
//    'tsserver',
     'jquery-1.9.1',
//      'XMLHttpRequest',
      'jQuery.Mobile 1.4.2',
      'angular-1.6.6',
      'React 0.13.3',
      'typescript-2.5'
];

resources =
    parsers.map(parser => parser.src)
    .concat(fixtureList.map(fixture => '3rdparty/' + slug(fixture) + '.js'));

function slug(name) {
    'use strict';
    return name.toLowerCase().replace(/\.js/g, 'js').replace(/\s/g, '-');
}

function kb(bytes) {
    'use strict';
    return (bytes / 1024).toFixed(1);
}

function inject(fname) {
    'use strict';
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');

    script.src = fname;
    script.type = 'text/javascript';
    head.appendChild(script);
}

if (typeof window !== 'undefined') {

    // Run all tests in a browser environment.
    setupBenchmarks = function () {
        'use strict';

        function id(i) {
            return document.getElementById(i);
        }

        function setText(id, str) {
            var el = document.getElementById(id);
            if (typeof el.innerText === 'string') {
                el.innerText = str;
            } else {
                el.textContent = str;
            }
        }

        function enableRunButtons() {
            id('runwarm').disabled = false;
            id('runcold').disabled = false;
        }

        function disableRunButtons() {
            id('runwarm').disabled = true;
            id('runcold').disabled = true;
        }

        function createTable() {
            var str = '',
                i,
                index,
                test,
                name;

            str += '<table>';
            str += '<thead><tr><th>Source</th>';
            for (i = 0; i < parsers.length; i += 1) {
                name = parsers[i].name;
                if (parsers[i].link) {
                    name = '<a href="' + parsers[i].link + '">' + name + '</a>';
                }
                str += '<th>' + name + ' <span id="' + slug(parsers[i].name) + '-version"></th>';
            }
            str += '</tr></thead>';
            str += '<tbody>';
            for (index = 0; index < fixtureList.length; index += 1) {
                test = fixtureList[index];
                name = slug(test);
                str += '<tr>';
                str += '<td>' + test + '</td>';
                for (i = 0; i < parsers.length; i += 1) {
                    str += '<td id="' + name + '-' + slug(parsers[i].name) + '-time"></td>';
                }
                str += '</tr>';
            }
            str += '<tr><td><b>Total</b></td>';
            for (i = 0; i < parsers.length; i += 1) {
                str += '<td id="' + slug(parsers[i].name) + '-total"></td>';
            }
            str += '</tr>';
            str += '</tbody>';
            str += '</table>';

            id('result').innerHTML = str;
        }

        function loadResources() {

            var index = 0,
                totalSize = 0;

            function load(src, callback) {
                var xhr = new XMLHttpRequest(),
                    src = src;

                window.data = window.data || {};
                window.data[src] = '';

                try {
                    xhr.timeout = 30000;
                    xhr.open('GET', src, true);

                    xhr.ontimeout = function () {
                        setText('status', 'Error: time out while loading ' + src);
                        callback.apply();
                    };

                    xhr.onreadystatechange = function () {
                        var success = false,
                            size = 0;

                        if (this.readyState === XMLHttpRequest.DONE) {
                            if (this.status === 200) {
                                window.data[src] = this.responseText;
                                size = this.responseText.length;
                                totalSize += size;
                                success = true;
                            }
                        }

                        if (!success) {
                            setText('status', 'Please wait. Error loading ' + src);
                        }

                        callback.apply();
                    };

                    xhr.send(null);
                } catch (e) {
                    setText('status', 'Please wait. Error loading ' + src);
                    callback.apply();
                }
            }

            function loadNextResource() {
                var src;

                if (index < resources.length) {
                    src = resources[index];
                    index += 1;
                    setText('status', 'Please wait. Loading ' + src +
                            ' (' + index + ' of ' + resources.length + ')');
                    window.setTimeout(function () {
                        load(src, loadNextResource);
                    }, 100);
                } else {
                    setText('status', 'Ready.');
                    enableRunButtons();
                }
            }

            loadNextResource();
        }

        function setupParsers() {
            suite = [];
            for (let i = 0; i < fixtureList.length; i += 1) {
                for (let j = 0; j < parsers.length; j += 1) {
                    suite.push({
                        fixture: fixtureList[i],
                        parserInfo: parsers[j]
                    });
                }
            }

            createTable();
        }

        function runBenchmarks(warm) {
            for (let i = 0; i < parsers.length; i += 1) {
                window.eval(data[parsers[i].src]);
            }

            var index = 0,
                totalTime = {};

            function reset() {
                var i, name;
                for (i = 0; i < suite.length; i += 1) {
                    name = slug(suite[i].fixture) + '-' + slug(suite[i].parserInfo.name);
                    setText(name + '-time', '');
                }
                for (i = 0; i < parsers.length; i += 1) {
                    name = slug(parsers[i].name);
                    setText(name + '-total', '');
                    if (parsers[i].version) {
                        setText(name + '-version', parsers[i].version());
                    }
                }
            }

            function run() {
                var fixture, pp, test, source, fn, benchmark;

                if (index >= suite.length) {
                    setText('status', 'Ready.');
                    enableRunButtons();
                    return;
                }

                fixture = suite[index].fixture;
                pp = suite[index].parserInfo;

                source = window.data['3rdparty/' + slug(fixture) + '.js'];

                test = slug(fixture) + '-' + slug(pp.name);
                setText(test + '-time', 'Running...');

                setText('status', 'Please wait. Parsing ' + fixture + '...');

                // Force the result to be held in this array, thus defeating any
                // possible "dead code elimination" optimization.
                window.tree = [];

                // Poor man's error reporter for Traceur.
                console.reportError = console.error;

                var worker;

                if (warm) {
                    fn = function () {
                        window.tree.push(pp.parse(source));
                    };
                } else {
                    fn = function (deferred) {
                        worker = new Worker(URL.createObjectURL(new Blob([[
                            'var window = self;',
                            'importScripts("data:text/javascript,' + encodeURIComponent(data[pp.src]) + '");',
                            'addEventListener("message", function (event) {',
                            '   var startTime = performance.now();',
                            '   var result = (' + pp.parse + ')(event.data);',
                            '   postMessage({',
                            '       result: result,',
                            '       elapsed: performance.now() - startTime,',
                            '   });',
                            '   close();',
                            '});',
                            'postMessage({message: "loaded"});'
                        ].join('\n')], {type: 'text/javascript'})));
                        worker.onmessage = function (event) {
                            if (event.data.message === 'loaded') {
                                worker.postMessage(source);
                            } else {
                                deferred.resolve();
                                deferred.elapsed = event.data.elapsed / 1e3;
                            }
                        };
                    };
                }

                benchmark = new window.Benchmark(test, fn, {
                    defer: !warm,
                    'onComplete': function () {
                        var str = '';
                        str += (1000 * this.stats.mean).toFixed(1) + ' \xb1';
                        str += this.stats.rme.toFixed(1) + '%';
                        setText(this.name + '-time', str);

                        if (!totalTime[pp.name]) {
                            totalTime[pp.name] = 0;
                        }
                        totalTime[pp.name] += this.stats.mean;
                        setText(slug(pp.name) + '-total', (1000 * totalTime[pp.name]).toFixed(1) + ' ms');

                        index += 1;
                        if (warm) window.setTimeout(run, 221);
                        else run();
                    }
                });

                window.setTimeout(function () {
                    benchmark.run();
                }, 211);
            }


            disableRunButtons();
            setText('status', 'Please wait. Running benchmarks...');

            reset();
            run();
        }

        id('runwarm').onclick = function () {
            runBenchmarks(true);
        };
        id('runcold').onclick = function () {
            runBenchmarks(false);
        };

        setText('benchmarkjs-version', ' version ' + window.Benchmark.version);

        setupParsers();
        createTable();

        disableRunButtons();
        loadResources();
    };
} else {
    // TODO
    console.log('Not implemented yet!');
}
/* vim: set sw=4 ts=4 et tw=80 : */
