/*
 *  /MathJax-v2/extensions/tex2jax.js
 *
 *  Copyright (c) 2009-2018 The MathJax Consortium
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

MathJax.Extension.tex2jax = {
  version: '2.7.9',
  config: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    skipTags: [
      'script',
      'noscript',
      'style',
      'textarea',
      'pre',
      'code',
      'annotation',
      'annotation-xml',
    ],
    ignoreClass: 'tex2jax_ignore',
    processClass: 'tex2jax_process',
    processEscapes: false,
    processEnvironments: true,
    processRefs: true,
    preview: 'TeX',
  },
  ignoreTags: {
    br: MathJax.Hub.Browser.isMSIE && document.documentMode < 9 ? '\n' : ' ',
    wbr: '',
    '#comment': '',
  },
  PreProcess: function (a) {
    if (!this.configured) {
      this.config = MathJax.Hub.CombineConfig('tex2jax', this.config);
      if (this.config.Augment) {
        MathJax.Hub.Insert(this, this.config.Augment);
      }
      if (typeof this.config.previewTeX !== 'undefined' && !this.config.previewTeX) {
        this.config.preview = 'none';
      }
      this.configured = true;
    }
    if (typeof a === 'string') {
      a = document.getElementById(a);
    }
    if (!a) {
      a = document.body;
    }
    if (this.createPatterns()) {
      this.scanElement(a, a.nextSibling);
    }
  },
  createPatterns: function () {
    var d = [],
      e = [],
      c,
      a,
      b = this.config;
    this.match = {};
    for (c = 0, a = b.inlineMath.length; c < a; c++) {
      d.push(this.patternQuote(b.inlineMath[c][0]));
      this.match[b.inlineMath[c][0]] = {
        mode: '',
        end: b.inlineMath[c][1],
        pattern: this.endPattern(b.inlineMath[c][1]),
      };
    }
    for (c = 0, a = b.displayMath.length; c < a; c++) {
      d.push(this.patternQuote(b.displayMath[c][0]));
      this.match[b.displayMath[c][0]] = {
        mode: '; mode=display',
        end: b.displayMath[c][1],
        pattern: this.endPattern(b.displayMath[c][1]),
      };
    }
    if (d.length) {
      e.push(d.sort(this.sortLength).join('|'));
    }
    if (b.processEnvironments) {
      e.push('\\\\begin\\{([^}]*)\\}');
    }
    if (b.processEscapes) {
      e.push('\\\\*\\\\\\$');
    }
    if (b.processRefs) {
      e.push('\\\\(eq)?ref\\{[^}]*\\}');
    }
    this.start = new RegExp(e.join('|'), 'g');
    this.skipTags = new RegExp('^(' + b.skipTags.join('|') + ')$', 'i');
    var f = [];
    if (MathJax.Hub.config.preRemoveClass) {
      f.push(MathJax.Hub.config.preRemoveClass);
    }
    if (b.ignoreClass) {
      f.push(b.ignoreClass);
    }
    this.ignoreClass = f.length ? new RegExp('(^| )(' + f.join('|') + ')( |$)') : /^$/;
    this.processClass = new RegExp('(^| )(' + b.processClass + ')( |$)');
    return e.length > 0;
  },
  patternQuote: function (a) {
    return a.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, '\\$1');
  },
  endPattern: function (a) {
    return new RegExp(this.patternQuote(a) + '|\\\\.|[{}]', 'g');
  },
  sortLength: function (d, c) {
    if (d.length !== c.length) {
      return c.length - d.length;
    }
    return d == c ? 0 : d < c ? -1 : 1;
  },
  scanElement: function (c, b, g) {
    var a, e, d, f;
    while (c && c != b) {
      if (c.nodeName.toLowerCase() === '#text') {
        if (!g) {
          c = this.scanText(c);
        }
      } else {
        a = typeof c.className === 'undefined' ? '' : c.className;
        e = typeof c.tagName === 'undefined' ? '' : c.tagName;
        if (typeof a !== 'string') {
          a = String(a);
        }
        f = this.processClass.exec(a);
        if (c.firstChild && !a.match(/(^| )MathJax/) && (f || !this.skipTags.exec(e))) {
          d = (g || this.ignoreClass.exec(a)) && !f;
          this.scanElement(c.firstChild, b, d);
        }
      }
      if (c) {
        c = c.nextSibling;
      }
    }
  },
  scanText: function (c) {
    if (c.nodeValue.replace(/\s+/, '') == '') {
      return c;
    }
    var b,
      d,
      e = 0,
      a;
    this.search = { start: true };
    this.pattern = this.start;
    while (c) {
      a = null;
      this.pattern.lastIndex = e;
      e = 0;
      while (c && c.nodeName.toLowerCase() === '#text' && (b = this.pattern.exec(c.nodeValue))) {
        if (this.search.start) {
          c = this.startMatch(b, c);
        } else {
          c = this.endMatch(b, c);
        }
      }
      if (this.search.matched) {
        c = this.encloseMath(c);
      } else {
        if (!this.search.start && !this.search.close) {
          a = this.search;
        }
      }
      if (c) {
        do {
          d = c;
          c = c.nextSibling;
        } while (c && this.ignoreTags[c.nodeName.toLowerCase()] != null);
        if (!c || c.nodeName !== '#text') {
          if (!a) {
            return this.search.close ? this.prevEndMatch() : d;
          }
          c = a.open;
          e = a.opos + a.olen + (a.blen || 0);
          this.search = { start: true };
          this.pattern = this.start;
        }
      }
    }
    return c;
  },
  startMatch: function (a, b) {
    var f = this.match[a[0]];
    if (f != null) {
      this.search = {
        end: f.end,
        mode: f.mode,
        pcount: 0,
        open: b,
        olen: a[0].length,
        opos: this.pattern.lastIndex - a[0].length,
      };
      this.switchPattern(f.pattern);
    } else {
      if (a[0].substr(0, 6) === '\\begin') {
        this.search = {
          end: '\\end{' + a[1] + '}',
          mode: '; mode=display',
          pcount: 0,
          open: b,
          olen: 0,
          opos: this.pattern.lastIndex - a[0].length,
          blen: a[1].length + 3,
          isBeginEnd: true,
        };
        this.switchPattern(this.endPattern(this.search.end));
      } else {
        if (a[0].substr(0, 4) === '\\ref' || a[0].substr(0, 6) === '\\eqref') {
          this.search = {
            mode: '',
            end: '',
            open: b,
            pcount: 0,
            olen: 0,
            opos: this.pattern.lastIndex - a[0].length,
          };
          return this.endMatch([''], b);
        } else {
          var d = a[0].substr(0, a[0].length - 1),
            g,
            c;
          if (d.length % 2 === 0) {
            c = [d.replace(/\\\\/g, '\\')];
            g = 1;
          } else {
            c = [d.substr(1).replace(/\\\\/g, '\\'), '$'];
            g = 0;
          }
          c = MathJax.HTML.Element('span', null, c);
          var e = MathJax.HTML.TextNode(b.nodeValue.substr(0, a.index));
          b.nodeValue = b.nodeValue.substr(a.index + a[0].length - g);
          b.parentNode.insertBefore(c, b);
          b.parentNode.insertBefore(e, c);
          this.pattern.lastIndex = g;
        }
      }
    }
    return b;
  },
  endMatch: function (a, c) {
    var b = this.search;
    if (a[0] == b.end) {
      if (!b.close || b.pcount === 0) {
        b.close = c;
        b.cpos = this.pattern.lastIndex;
        b.clen = b.isBeginEnd ? 0 : a[0].length;
      }
      if (b.pcount === 0) {
        b.matched = true;
        c = this.encloseMath(c);
        this.switchPattern(this.start);
      }
    }
    if (a[0] === '{') {
      b.pcount++;
    } else {
      if (a[0] === '}' && b.pcount) {
        b.pcount--;
      }
    }
    return c;
  },
  prevEndMatch: function () {
    this.search.matched = true;
    var a = this.encloseMath(this.search.close);
    this.switchPattern(this.start);
    return a;
  },
  switchPattern: function (a) {
    a.lastIndex = this.pattern.lastIndex;
    this.pattern = a;
    this.search.start = a === this.start;
  },
  encloseMath: function (b) {
    var a = this.search,
      g = a.close,
      f,
      d,
      c;
    if (a.cpos === g.length) {
      g = g.nextSibling;
    } else {
      g = g.splitText(a.cpos);
    }
    if (!g) {
      f = g = MathJax.HTML.addText(a.close.parentNode, '');
    }
    a.close = g;
    d = a.opos ? a.open.splitText(a.opos) : a.open;
    while ((c = d.nextSibling) && c !== g) {
      if (c.nodeValue !== null) {
        if (c.nodeName === '#comment') {
          d.nodeValue += c.nodeValue.replace(/^\[CDATA\[((.|\n|\r)*)\]\]$/, '$1');
        } else {
          d.nodeValue += c.nodeValue;
        }
      } else {
        var h = this.ignoreTags[c.nodeName.toLowerCase()];
        d.nodeValue += h == null ? ' ' : h;
      }
      d.parentNode.removeChild(c);
    }
    var e = d.nodeValue.substr(a.olen, d.nodeValue.length - a.olen - a.clen);
    d.parentNode.removeChild(d);
    if (this.config.preview !== 'none') {
      this.createPreview(a.mode, e);
    }
    d = this.createMathTag(a.mode, e);
    this.search = {};
    this.pattern.lastIndex = 0;
    if (f) {
      f.parentNode.removeChild(f);
    }
    return d;
  },
  insertNode: function (b) {
    var a = this.search;
    a.close.parentNode.insertBefore(b, a.close);
  },
  createPreview: function (d, a) {
    var b = MathJax.Hub.config.preRemoveClass;
    var c = this.config.preview;
    if (c === 'none') {
      return;
    }
    if ((this.search.close.previousSibling || {}).className === b) {
      return;
    }
    if (c === 'TeX') {
      c = [this.filterPreview(a)];
    }
    if (c) {
      c = MathJax.HTML.Element('span', { className: b }, c);
      this.insertNode(c);
    }
  },
  createMathTag: function (c, b) {
    var a = document.createElement('script');
    a.type = 'math/tex' + c;
    MathJax.HTML.setScript(a, b);
    this.insertNode(a);
    return a;
  },
  filterPreview: function (a) {
    return a;
  },
};
MathJax.Hub.Register.PreProcessor(['PreProcess', MathJax.Extension.tex2jax]);
MathJax.Ajax.loadComplete('[MathJax]/extensions/tex2jax.js');
