/*************************************************************
 *
 *  MathJax/extensions/TeX/mhchem.js
 *
 *  Implements the \ce command for handling chemical formulas
 *  from the mhchem LaTeX package.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2011-2015 The MathJax Consortium
 *  Copyright (c) 2015-2019 Martin Hensel
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(MathJax.Extension['TeX/mhchem'] = { version: '3.3.2' }),
  MathJax.Hub.Register.StartupHook('TeX Jax Ready', function () {
    var n = MathJax.InputJax.TeX,
      a = MathJax.Object.Subclass({
        string: '',
        Init: function (t) {
          this.string = t;
        },
        Parse: function (t) {
          try {
            return u.go(x.go(this.string, t));
          } catch (t) {
            n.Error(t);
          }
        },
      }),
      x = {
        go: function (t, n) {
          if (!t) return [];
          void 0 === n && (n = 'ce');
          var e,
            a = '0',
            o = {};
          (o['@@'] = 0),
            (t = (t = (t = t.replace(/\n/g, ' ')).replace(
              /[\u2212\u2013\u2014\u2010]/g,
              '-',
            )).replace(/[\u2026]/g, '...'));
          for (var r = 10, i = []; ; ) {
            e !== t ? ((r = 10), (e = t)) : r--;
            var c = x.t[n],
              u = c.u[a] || c.u['*'];
            t: for (var s = 0; s < u.length; s++) {
              var p = x._.s(u[s].pattern, t);
              if (p) {
                for (var _ = u[s].task, f = 0; f < _.h.length; f++) {
                  var h;
                  if (c.m[_.h[f].l]) h = c.m[_.h[f].l](o, p.s, _.h[f].S);
                  else {
                    if (!x.m[_.h[f].l])
                      throw ['MhchemBugA', 'mhchem bug A. Please report. (' + _.h[f].l + ')'];
                    h = x.m[_.h[f].l](o, p.s, _.h[f].S);
                  }
                  x.v(i, h);
                }
                if (((a = _.g || a), !(0 < t.length))) return i;
                if ((_.k || (t = p.$), !_.A)) break t;
              }
            }
            if (r <= 0) throw ['MhchemBugU', 'mhchem bug U. Please report.'];
          }
        },
        v: function (t, n) {
          if (n)
            if ('[object Array]' === Object.prototype.toString.call(n))
              for (var e = 0; e < n.length; e++) t.push(n[e]);
            else t.push(n);
        },
        _: {
          _: {
            '~z': /^$/,
            '~x': /^./,
            '~y': /^./,
            '%j': /^\s/,
            '%i': /^\s(?=[A-Z\\$])/,
            '`e': /^\s$/,
            '@X': /^[a-z]/,
            x: /^x/,
            x$: /^x$/,
            i$: /^i$/,
            '~J': /^(?:[a-zA-Z\u03B1-\u03C9\u0391-\u03A9?@]|(?:\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega)(?:\s+|\{\}|(?![a-zA-Z]))))+/,
            '@A': /^\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega)(?:\s+|\{\}|(?![a-zA-Z]))/,
            '~M': /^(?:([a-z])(?:$|[^a-zA-Z]))$/,
            '@a': /^\$(?:([a-z])(?:$|[^a-zA-Z]))\$$/,
            '~L': /^(?:\$?[\u03B1-\u03C9]\$?|\$?\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\s*\$?)(?:\s+|\{\}|(?![a-zA-Z]))$/,
            '~r': /^[0-9]+/,
            '@i': /^[+\-]?(?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))/,
            '@h': /^[+\-]?[0-9]+(?:[.,][0-9]+)?/,
            '%Q': function (t) {
              var n = t.match(
                /^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))?(\((?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))\))?(?:(?:([eE])|\s*(\*|x|\\times|\u00D7)\s*10\^)([+\-]?[0-9]+|\{[+\-]?[0-9]+\}))?/,
              );
              return n && n[0] ? { s: n.slice(1), $: t.substr(n[0].length) } : null;
            },
            '`a': function (t) {
              var n = t.match(
                /^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+)?)\^([+\-]?[0-9]+|\{[+\-]?[0-9]+\})/,
              );
              return n && n[0] ? { s: n.slice(1), $: t.substr(n[0].length) } : null;
            },
            '%k': function (t) {
              var n = x._.M(t, '', /^\([a-z]{1,3}(?=[\),])/, ')', '');
              if (n && n.$.match(/^($|[\s,;\)\]\}])/)) return n;
              var e = t.match(/^(?:\((?:\\ca\s?)?\$[amothc]\$\))/);
              return e ? { s: e[0], $: t.substr(e[0].length) } : null;
            },
            '`~': /^_\{(\([a-z]{1,3}\))\}/,
            '@L': /^(?:\\\{|\[|\()/,
            '@d': /^(?:\)|\]|\\\})/,
            ', ': /^[,;]\s*/,
            ',': /^[,;]/,
            '.': /^[.]/,
            '. ': /^([.\u22C5\u00B7\u2022])\s*/,
            '@j': /^\.\.\.(?=$|[^.])/,
            '* ': /^([*])\s*/,
            '@Q': function (t) {
              return x._.M(t, '^{', '', '', '}');
            },
            '@M': function (t) {
              return x._.M(t, '^', '$', '$', '');
            },
            '^a': /^\^([0-9]+|[^\\_])/,
            '@P': function (t) {
              return x._.M(t, '^', /^\\[a-zA-Z]+\{/, '}', '', '', '{', '}', '', !0);
            },
            '@O': function (t) {
              return x._.M(t, '^', /^\\[a-zA-Z]+\{/, '}', '');
            },
            '^\\x': /^\^(\\[a-zA-Z]+)\s*/,
            '%R': /^\^(-?\d+)/,
            "'": /^'/,
            '@V': function (t) {
              return x._.M(t, '_{', '', '', '}');
            },
            '@R': function (t) {
              return x._.M(t, '_', '$', '$', '');
            },
            _9: /^_([+\-]?[0-9]+|[^\\])/,
            '@U': function (t) {
              return x._.M(t, '_', /^\\[a-zA-Z]+\{/, '}', '', '', '{', '}', '', !0);
            },
            '@T': function (t) {
              return x._.M(t, '_', /^\\[a-zA-Z]+\{/, '}', '');
            },
            '@S': /^_(\\[a-zA-Z]+)\s*/,
            '^_': /^(?:\^(?=_)|\_(?=\^)|[\^_]$)/,
            '{}': /^\{\}/,
            '%y': function (t) {
              return x._.M(t, '', '{', '}', '');
            },
            '%x': function (t) {
              return x._.M(t, '{', '', '', '}');
            },
            '@`': function (t) {
              return x._.M(t, '', '$', '$', '');
            },
            '@b': function (t) {
              return x._.M(t, '${', '', '', '}$');
            },
            '@%': function (t) {
              return x._.M(t, '$', '', '', '$');
            },
            '%A': /^[=<>]/,
            '#': /^[#\u2261]/,
            '+': /^\+/,
            '-$': /^-(?=[\s_},;\]/]|$|\([a-z]+\))/,
            '-9': /^-(?=[0-9])/,
            '@g': /^-(?=(?:[spd]|sp)(?:$|[\s,;\)\]\}]))/,
            '-': /^-/,
            '``': /^(?:\\pm|\$\\pm\$|\+-|\+\/-)/,
            '~N': /^(?:\+|(?:[\-=<>]|<<|>>|\\approx|\$\\approx\$)(?=\s|$|-?[0-9]))/,
            '~`': /^(?:v|\(v\)|\^|\(\^\))(?=$|[\s,;\)\]\}])/,
            '@s': function (t) {
              return x._.M(t, '\\bond{', '', '', '}');
            },
            '->': /^(?:<->|<-->|->|<-|<=>>|<<=>|<=>|[\u2192\u27F6\u21CC])/,
            '@n': /^[CMT](?=\[)/,
            '@p': function (t) {
              return x._.M(t, '[', '', '', ']');
            },
            '`c': /^(&|@r|\\hline)\s*/,
            '@q': /^(?:\\[,\ ;:])/,
            '@H': function (t) {
              return x._.M(t, '', /^\\[a-zA-Z]+\{/, '}', '', '', '{', '}', '', !0);
            },
            '@G': function (t) {
              return x._.M(t, '', /^\\[a-zA-Z]+\{/, '}', '');
            },
            '@u': /^\\ca(?:\s+|(?![a-zA-Z]))/,
            '@F': /^(?:\\[a-zA-Z]+\s*|\\[_&{}%])/,
            '~O': /^(?:[0-9]{1,2}[spdfgh]|[0-9]{0,2}sp)(?=$|[^a-zA-Z])/,
            '~P': /^[\/~|]/,
            '@z': function (t) {
              return x._.M(t, '\\frac{', '', '', '}', '{', '', '', '}');
            },
            '@B': function (t) {
              return x._.M(t, '\\overset{', '', '', '}', '{', '', '', '}');
            },
            '@D': function (t) {
              return x._.M(t, '\\underset{', '', '', '}', '{', '', '', '}');
            },
            '@C': function (t) {
              return x._.M(t, '\\underbrace{', '', '', '}_', '{', '', '', '}');
            },
            '@x': function (t) {
              return x._.M(t, '\\color{', '', '', '}');
            },
            '@y': function (t) {
              return x._.M(t, '\\color{', '', '', '}', '{', '', '', '}');
            },
            '@w': function (t) {
              return x._.M(t, '\\color', '\\', '', /^(?=\{)/, '{', '', '', '}');
            },
            '@v': function (t) {
              return x._.M(t, '\\ce{', '', '', '}');
            },
            '~W': /^(?:[+-][IVX]+|\\pm\s*0|\$\\pm\$\s*0)$/,
            '%Y': /^(?:[+-]?\s?[IVX]+|\\pm\s*0|\$\\pm\$\s*0)$/,
            '%a': /^[IVX]+/,
            '@k': /^[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+(?:\$[a-z]\$|[a-z])?$/,
            '~@': function (t) {
              var n;
              if (
                (n = t.match(
                  /^(?:(?:(?:\([+\-]?[0-9]+\/[0-9]+\)|[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+|[+\-]?[0-9]+[.,][0-9]+|[+\-]?\.[0-9]+|[+\-]?[0-9]+)(?:[a-z](?=\s*[A-Z]))?)|[+\-]?[a-z](?=\s*[A-Z])|\+(?!\s))/,
                ))
              )
                return { s: n[0], $: t.substr(n[0].length) };
              var e = x._.M(t, '', '$', '$', '');
              return e &&
                (n = e.s.match(
                  /^\$(?:\(?[+\-]?(?:[0-9]*[a-z]?[+\-])?[0-9]*[a-z](?:[+\-][0-9]*[a-z]?)?\)?|\+|-)\$$/,
                ))
                ? { s: n[0], $: t.substr(n[0].length) }
                : null;
            },
            '~~': function (t) {
              return this['~@'](t);
            },
            '@c': /^(?:[A-Z][a-z]{0,2}|i)(?=,)/,
            '~B': function (t) {
              if (t.match(/^\([a-z]+\)$/)) return null;
              var n = t.match(
                /^(?:[a-z]|(?:[0-9\ \+\-\,\.\(\)]+[a-z])+[0-9\ \+\-\,\.\(\)]*|(?:[a-z][0-9\ \+\-\,\.\(\)]+)+[a-z]?)$/,
              );
              return n ? { s: n[0], $: t.substr(n[0].length) } : null;
            },
            '%w': /^(?:pH|pOH|pC|pK|iPr|iBu)(?=$|[^a-zA-Z])/,
            '/': /^\s*(\/)\s*/,
            '//': /^\s*(\/\/)\s*/,
            '*': /^\s*[*.]\s*/,
          },
          M: function (t, n, e, a, o, r, i, c, u, s) {
            var p = function (t, n) {
                if ('string' == typeof n) return 0 !== t.indexOf(n) ? null : n;
                var e = t.match(n);
                return e ? e[0] : null;
              },
              _ = p(t, n);
            if (null === _) return null;
            if (((t = t.substr(_.length)), null === (_ = p(t, e)))) return null;
            var f = (function (t, n, e) {
              for (var a = 0; n < t.length; ) {
                var o = t.charAt(n),
                  r = p(t.substr(n), e);
                if (null !== r && 0 === a) return { P: n, T: n + r.length };
                if ('{' === o) a++;
                else if ('}' === o) {
                  if (0 === a)
                    throw ['ExtraCloseMissingOpen', 'Extra close brace or missing open brace'];
                  a--;
                }
                n++;
              }
              return null;
            })(t, _.length, a || o);
            if (null === f) return null;
            var h = t.substring(0, a ? f.T : f.P);
            if (r || i) {
              var x = this.M(t.substr(f.T), r, i, c, u);
              if (null === x) return null;
              var m = [h, x.s];
              return { s: s ? m.join('') : m, $: x.$ };
            }
            return { s: h, $: t.substr(f.T) };
          },
          s: function (t, n) {
            var e = x._._[t];
            if (void 0 === e) throw ['MhchemBugP', 'mhchem bug P. Please report. (' + t + ')'];
            if ('function' == typeof e) return x._._[t](n);
            var a = n.match(e);
            return a
              ? { s: a[2] ? [a[1], a[2]] : a[1] ? a[1] : a[0], $: n.substr(a[0].length) }
              : null;
          },
        },
        m: {
          'a=': function (t, n) {
            t.a = (t.a || '') + n;
          },
          'b=': function (t, n) {
            t.b = (t.b || '') + n;
          },
          'p=': function (t, n) {
            t.p = (t.p || '') + n;
          },
          'o=': function (t, n) {
            t.o = (t.o || '') + n;
          },
          'q=': function (t, n) {
            t.q = (t.q || '') + n;
          },
          'd=': function (t, n) {
            t.d = (t.d || '') + n;
          },
          '%`': function (t, n) {
            t.rm = (t.rm || '') + n;
          },
          '%q': function (t, n) {
            t.F = (t.F || '') + n;
          },
          '~G': function (t, n, e) {
            return { l: e };
          },
          '~H': function (t, n, e) {
            return { l: e, p1: n };
          },
          '~I': function (t, n, e) {
            return { l: e, p1: n[0], p2: n[1] };
          },
          '~p': function (t, n) {
            return n;
          },
          rm: function (t, n) {
            return { l: 'rm', p1: n || '' };
          },
          '%p': function (t, n) {
            return x.go(n, '%p');
          },
          '%z': function (t, n) {
            var e = ['{'];
            return x.v(e, x.go(n, '%p')), e.push('}'), e;
          },
          '%o': function (t, n) {
            return x.go(n, '%o');
          },
          '%n': function (t, n) {
            return x.go(n, '%n');
          },
          '~c': function (t, n, e) {
            return { l: '~c', B: e || n };
          },
          '~j': function (t, n) {
            return { l: '~i', color: n[0] };
          },
          ce: function (t, n) {
            return x.go(n);
          },
          '@l': function (t, n) {
            var e = [];
            n.match(/^[+\-]/) && (e.push(n.substr(0, 1)), (n = n.substr(1)));
            var a = n.match(/^([0-9]+|\$[a-z]\$|[a-z])\/([0-9]+)(\$[a-z]\$|[a-z])?$/);
            return (
              (a[1] = a[1].replace(/\$/g, '')),
              e.push({ l: '~C', p1: a[1], p2: a[2] }),
              a[3] && ((a[3] = a[3].replace(/\$/g, '')), e.push({ l: '%o', p1: a[3] })),
              e
            );
          },
          '@m': function (t, n) {
            return x.go(n, '@m');
          },
        },
        C: function (t) {
          var n,
            e,
            a,
            o,
            r = {};
          for (n in t)
            for (e in t[n])
              for (a = e.split('|'), t[n][e].stateArray = a, o = 0; o < a.length; o++) r[a[o]] = [];
          for (n in t)
            for (e in t[n])
              for (a = t[n][e].stateArray || [], o = 0; o < a.length; o++) {
                var i = t[n][e];
                if (i.h) {
                  i.h = [].concat(i.h);
                  for (var c = 0; c < i.h.length; c++)
                    'string' == typeof i.h[c] && (i.h[c] = { l: i.h[c] });
                } else i.h = [];
                for (var u = n.split('|'), s = 0; s < u.length; s++)
                  if ('*' === a[o]) for (var p in r) r[p].push({ pattern: u[s], task: i });
                  else r[a[o]].push({ pattern: u[s], task: i });
              }
          return r;
        },
        t: {},
      };
    x.t = {
      ce: {
        u: x.C({
          '~z': { '*': { h: '~Q' } },
          '~x': { '0|1|2': { h: '~a', k: !0, A: !0 } },
          '~W': { 0: { h: '`@' } },
          '@n': { r: { h: '%%', g: 'rt' }, rd: { h: '%d', g: '%f' } },
          '~`': { '0|1|2|as': { h: ['%g', '~Q', '~N'], g: '1' } },
          '%w': { '0|1|2': { h: ['o=', '~Q'], g: '1' } },
          '~O': { '0|1|2|3': { h: 'o=', g: 'o' } },
          '->': {
            '0|1|2|3': { h: 'r=', g: 'r' },
            'a|as': { h: ['~Q', 'r='], g: 'r' },
            '*': { h: ['~Q', 'r='], g: 'r' },
          },
          '+': {
            o: { h: '~q', g: 'd' },
            'd|D': { h: 'd=', g: 'd' },
            q: { h: 'd=', g: 'qd' },
            'qd|qD': { h: 'd=', g: 'qd' },
            dq: { h: ['~Q', 'd='], g: 'd' },
            3: { h: ['%g', '~Q', '~N'], g: '0' },
          },
          '~@': { '0|2': { h: 'a=', g: 'a' } },
          '``': { '0|1|2|a|as': { h: ['%g', '~Q', { l: '~N', S: '\\pm' }], g: '0' } },
          '~N': { '0|1|2|a|as': { h: ['%g', '~Q', '~N'], g: '0' } },
          '-$': {
            'o|q': { h: ['~d', '~Q'], g: 'qd' },
            d: { h: 'd=', g: 'd' },
            D: { h: ['~Q', { l: '~c', S: '-' }], g: '3' },
            q: { h: 'd=', g: 'qd' },
            qd: { h: 'd=', g: 'qd' },
            'qD|dq': { h: ['~Q', { l: '~c', S: '-' }], g: '3' },
          },
          '-9': { '3|o': { h: ['~Q', { l: '~G', S: '~F' }], g: '3' } },
          '@g': {
            o: { h: ['~Q', { l: '~G', S: '~F' }], g: '2' },
            d: { h: ['~Q', { l: '~G', S: '~F' }], g: '2' },
          },
          '-': {
            '0|1|2': { h: [{ l: '~Q', S: 1 }, '~b', { l: '~c', S: '-' }], g: '3' },
            3: { h: { l: '~c', S: '-' } },
            a: { h: ['~Q', { l: '~G', S: '~F' }], g: '2' },
            as: {
              h: [
                { l: '~Q', S: 2 },
                { l: '~c', S: '-' },
              ],
              g: '3',
            },
            b: { h: 'b=' },
            o: { h: { l: '`d', S: !1 }, g: '2' },
            q: { h: { l: '`d', S: !1 }, g: '2' },
            'd|qd|dq': { h: { l: '`d', S: !0 }, g: '2' },
            'D|qD|p': { h: ['~Q', { l: '~c', S: '-' }], g: '3' },
          },
          '~~': { '1|3': { h: 'a=', g: 'a' } },
          '~J': {
            '0|1|2|3|a|as|b|p|bp|o': { h: 'o=', g: 'o' },
            'q|dq': { h: ['~Q', 'o='], g: 'o' },
            'd|D|qd|qD': { h: '~K', g: 'o' },
          },
          '~r': {
            o: { h: 'q=', g: 'q' },
            'd|D': { h: 'q=', g: 'dq' },
            q: { h: ['~Q', 'o='], g: 'o' },
            a: { h: 'o=', g: 'o' },
          },
          '%i': { 'b|p|bp': {} },
          '%j': {
            a: { g: 'as' },
            0: { h: '%g' },
            '1|2': { h: '%h' },
            'r|rt|rd|%f|%e': { h: '~Q', g: '0' },
            '*': { h: ['~Q', '%h'], g: '1' },
          },
          '`c': {
            '1|2': { h: ['~Q', { l: '~H', S: '`c' }] },
            '*': { h: ['~Q', { l: '~H', S: '`c' }], g: '0' },
          },
          '@p': { 'r|rt': { h: '%~', g: 'rd' }, 'rd|%f': { h: '%c', g: '%e' } },
          '@j': {
            'o|d|D|dq|qd|qD': { h: ['~Q', { l: '~c', S: '...' }], g: '3' },
            '*': {
              h: [
                { l: '~Q', S: 1 },
                { l: '~G', S: '~w' },
              ],
              g: '1',
            },
          },
          '. |* ': { '*': { h: ['~Q', { l: '~G', S: '@Y' }], g: '1' } },
          '%k': { '*': { h: ['~Q', '%m'], g: '1' } },
          '@L': {
            'a|as|o': { h: ['o=', '~Q', '~X'], g: '2' },
            '0|1|2|3': { h: ['o=', '~Q', '~X'], g: '2' },
            '*': { h: ['~Q', 'o=', '~Q', '~X'], g: '2' },
          },
          '@d': {
            '0|1|2|3|b|p|bp|o': { h: ['o=', '~Y'], g: 'o' },
            'a|as|d|D|q|qd|qD|dq': { h: ['~Q', 'o=', '~Y'], g: 'o' },
          },
          ', ': { '*': { h: ['~Q', '~n'], g: '0' } },
          '^_': { '*': {} },
          '@Q|@M': {
            '0|1|2|as': { h: 'b=', g: 'b' },
            p: { h: 'b=', g: 'bp' },
            '3|o': { h: '~q', g: 'D' },
            q: { h: 'd=', g: 'qD' },
            'd|D|qd|qD|dq': { h: ['~Q', 'd='], g: 'D' },
          },
          "^a|@P|@O|^\\x|'": {
            '0|1|2|as': { h: 'b=', g: 'b' },
            p: { h: 'b=', g: 'bp' },
            '3|o': { h: '~q', g: 'd' },
            q: { h: 'd=', g: 'qd' },
            'd|qd|D|qD': { h: 'd=' },
            dq: { h: ['~Q', 'd='], g: 'd' },
          },
          '`~': { 'd|D|q|qd|qD|dq': { h: ['~Q', 'q='], g: 'q' } },
          '@V|@R|_9|@U|@T|@S': {
            '0|1|2|as': { h: 'p=', g: 'p' },
            b: { h: 'p=', g: 'bp' },
            '3|o': { h: 'q=', g: 'q' },
            'd|D': { h: 'q=', g: 'dq' },
            'q|qd|qD|dq': { h: ['~Q', 'q='], g: 'q' },
          },
          '%A': { '0|1|2|3|a|as|o|q|d|D|qd|qD|dq': { h: [{ l: '~Q', S: 2 }, '~c'], g: '3' } },
          '#': {
            '0|1|2|3|a|as|o': {
              h: [
                { l: '~Q', S: 2 },
                { l: '~c', S: '#' },
              ],
              g: '3',
            },
          },
          '{}': { '*': { h: { l: '~Q', S: 1 }, g: '1' } },
          '%y': {
            '0|1|2|3|a|as|b|p|bp': { h: 'o=', g: 'o' },
            'o|d|D|q|qd|qD|dq': { h: ['~Q', 'o='], g: 'o' },
          },
          '@`': {
            a: { h: 'a=' },
            '0|1|2|3|as|b|p|bp|o': { h: 'o=', g: 'o' },
            'as|o': { h: 'o=' },
            'q|d|D|qd|qD|dq': { h: ['~Q', 'o='], g: 'o' },
          },
          '@s': { '*': { h: [{ l: '~Q', S: 2 }, '~c'], g: '3' } },
          '@z': { '*': { h: [{ l: '~Q', S: 1 }, '~E'], g: '3' } },
          '@B': { '*': { h: [{ l: '~Q', S: 2 }, '~U'], g: '3' } },
          '@D': { '*': { h: [{ l: '~Q', S: 2 }, '%v'], g: '3' } },
          '@C': { '*': { h: [{ l: '~Q', S: 2 }, '%t'], g: '3' } },
          '@y|@w': { '*': { h: [{ l: '~Q', S: 2 }, '~h'], g: '3' } },
          '@x': { '*': { h: [{ l: '~Q', S: 2 }, '~j'] } },
          '@v': { '*': { h: [{ l: '~Q', S: 2 }, 'ce'], g: '3' } },
          '@q': { '*': { h: [{ l: '~Q', S: 1 }, '~p'], g: '1' } },
          '@H|@G|@F': {
            '0|1|2|3|a|as|b|p|bp|o|c0': { h: ['o=', '~Q'], g: '3' },
            '*': { h: ['~Q', 'o=', '~Q'], g: '3' },
          },
          '~P': { '*': { h: [{ l: '~Q', S: 1 }, '~p'], g: '3' } },
          '~y': {
            a: { h: '@W', g: 'o', k: !0 },
            as: { h: ['~Q', '%h'], g: '1', k: !0 },
            'r|rt|rd|%f|%e': { h: ['~Q'], g: '0', k: !0 },
            '*': { h: ['~Q', '~p'], g: '3' },
          },
        }),
        m: {
          '~K': function (t, n) {
            var e;
            if ((t.d || '').match(/^[0-9]+$/)) {
              var a = t.d;
              (t.d = void 0), (e = this['~Q'](t)), (t.b = a);
            } else e = this['~Q'](t);
            return x.m['o='](t, n), e;
          },
          '~q': function (t, n) {
            (t.d = n), (t.dType = 'kv');
          },
          '~d': function (t, n) {
            if (t['@~']) {
              var e = [];
              return x.v(e, this['~Q'](t)), x.v(e, x.m['~c'](t, n, '-')), e;
            }
            t.d = n;
          },
          '`d': function (t, n, e) {
            var a = x._.s('~O', t.o || ''),
              o = x._.s('~L', t.o || ''),
              r = x._.s('~M', t.o || ''),
              i = x._.s('@a', t.o || ''),
              c = '-' === n && ((a && '' === a.$) || o || r || i);
            !c || t.a || t.b || t.p || t.d || t.q || a || !r || (t.o = '$' + t.o + '$');
            var u = [];
            return (
              c
                ? (x.v(u, this['~Q'](t)), u.push({ l: '~F' }))
                : ((a = x._.s('~r', t.d || '')),
                  e && a && '' === a.$
                    ? (x.v(u, x.m['d='](t, n)), x.v(u, this['~Q'](t)))
                    : (x.v(u, this['~Q'](t)), x.v(u, x.m['~c'](t, n, '-')))),
              u
            );
          },
          '@W': function (t) {
            (t.o = t.a), (t.a = void 0);
          },
          '%h': function (t) {
            t.sb = !0;
          },
          '%g': function (t) {
            t.sb = !1;
          },
          '~b': function (t) {
            t['@~'] = !0;
          },
          '~a': function (t) {
            t['@~'] = !1;
          },
          '~X': function (t) {
            t['@@']++;
          },
          '~Y': function (t) {
            t['@@']--;
          },
          '%m': function (t, n) {
            return { l: '%m', p1: x.go(n, 'o') };
          },
          '~n': function (t, n) {
            var e = n.replace(/\s*$/, '');
            return e !== n && 0 === t['@@'] ? { l: '~k', p1: e } : { l: '~l', p1: e };
          },
          '~Q': function (t, n, e) {
            var a, o, r;
            t.r
              ? ((o =
                  'M' === t.rdt
                    ? x.go(t.rd, '%o')
                    : 'T' === t.rdt
                    ? [{ l: '%p', p1: t.rd || '' }]
                    : x.go(t.rd)),
                (r =
                  'M' === t.rqt
                    ? x.go(t.rq, '%o')
                    : 'T' === t.rqt
                    ? [{ l: '%p', p1: t.rq || '' }]
                    : x.go(t.rq)),
                (a = { l: '~%', r: t.r, rd: o, rq: r }))
              : ((a = []),
                (t.a || t.b || t.p || t.o || t.q || t.d || e) &&
                  (t.sb && a.push({ l: '~A' }),
                  t.o || t.q || t.d || t.b || t.p || 2 === e
                    ? t.o || t.q || t.d || (!t.b && !t.p)
                      ? t.o && 'kv' === t.dType && x._.s('%Y', t.d || '')
                        ? (t.dType = '~V')
                        : t.o && 'kv' === t.dType && !t.q && (t.dType = void 0)
                      : ((t.o = t.a), (t.d = t.b), (t.q = t.p), (t.a = t.b = t.p = void 0))
                    : ((t.o = t.a), (t.a = void 0)),
                  a.push({
                    l: '~e',
                    a: x.go(t.a, 'a'),
                    b: x.go(t.b, 'bd'),
                    p: x.go(t.p, 'pq'),
                    o: x.go(t.o, 'o'),
                    q: x.go(t.q, 'pq'),
                    d: x.go(t.d, '~V' === t.dType ? '~V' : 'bd'),
                    dType: t.dType,
                  })));
            for (var i in t) '@@' !== i && '@~' !== i && delete t[i];
            return a;
          },
          '`@': function (t, n) {
            var e = ['{'];
            return x.v(e, x.go(n, '~V')), e.push('}'), e;
          },
          '~E': function (t, n) {
            return { l: '~D', p1: x.go(n[0]), p2: x.go(n[1]) };
          },
          '~U': function (t, n) {
            return { l: '~T', p1: x.go(n[0]), p2: x.go(n[1]) };
          },
          '%v': function (t, n) {
            return { l: '%u', p1: x.go(n[0]), p2: x.go(n[1]) };
          },
          '%t': function (t, n) {
            return { l: '%s', p1: x.go(n[0]), p2: x.go(n[1]) };
          },
          '~h': function (t, n) {
            return { l: '~g', G: n[0], X: x.go(n[1]) };
          },
          'r=': function (t, n) {
            t.r = n;
          },
          '%%': function (t, n) {
            t.rdt = n;
          },
          '%~': function (t, n) {
            t.rd = n;
          },
          '%d': function (t, n) {
            t.rqt = n;
          },
          '%c': function (t, n) {
            t.rq = n;
          },
          '~N': function (t, n, e) {
            return { l: '~N', B: e || n };
          },
        },
      },
      a: {
        u: x.C({
          '~z': { '*': {} },
          '@k': { 0: { h: '@l' } },
          '~x': { 0: { g: '1', k: !0 } },
          '@%': { '*': { h: '%n', g: '1' } },
          ',': { '*': { h: { l: '~G', S: '~o' } } },
          '~y': { '*': { h: '~p' } },
        }),
        m: {},
      },
      o: {
        u: x.C({
          '~z': { '*': {} },
          '@k': { 0: { h: '@l' } },
          '~x': { 0: { g: '1', k: !0 } },
          '~J': { '*': { h: 'rm' } },
          '@u': { '*': { h: { l: '~G', S: '~f' } } },
          '@H|@G|@F': { '*': { h: '~p' } },
          '@b|@%': { '*': { h: '%o' } },
          '%x': { '*': { h: '%z' } },
          '~y': { '*': { h: '~p' } },
        }),
        m: {},
      },
      '%p': {
        u: x.C({
          '~z': { '*': { h: '~Q' } },
          '%y': { '*': { h: '%q' } },
          '@b|@%': { '*': { h: '%o' } },
          '@A': { '*': { h: ['~Q', 'rm'] } },
          '@q|@H|@G|@F': { '*': { h: ['~Q', '~p'] } },
          '~x': { '*': { h: '%q' } },
        }),
        m: {
          '~Q': function (t) {
            if (t.F) {
              var n = { l: '%p', p1: t.F };
              for (var e in t) delete t[e];
              return n;
            }
          },
        },
      },
      pq: {
        u: x.C({
          '~z': { '*': {} },
          '%k': { '*': { h: '%m' } },
          i$: { 0: { g: '!f', k: !0 } },
          '@c': { 0: { h: 'rm', g: '0' } },
          '~B': { 0: { g: 'f', k: !0 } },
          '@k': { 0: { h: '@l' } },
          '~x': { 0: { g: '!f', k: !0 } },
          '@b|@%': { '*': { h: '%o' } },
          '%x': { '*': { h: '%p' } },
          '@X': { f: { h: '%o' } },
          '~J': { '*': { h: 'rm' } },
          '@i': { '*': { h: '@m' } },
          ',': { '*': { h: { l: '~H', S: '~m' } } },
          '@y|@w': { '*': { h: '~h' } },
          '@x': { '*': { h: '~j' } },
          '@v': { '*': { h: 'ce' } },
          '@q|@H|@G|@F': { '*': { h: '~p' } },
          '~y': { '*': { h: '~p' } },
        }),
        m: {
          '%m': function (t, n) {
            return { l: '%H', p1: x.go(n, 'o') };
          },
          '~h': function (t, n) {
            return { l: '~g', G: n[0], X: x.go(n[1], 'pq') };
          },
        },
      },
      bd: {
        u: x.C({
          '~z': { '*': {} },
          x$: { 0: { g: '!f', k: !0 } },
          '~B': { 0: { g: 'f', k: !0 } },
          '~x': { 0: { g: '!f', k: !0 } },
          '@h': { '*': { h: '@m' } },
          '.': { '*': { h: { l: '~G', S: '~v' } } },
          '@X': { f: { h: '%o' } },
          x: { '*': { h: { l: '~G', S: '@o' } } },
          '~J': { '*': { h: 'rm' } },
          "'": { '*': { h: { l: '~G', S: '%@' } } },
          '@b|@%': { '*': { h: '%o' } },
          '%x': { '*': { h: '%p' } },
          '@y|@w': { '*': { h: '~h' } },
          '@x': { '*': { h: '~j' } },
          '@v': { '*': { h: 'ce' } },
          '@q|@H|@G|@F': { '*': { h: '~p' } },
          '~y': { '*': { h: '~p' } },
        }),
        m: {
          '~h': function (t, n) {
            return { l: '~g', G: n[0], X: x.go(n[1], 'bd') };
          },
        },
      },
      '~V': {
        u: x.C({
          '~z': { '*': {} },
          '%a': { '*': { h: '%b' } },
          '@b|@%': { '*': { h: '%o' } },
          '~x': { '*': { h: '~p' } },
        }),
        m: {
          '%b': function (t, n) {
            return { l: '%a', p1: n || '' };
          },
        },
      },
      '%o': {
        u: x.C({
          '~z': { '*': { h: '~Q' } },
          '@v': { '*': { h: ['~Q', 'ce'] } },
          '%y|@q|@H|@G|@F': { '*': { h: 'o=' } },
          '~x': { '*': { h: 'o=' } },
        }),
        m: {
          '~Q': function (t) {
            if (t.o) {
              var n = { l: '%o', p1: t.o };
              for (var e in t) delete t[e];
              return n;
            }
          },
        },
      },
      '%n': {
        u: x.C({
          '~z': { '*': { h: '~Q' } },
          '@v': { '*': { h: ['~Q', 'ce'] } },
          '%y|@q|@H|@G|@F': { '*': { h: 'o=' } },
          '-|+': { '*': { h: '%r' } },
          '~x': { '*': { h: 'o=' } },
        }),
        m: {
          '%r': function (t, n) {
            t.o = (t.o || '') + '{' + n + '}';
          },
          '~Q': function (t) {
            if (t.o) {
              var n = { l: '%o', p1: t.o };
              for (var e in t) delete t[e];
              return n;
            }
          },
        },
      },
      '@m': {
        u: x.C({ '~z': { '*': {} }, ',': { '*': { h: '~n' } }, '~x': { '*': { h: '~p' } } }),
        m: {
          '~n': function () {
            return { l: '~o' };
          },
        },
      },
      pu: {
        u: x.C({
          '~z': { '*': { h: '~Q' } },
          '`e': { '*': { h: ['~Q', '%j'] } },
          '@L|@d': { '0|a': { h: '~p' } },
          '`a': { 0: { h: '`b', g: 'a' } },
          '%Q': { 0: { h: '%W', g: 'a' } },
          '%j': { '0|a': {} },
          '``': { '0|a': { h: { l: '~N', S: '\\pm' }, g: '0' } },
          '~N': { '0|a': { h: '~p', g: '0' } },
          '//': { d: { h: 'o=', g: '/' } },
          '/': { d: { h: 'o=', g: '/' } },
          '%y|~x': {
            '0|d': { h: 'd=', g: 'd' },
            a: { h: ['%j', 'd='], g: 'd' },
            '/|q': { h: 'q=', g: 'q' },
          },
        }),
        m: {
          '%W': function (t, n) {
            var e = [];
            return (
              '+-' === n[0] || '+/-' === n[0] ? e.push('\\pm ') : n[0] && e.push(n[0]),
              n[1] &&
                (x.v(e, x.go(n[1], '%U')),
                n[2] && (n[2].match(/[,.]/) ? x.v(e, x.go(n[2], '%U')) : e.push(n[2])),
                (n[3] || n[4]) &&
                  ('e' === n[3] || '*' === n[4] ? e.push({ l: '%K' }) : e.push({ l: '%M' }))),
              n[5] && e.push('10^{' + n[5] + '}'),
              e
            );
          },
          '`b': function (t, n) {
            var e = [];
            return (
              '+-' === n[0] || '+/-' === n[0] ? e.push('\\pm ') : n[0] && e.push(n[0]),
              x.v(e, x.go(n[1], '%U')),
              e.push('^{' + n[2] + '}'),
              e
            );
          },
          '~N': function (t, n, e) {
            return { l: '~N', B: e || n };
          },
          '%j': function () {
            return { l: '%N' };
          },
          '~Q': function (t) {
            var n,
              e = x._.s('%x', t.d || '');
            e && '' === e.$ && (t.d = e.s);
            var a = x._.s('%x', t.q || '');
            if (
              (a && '' === a.$ && (t.q = a.s),
              t.d &&
                ((t.d = t.d.replace(/\u00B0C|\^oC|\^{o}C/g, '{}^{\\circ}C')),
                (t.d = t.d.replace(/\u00B0F|\^oF|\^{o}F/g, '{}^{\\circ}F'))),
              t.q)
            ) {
              (t.q = t.q.replace(/\u00B0C|\^oC|\^{o}C/g, '{}^{\\circ}C')),
                (t.q = t.q.replace(/\u00B0F|\^oF|\^{o}F/g, '{}^{\\circ}F'));
              var o = { d: x.go(t.d, 'pu'), q: x.go(t.q, 'pu') };
              '//' === t.o
                ? (n = { l: '%P', p1: o.d, p2: o.q })
                : (1 < (n = o.d).length || 1 < o.q.length
                    ? n.push({ l: '%S' })
                    : n.push({ l: '/' }),
                  x.v(n, o.q));
            } else n = x.go(t.d, '%O');
            for (var r in t) delete t[r];
            return n;
          },
        },
      },
      '%O': {
        u: x.C({
          '~z': { '*': { h: '~Q' } },
          '*': { '*': { h: ['~Q', '%K'], g: '0' } },
          '@F': { '*': { h: '%`' } },
          '%j': { '*': { h: ['~Q', '%j'], g: '0' } },
          '@Q|%R': { 1: { h: '%R' } },
          '@i': { 0: { h: '%`', g: '0' }, 1: { h: '%R', g: '0' } },
          '%y|~x': { '*': { h: '%`', g: '1' } },
        }),
        m: {
          '%K': function () {
            return { l: '%L' };
          },
          '%R': function (t, n) {
            t.rm += '^{' + n + '}';
          },
          '%j': function () {
            return { l: '`%' };
          },
          '~Q': function (t) {
            var n = [];
            if (t.rm) {
              var e = x._.s('%x', t.rm || '');
              n = e && '' === e.$ ? x.go(e.s, 'pu') : { l: 'rm', p1: t.rm };
            }
            for (var a in t) delete t[a];
            return n;
          },
        },
      },
      '%U': {
        u: x.C({
          '~z': { 0: { h: '~R' }, o: { h: '~S' } },
          ',': { 0: { h: ['~R', '~n'], g: 'o' } },
          '.': { 0: { h: ['~R', '~p'], g: 'o' } },
          '~x': { '*': { h: '%q' } },
        }),
        m: {
          '~n': function () {
            return { l: '~o' };
          },
          '~R': function (t) {
            var n = [];
            if (((t.F = t.F || ''), 4 < t.F.length)) {
              var e = t.F.length % 3;
              0 === e && (e = 3);
              for (var a = t.F.length - 3; 0 < a; a -= 3)
                n.push(t.F.substr(a, 3)), n.push({ l: '%T' });
              n.push(t.F.substr(0, e)), n.reverse();
            } else n.push(t.F);
            for (var o in t) delete t[o];
            return n;
          },
          '~S': function (t) {
            var n = [];
            if (((t.F = t.F || ''), 4 < t.F.length)) {
              for (var e = t.F.length - 3, a = 0; a < e; a += 3)
                n.push(t.F.substr(a, 3)), n.push({ l: '%T' });
              n.push(t.F.substr(a));
            } else n.push(t.F);
            for (var o in t) delete t[o];
            return n;
          },
        },
      },
    };
    var u = {
      go: function (t, n) {
        if (!t) return '';
        for (var e = '', a = !1, o = 0; o < t.length; o++) {
          var r = t[o];
          'string' == typeof r ? (e += r) : ((e += u.Z(r)), '`c' === r.l && (a = !0));
        }
        return n || a || !e || (e = '{' + e + '}'), e;
      },
      j: function (t) {
        return t ? u.go(t, !0) : t;
      },
      Z: function (t) {
        var n;
        switch (t.l) {
          case '~e':
            n = '';
            var e = {
              a: u.j(t.a),
              b: u.j(t.b),
              p: u.j(t.p),
              o: u.j(t.o),
              q: u.j(t.q),
              d: u.j(t.d),
            };
            e.a && (e.a.match(/^[+\-]/) && (e.a = '{' + e.a + '}'), (n += e.a + '\\,')),
              (e.b || e.p) &&
                ((n += '{\\vphantom{X}}'),
                (n += '^{\\hphantom{' + (e.b || '') + '}}_{\\hphantom{' + (e.p || '') + '}}'),
                (n += '{\\vphantom{X}}'),
                (n += '^{\\smash[t]{\\vphantom{2}}\\llap{' + (e.b || '') + '}}'),
                (n += '_{\\vphantom{2}\\llap{\\smash[t]{' + (e.p || '') + '}}}')),
              e.o && (e.o.match(/^[+\-]/) && (e.o = '{' + e.o + '}'), (n += e.o)),
              'kv' === t.dType
                ? ((e.d || e.q) && (n += '{\\vphantom{X}}'),
                  e.d && (n += '^{' + e.d + '}'),
                  e.q && (n += '_{\\smash[t]{' + e.q + '}}'))
                : '~V' === t.dType
                ? (e.d && ((n += '{\\vphantom{X}}'), (n += '^{' + e.d + '}')),
                  e.q && ((n += '{\\vphantom{X}}'), (n += '_{\\smash[t]{' + e.q + '}}')))
                : (e.q && ((n += '{\\vphantom{X}}'), (n += '_{\\smash[t]{' + e.q + '}}')),
                  e.d && ((n += '{\\vphantom{X}}'), (n += '^{' + e.d + '}')));
            break;
          case 'rm':
            n = '\\mathrm{' + t.p1 + '}';
            break;
          case '%p':
            n = t.p1.match(/[\^_]/)
              ? ((t.p1 = t.p1.replace(' ', '~').replace('-', '\\text{-}')),
                '\\mathrm{' + t.p1 + '}')
              : '\\text{' + t.p1 + '}';
            break;
          case '%a':
            n = '\\mathrm{' + t.p1 + '}';
            break;
          case '%m':
            n = '\\mskip2mu ' + u.j(t.p1);
            break;
          case '%H':
            n = '\\mskip1mu ' + u.j(t.p1);
            break;
          case '~c':
            if (!(n = u.R(t.B)))
              throw ['MhchemErrorBond', 'mhchem Error. Unknown bond type (' + t.B + ')'];
            break;
          case '~C':
            var a = '\\frac{' + t.p1 + '}{' + t.p2 + '}';
            n = '\\mathchoice{\\textstyle' + a + '}{' + a + '}{' + a + '}{' + a + '}';
            break;
          case '%P':
            var o = '\\frac{' + u.j(t.p1) + '}{' + u.j(t.p2) + '}';
            n = '\\mathchoice{\\textstyle' + o + '}{' + o + '}{' + o + '}{' + o + '}';
            break;
          case '%o':
            n = t.p1 + ' ';
            break;
          case '~D':
            n = '\\frac{' + u.j(t.p1) + '}{' + u.j(t.p2) + '}';
            break;
          case '~T':
            n = '\\overset{' + u.j(t.p1) + '}{' + u.j(t.p2) + '}';
            break;
          case '%u':
            n = '\\underset{' + u.j(t.p1) + '}{' + u.j(t.p2) + '}';
            break;
          case '%s':
            n = '\\underbrace{' + u.j(t.p1) + '}_{' + u.j(t.p2) + '}';
            break;
          case '~g':
            n = '{\\color{' + t.G + '}{' + u.j(t.X) + '}}';
            break;
          case '~i':
            n = '\\color{' + t.color + '}';
            break;
          case '~%':
            var r = u.j(t.rd),
              i = u.j(t.rq),
              c = u.H(t.r);
            n = c =
              r || i
                ? '<=>' === t.r || '<=>>' === t.r || '<<=>' === t.r || '<--\x3e' === t.r
                  ? ((c = '\\long' + c),
                    r && (c = '\\overset{' + r + '}{' + c + '}'),
                    i &&
                      (c =
                        '<--\x3e' === t.r
                          ? '\\underset{\\lower2mu{' + i + '}}{' + c + '}'
                          : '\\underset{\\lower6mu{' + i + '}}{' + c + '}'),
                    ' {}\\mathrel{' + c + '}{} ')
                  : (i && (c += '[{' + i + '}]'),
                    ' {}\\mathrel{\\x' + (c += '{' + r + '}') + '}{} ')
                : ' {}\\mathrel{\\long' + c + '}{} ';
            break;
          case '~N':
            n = u.J(t.B);
            break;
          case '`c':
            n = t.p1 + ' ';
            break;
          case '%j':
            n = ' ';
            break;
          case '~A':
          case '%N':
            n = '~';
            break;
          case '`%':
            n = '\\mkern3mu ';
            break;
          case '%T':
            n = '\\mkern2mu ';
            break;
          case '~o':
            n = '{,}';
            break;
          case '~k':
            n = '{' + t.p1 + '}\\mkern6mu ';
            break;
          case '~l':
            n = '{' + t.p1 + '}\\mkern3mu ';
            break;
          case '~m':
            n = '{' + t.p1 + '}\\mkern1mu ';
            break;
          case '~F':
            n = '\\text{-}';
            break;
          case '@Y':
            n = '\\,{\\cdot}\\,';
            break;
          case '~v':
            n = '\\mkern1mu \\bullet\\mkern1mu ';
            break;
          case '@o':
            n = '{\\times}';
            break;
          case '%@':
            n = '\\prime ';
            break;
          case '%K':
            n = '\\cdot ';
            break;
          case '%L':
            n = '\\mkern1mu{\\cdot}\\mkern1mu ';
            break;
          case '%M':
            n = '\\times ';
            break;
          case '~f':
            n = '{\\sim}';
            break;
          case '^':
            n = 'uparrow';
            break;
          case 'v':
            n = 'downarrow';
            break;
          case '~w':
            n = '\\ldots ';
            break;
          case '/':
            n = '/';
            break;
          case '%S':
            n = '\\,/\\,';
            break;
          default:
            throw ['MhchemBugT', 'mhchem bug T. Please report.'];
        }
        return n;
      },
      H: function (t) {
        switch (t) {
          case '->':
          case '\u2192':
          case '\u27f6':
            return 'rightarrow';
          case '<-':
            return 'leftarrow';
          case '<->':
            return 'leftrightarrow';
          case '<--\x3e':
            return 'leftrightarrows';
          case '<=>':
          case '\u21cc':
            return 'rightleftharpoons';
          case '<=>>':
            return 'Rightleftharpoons';
          case '<<=>':
            return 'Leftrightharpoons';
          default:
            throw ['MhchemBugT', 'mhchem bug T. Please report.'];
        }
      },
      R: function (t) {
        switch (t) {
          case '-':
          case '1':
            return '{-}';
          case '=':
          case '2':
            return '{=}';
          case '#':
          case '3':
            return '{\\equiv}';
          case '~':
            return '{\\tripledash}';
          case '~-':
            return '{\\rlap{\\lower.1em{-}}\\raise.1em{\\tripledash}}';
          case '~=':
          case '~--':
            return '{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}';
          case '-~-':
            return '{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{-}}\\tripledash}';
          case '...':
            return '{{\\cdot}{\\cdot}{\\cdot}}';
          case '....':
            return '{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}';
          case '->':
            return '{\\rightarrow}';
          case '<-':
            return '{\\leftarrow}';
          case '<':
            return '{<}';
          case '>':
            return '{>}';
          default:
            throw ['MhchemBugT', 'mhchem bug T. Please report.'];
        }
      },
      J: function (t) {
        switch (t) {
          case '+':
            return ' {}+{} ';
          case '-':
            return ' {}-{} ';
          case '=':
            return ' {}={} ';
          case '<':
            return ' {}<{} ';
          case '>':
            return ' {}>{} ';
          case '<<':
            return ' {}\\ll{} ';
          case '>>':
            return ' {}\\gg{} ';
          case '\\pm':
            return ' {}\\pm{} ';
          case '\\approx':
          case '$\\approx$':
            return ' {}\\approx{} ';
          case 'v':
          case '(v)':
            return ' \\downarrow{} ';
          case '^':
          case '(^)':
            return ' \\uparrow{} ';
          default:
            throw ['MhchemBugT', 'mhchem bug T. Please report.'];
        }
      },
    };
    (MathJax.Extension['TeX/mhchem'].CE = a),
      n.Definitions.Add(
        {
          macros: {
            ce: 'CE',
            pu: 'PU',
            xleftrightarrow: ['Extension', 'AMSmath'],
            xrightleftharpoons: ['Extension', 'AMSmath'],
            xRightleftharpoons: ['Extension', 'AMSmath'],
            xLeftrightharpoons: ['Extension', 'AMSmath'],
            longrightleftharpoons: [
              'Macro',
              '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}',
            ],
            longRightleftharpoons: [
              'Macro',
              '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{\\leftharpoondown}}',
            ],
            longLeftrightharpoons: [
              'Macro',
              '\\stackrel{\\textstyle\\vphantom{{-}}{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}',
            ],
            longleftrightarrows: [
              'Macro',
              '\\raise-3mu{\\stackrel{\\longrightarrow}{\\raise2mu{\\smash{\\longleftarrow}}}}',
            ],
            tripledash: [
              'Macro',
              '\\vphantom{-}\\raise2mu{\\kern2mu\\tiny\\text{-}\\kern1mu\\text{-}\\kern1mu\\text{-}\\kern2mu}',
            ],
          },
        },
        null,
        !0,
      ),
      MathJax.Extension['TeX/AMSmath'] ||
        n.Definitions.Add(
          {
            macros: { xrightarrow: ['Extension', 'AMSmath'], xleftarrow: ['Extension', 'AMSmath'] },
          },
          null,
          !0,
        ),
      MathJax.Hub.Register.StartupHook('TeX AMSmath Ready', function () {
        n.Definitions.Add(
          {
            macros: {
              xleftrightarrow: ['xArrow', 8596, 6, 6],
              xrightleftharpoons: ['xArrow', 8652, 5, 7],
              xRightleftharpoons: ['xArrow', 8652, 5, 7],
              xLeftrightharpoons: ['xArrow', 8652, 5, 7],
            },
          },
          null,
          !0,
        );
      }),
      n.Parse.Augment({
        CE: function (t) {
          var n = this.GetArgument(t),
            e = a(n).Parse();
          (this.string = e + this.string.substr(this.i)), (this.i = 0);
        },
        PU: function (t) {
          var n = this.GetArgument(t),
            e = a(n).Parse('pu');
          (this.string = e + this.string.substr(this.i)), (this.i = 0);
        },
      }),
      MathJax.Hub.Startup.signal.Post('TeX mhchem Ready');
  }),
  MathJax.Ajax.loadComplete('[mhchem]/mhchem.js');
