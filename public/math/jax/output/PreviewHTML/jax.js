/*
 *  /MathJax/jax/output/PreviewHTML/jax.js
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

(function (i, b, e, g) {
  var h;
  var j, a, d;
  var f = "'Times New Roman',Times,STIXGeneral,serif";
  var m = {
    '.MJXp-script': { 'font-size': '.8em' },
    '.MJXp-right': {
      '-webkit-transform-origin': 'right',
      '-moz-transform-origin': 'right',
      '-ms-transform-origin': 'right',
      '-o-transform-origin': 'right',
      'transform-origin': 'right',
    },
    '.MJXp-bold': { 'font-weight': 'bold' },
    '.MJXp-italic': { 'font-style': 'italic' },
    '.MJXp-scr': { 'font-family': 'MathJax_Script,' + f },
    '.MJXp-frak': { 'font-family': 'MathJax_Fraktur,' + f },
    '.MJXp-sf': { 'font-family': 'MathJax_SansSerif,' + f },
    '.MJXp-cal': { 'font-family': 'MathJax_Caligraphic,' + f },
    '.MJXp-mono': { 'font-family': 'MathJax_Typewriter,' + f },
    '.MJXp-largeop': { 'font-size': '150%' },
    '.MJXp-largeop.MJXp-int': { 'vertical-align': '-.2em' },
    '.MJXp-math': {
      display: 'inline-block',
      'line-height': '1.2',
      'text-indent': '0',
      'font-family': f,
      'white-space': 'nowrap',
      'border-collapse': 'collapse',
    },
    '.MJXp-display': { display: 'block', 'text-align': 'center', margin: '1em 0' },
    '.MJXp-math span': { display: 'inline-block' },
    '.MJXp-box': { display: 'block!important', 'text-align': 'center' },
    '.MJXp-box:after': { content: '" "' },
    '.MJXp-rule': { display: 'block!important', 'margin-top': '.1em' },
    '.MJXp-char': { display: 'block!important' },
    '.MJXp-mo': { margin: '0 .15em' },
    '.MJXp-mfrac': { margin: '0 .125em', 'vertical-align': '.25em' },
    '.MJXp-denom': { display: 'inline-table!important', width: '100%' },
    '.MJXp-denom > *': { display: 'table-row!important' },
    '.MJXp-surd': { 'vertical-align': 'top' },
    '.MJXp-surd > *': { display: 'block!important' },
    '.MJXp-script-box > * ': { display: 'table!important', height: '50%' },
    '.MJXp-script-box > * > *': { display: 'table-cell!important', 'vertical-align': 'top' },
    '.MJXp-script-box > *:last-child > *': { 'vertical-align': 'bottom' },
    '.MJXp-script-box > * > * > *': { display: 'block!important' },
    '.MJXp-mphantom': { visibility: 'hidden' },
    '.MJXp-munderover, .MJXp-munder': { display: 'inline-table!important' },
    '.MJXp-over': { display: 'inline-block!important', 'text-align': 'center' },
    '.MJXp-over > *': { display: 'block!important' },
    '.MJXp-munderover > *, .MJXp-munder > *': { display: 'table-row!important' },
    '.MJXp-mtable': { 'vertical-align': '.25em', margin: '0 .125em' },
    '.MJXp-mtable > *': { display: 'inline-table!important', 'vertical-align': 'middle' },
    '.MJXp-mtr': { display: 'table-row!important' },
    '.MJXp-mtd': {
      display: 'table-cell!important',
      'text-align': 'center',
      padding: '.5em 0 0 .5em',
    },
    '.MJXp-mtr > .MJXp-mtd:first-child': { 'padding-left': 0 },
    '.MJXp-mtr:first-child > .MJXp-mtd': { 'padding-top': 0 },
    '.MJXp-mlabeledtr': { display: 'table-row!important' },
    '.MJXp-mlabeledtr > .MJXp-mtd:first-child': { 'padding-left': 0 },
    '.MJXp-mlabeledtr:first-child > .MJXp-mtd': { 'padding-top': 0 },
    '.MJXp-merror': {
      'background-color': '#FFFF88',
      color: '#CC0000',
      border: '1px solid #CC0000',
      padding: '1px 3px',
      'font-style': 'normal',
      'font-size': '90%',
    },
  };
  (function () {
    for (var n = 0; n < 10; n++) {
      var o = 'scaleX(.' + n + ')';
      m['.MJXp-scale' + n] = {
        '-webkit-transform': o,
        '-moz-transform': o,
        '-ms-transform': o,
        '-o-transform': o,
        transform: o,
      };
    }
  })();
  var k = 1000000;
  var c = 'V',
    l = 'H';
  g.Augment({
    settings: b.config.menuSettings,
    config: { styles: m },
    hideProcessedMath: false,
    maxStretchyParts: 1000,
    Config: function () {
      if (!this.require) {
        this.require = [];
      }
      this.SUPER(arguments).Config.call(this);
      var n = this.settings;
      if (n.scale) {
        this.config.scale = n.scale;
      }
      this.require.push(MathJax.OutputJax.extensionDir + '/MathEvents.js');
    },
    Startup: function () {
      j = MathJax.Extension.MathEvents.Event;
      a = MathJax.Extension.MathEvents.Touch;
      d = MathJax.Extension.MathEvents.Hover;
      this.ContextMenu = j.ContextMenu;
      this.Mousedown = j.AltContextMenu;
      this.Mouseover = d.Mouseover;
      this.Mouseout = d.Mouseout;
      this.Mousemove = d.Mousemove;
      var n = e.addElement(document.body, 'div', { style: { width: '5in' } });
      this.pxPerInch = n.offsetWidth / 5;
      n.parentNode.removeChild(n);
      return i.Styles(this.config.styles, ['InitializePHTML', this]);
    },
    InitializePHTML: function () {},
    preTranslate: function (p) {
      var s = p.jax[this.id],
        t,
        q = s.length,
        u,
        r,
        v,
        o,
        n;
      for (t = 0; t < q; t++) {
        u = s[t];
        if (!u.parentNode) {
          continue;
        }
        r = u.previousSibling;
        if (
          r &&
          String(r.className).match(/^MathJax(_PHTML)?(_Display)?( MathJax_Process(ing|ed))?$/)
        ) {
          r.parentNode.removeChild(r);
        }
        n = u.MathJax.elementJax;
        if (!n) {
          continue;
        }
        n.PHTML = { display: n.root.Get('display') === 'block' };
        v = o = e.Element('span', {
          className: 'MathJax_PHTML',
          id: n.inputID + '-Frame',
          isMathJax: true,
          jaxID: this.id,
          oncontextmenu: j.Menu,
          onmousedown: j.Mousedown,
          onmouseover: j.Mouseover,
          onmouseout: j.Mouseout,
          onmousemove: j.Mousemove,
          onclick: j.Click,
          ondblclick: j.DblClick,
          onkeydown: j.Keydown,
          tabIndex: b.getTabOrder(n),
        });
        if (b.Browser.noContextMenu) {
          v.ontouchstart = a.start;
          v.ontouchend = a.end;
        }
        if (n.PHTML.display) {
          o = e.Element('div', { className: 'MathJax_PHTML_Display' });
          o.appendChild(v);
        }
        o.className += ' MathJax_Processing';
        u.parentNode.insertBefore(o, u);
      }
    },
    Translate: function (o, s) {
      if (!o.parentNode) {
        return;
      }
      var n = o.MathJax.elementJax,
        r = n.root,
        p = document.getElementById(n.inputID + '-Frame'),
        t = n.PHTML.display ? p.parentNode : p;
      this.initPHTML(r, p);
      try {
        r.toPreviewHTML(p);
      } catch (q) {
        if (q.restart) {
          while (p.firstChild) {
            p.removeChild(p.firstChild);
          }
        }
        throw q;
      }
      t.className = t.className.split(/ /)[0];
      if (this.hideProcessedMath) {
        t.className += ' MathJax_Processed';
        if (o.MathJax.preview) {
          n.PHTML.preview = o.MathJax.preview;
          delete o.MathJax.preview;
        }
      }
    },
    postTranslate: function (s) {
      var o = s.jax[this.id];
      if (!this.hideProcessedMath) {
        return;
      }
      for (var q = 0, n = o.length; q < n; q++) {
        var p = o[q];
        if (p && p.MathJax.elementJax) {
          p.previousSibling.className = p.previousSibling.className.split(/ /)[0];
          var r = p.MathJax.elementJax.PHTML;
          if (r.preview) {
            r.preview.innerHTML = '';
            p.MathJax.preview = r.preview;
            delete r.preview;
          }
        }
      }
    },
    getJaxFromMath: function (n) {
      if (n.parentNode.className.match(/MathJax_PHTML_Display/)) {
        n = n.parentNode;
      }
      do {
        n = n.nextSibling;
      } while (n && n.nodeName.toLowerCase() !== 'script');
      return b.getJaxFor(n);
    },
    getHoverSpan: function (n, o) {
      return n.root.PHTMLspanElement();
    },
    getHoverBBox: function (n, q, r) {
      var s = n.root.PHTML,
        p = n.PHTML.outerEm;
      var o = { w: s.w * p, h: s.h * p, d: s.d * p };
      if (s.width) {
        o.width = s.width;
      }
      return o;
    },
    Zoom: function (o, u, s, n, r) {
      u.className = 'MathJax';
      this.idPostfix = '-zoom';
      o.root.toPHTML(u, u);
      this.idPostfix = '';
      u.style.position = 'absolute';
      if (!width) {
        s.style.position = 'absolute';
      }
      var t = u.offsetWidth,
        q = u.offsetHeight,
        v = s.offsetHeight,
        p = s.offsetWidth;
      if (p === 0) {
        p = s.parentNode.offsetWidth;
      }
      u.style.position = s.style.position = '';
      return { Y: -j.getBBox(u).h, mW: p, mH: v, zW: t, zH: q };
    },
    initPHTML: function (o, n) {},
    Remove: function (n) {
      var o = document.getElementById(n.inputID + '-Frame');
      if (o) {
        if (n.PHTML.display) {
          o = o.parentNode;
        }
        o.parentNode.removeChild(o);
      }
      delete n.PHTML;
    },
    ID: 0,
    idPostfix: '',
    GetID: function () {
      this.ID++;
      return this.ID;
    },
    VARIANT: {
      bold: 'MJXp-bold',
      italic: 'MJXp-italic',
      'bold-italic': 'MJXp-bold MJXp-italic',
      script: 'MJXp-scr',
      'bold-script': 'MJXp-scr MJXp-bold',
      fraktur: 'MJXp-frak',
      'bold-fraktur': 'MJXp-frak MJXp-bold',
      monospace: 'MJXp-mono',
      'sans-serif': 'MJXp-sf',
      '-tex-caligraphic': 'MJXp-cal',
    },
    MATHSPACE: {
      veryverythinmathspace: 1 / 18,
      verythinmathspace: 2 / 18,
      thinmathspace: 3 / 18,
      mediummathspace: 4 / 18,
      thickmathspace: 5 / 18,
      verythickmathspace: 6 / 18,
      veryverythickmathspace: 7 / 18,
      negativeveryverythinmathspace: -1 / 18,
      negativeverythinmathspace: -2 / 18,
      negativethinmathspace: -3 / 18,
      negativemediummathspace: -4 / 18,
      negativethickmathspace: -5 / 18,
      negativeverythickmathspace: -6 / 18,
      negativeveryverythickmathspace: -7 / 18,
      thin: 0.08,
      medium: 0.1,
      thick: 0.15,
      infinity: k,
    },
    TeX: { x_height: 0.430554 },
    pxPerInch: 72,
    em: 16,
    DELIMITERS: {
      '(': { dir: c },
      '{': { dir: c, w: 0.58 },
      '[': { dir: c },
      '|': { dir: c, w: 0.275 },
      ')': { dir: c },
      '}': { dir: c, w: 0.58 },
      ']': { dir: c },
      '/': { dir: c },
      '\\': { dir: c },
      '\u2223': { dir: c, w: 0.275 },
      '\u2225': { dir: c, w: 0.55 },
      '\u230A': { dir: c, w: 0.5 },
      '\u230B': { dir: c, w: 0.5 },
      '\u2308': { dir: c, w: 0.5 },
      '\u2309': { dir: c, w: 0.5 },
      '\u27E8': { dir: c, w: 0.5 },
      '\u27E9': { dir: c, w: 0.5 },
      '\u2191': { dir: c, w: 0.65 },
      '\u2193': { dir: c, w: 0.65 },
      '\u21D1': { dir: c, w: 0.75 },
      '\u21D3': { dir: c, w: 0.75 },
      '\u2195': { dir: c, w: 0.65 },
      '\u21D5': { dir: c, w: 0.75 },
      '\u27EE': { dir: c, w: 0.275 },
      '\u27EF': { dir: c, w: 0.275 },
      '\u23B0': { dir: c, w: 0.6 },
      '\u23B1': { dir: c, w: 0.6 },
    },
    REMAPACCENT: {
      '\u20D7': '\u2192',
      "'": '\u02CB',
      '`': '\u02CA',
      '.': '\u02D9',
      '^': '\u02C6',
      '-': '\u02C9',
      '~': '\u02DC',
      '\u00AF': '\u02C9',
      '\u00B0': '\u02DA',
      '\u00B4': '\u02CA',
      '\u0300': '\u02CB',
      '\u0301': '\u02CA',
      '\u0302': '\u02C6',
      '\u0303': '\u02DC',
      '\u0304': '\u02C9',
      '\u0305': '\u02C9',
      '\u0306': '\u02D8',
      '\u0307': '\u02D9',
      '\u0308': '\u00A8',
      '\u030C': '\u02C7',
    },
    REMAPACCENTUNDER: {},
    length2em: function (r, p) {
      if (typeof r !== 'string') {
        r = r.toString();
      }
      if (r === '') {
        return '';
      }
      if (r === h.SIZE.NORMAL) {
        return 1;
      }
      if (r === h.SIZE.BIG) {
        return 2;
      }
      if (r === h.SIZE.SMALL) {
        return 0.71;
      }
      if (this.MATHSPACE[r]) {
        return this.MATHSPACE[r];
      }
      var o = r.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
      var n = parseFloat(o[1] || '1'),
        q = o[2];
      if (p == null) {
        p = 1;
      }
      if (q === 'em') {
        return n;
      }
      if (q === 'ex') {
        return n * this.TeX.x_height;
      }
      if (q === '%') {
        return (n / 100) * p;
      }
      if (q === 'px') {
        return n / this.em;
      }
      if (q === 'pt') {
        return n / 10;
      }
      if (q === 'pc') {
        return n * 1.2;
      }
      if (q === 'in') {
        return (n * this.pxPerInch) / this.em;
      }
      if (q === 'cm') {
        return (n * this.pxPerInch) / this.em / 2.54;
      }
      if (q === 'mm') {
        return (n * this.pxPerInch) / this.em / 25.4;
      }
      if (q === 'mu') {
        return n / 18;
      }
      return n * p;
    },
    Em: function (n) {
      if (Math.abs(n) < 0.001) {
        return '0em';
      }
      return n.toFixed(3).replace(/\.?0+$/, '') + 'em';
    },
    arrayEntry: function (n, o) {
      return n[Math.max(0, Math.min(o, n.length - 1))];
    },
  });
  MathJax.Hub.Register.StartupHook('mml Jax Ready', function () {
    h = MathJax.ElementJax.mml;
    h.mbase.Augment({
      toPreviewHTML: function (o, n) {
        return this.PHTMLdefaultSpan(o, n);
      },
      PHTMLdefaultSpan: function (q, o) {
        if (!o) {
          o = {};
        }
        q = this.PHTMLcreateSpan(q);
        this.PHTMLhandleStyle(q);
        this.PHTMLhandleColor(q);
        if (this.isToken) {
          this.PHTMLhandleToken(q);
        }
        for (var p = 0, n = this.data.length; p < n; p++) {
          this.PHTMLaddChild(q, p, o);
        }
        return q;
      },
      PHTMLaddChild: function (p, o, n) {
        var q = this.data[o];
        if (q) {
          if (n.childSpans) {
            p = e.addElement(p, 'span', { className: n.className });
          }
          q.toPreviewHTML(p);
          if (!n.noBBox) {
            this.PHTML.w += q.PHTML.w + q.PHTML.l + q.PHTML.r;
            if (q.PHTML.h > this.PHTML.h) {
              this.PHTML.h = q.PHTML.h;
            }
            if (q.PHTML.d > this.PHTML.d) {
              this.PHTML.d = q.PHTML.d;
            }
            if (q.PHTML.t > this.PHTML.t) {
              this.PHTML.t = q.PHTML.t;
            }
            if (q.PHTML.b > this.PHTML.b) {
              this.PHTML.b = q.PHTML.b;
            }
          }
        } else {
          if (n.forceChild) {
            e.addElement(p, 'span');
          }
        }
      },
      PHTMLstretchChild: function (q, p, s) {
        var r = this.data[q];
        if (r && r.PHTMLcanStretch('Vertical', p, s)) {
          var t = this.PHTML,
            o = r.PHTML,
            n = o.w;
          r.PHTMLstretchV(p, s);
          t.w += o.w - n;
          if (o.h > t.h) {
            t.h = o.h;
          }
          if (o.d > t.d) {
            t.d = o.d;
          }
        }
      },
      PHTMLcreateSpan: function (n) {
        if (!this.PHTML) {
          this.PHTML = {};
        }
        this.PHTML = { w: 0, h: 0, d: 0, l: 0, r: 0, t: 0, b: 0 };
        if (this.inferred) {
          return n;
        }
        if (this.type === 'mo' && this.data.join('') === '\u222B') {
          g.lastIsInt = true;
        } else {
          if (this.type !== 'mspace' || this.width !== 'negativethinmathspace') {
            g.lastIsInt = false;
          }
        }
        if (!this.PHTMLspanID) {
          this.PHTMLspanID = g.GetID();
        }
        var o = this.id || 'MJXp-Span-' + this.PHTMLspanID;
        return e.addElement(n, 'span', { className: 'MJXp-' + this.type, id: o });
      },
      PHTMLspanElement: function () {
        if (!this.PHTMLspanID) {
          return null;
        }
        return document.getElementById(this.id || 'MJXp-Span-' + this.PHTMLspanID);
      },
      PHTMLhandleToken: function (o) {
        var n = this.getValues('mathvariant');
        if (n.mathvariant !== h.VARIANT.NORMAL) {
          o.className += ' ' + g.VARIANT[n.mathvariant];
        }
      },
      PHTMLhandleStyle: function (n) {
        if (this.style) {
          n.style.cssText = this.style;
        }
      },
      PHTMLhandleColor: function (n) {
        if (this.mathcolor) {
          n.style.color = this.mathcolor;
        }
        if (this.mathbackground) {
          n.style.backgroundColor = this.mathbackground;
        }
      },
      PHTMLhandleScriptlevel: function (n) {
        var o = this.Get('scriptlevel');
        if (o) {
          n.className += ' MJXp-script';
        }
      },
      PHTMLhandleText: function (y, A) {
        var v, p;
        var z = 0,
          o = 0,
          q = 0;
        for (var s = 0, r = A.length; s < r; s++) {
          p = A.charCodeAt(s);
          v = A.charAt(s);
          if (p >= 55296 && p < 56319) {
            s++;
            p = ((p - 55296) << 10) + (A.charCodeAt(s) - 56320) + 65536;
          }
          var t = 0.7,
            u = 0.22,
            x = 0.5;
          if (p < 127) {
            if (v.match(/[A-Za-ehik-or-xz0-9]/)) {
              u = 0;
            }
            if (v.match(/[A-HK-Z]/)) {
              x = 0.67;
            } else {
              if (v.match(/[IJ]/)) {
                x = 0.36;
              }
            }
            if (v.match(/[acegm-su-z]/)) {
              t = 0.45;
            } else {
              if (v.match(/[ij]/)) {
                t = 0.75;
              }
            }
            if (v.match(/[ijlt]/)) {
              x = 0.28;
            }
          }
          if (g.DELIMITERS[v]) {
            x = g.DELIMITERS[v].w || 0.4;
          }
          if (t > z) {
            z = t;
          }
          if (u > o) {
            o = u;
          }
          q += x;
        }
        if (!this.CHML) {
          this.PHTML = {};
        }
        this.PHTML = { h: 0.9, d: 0.3, w: q, l: 0, r: 0, t: z, b: o };
        e.addText(y, A);
      },
      PHTMLbboxFor: function (o) {
        if (this.data[o] && this.data[o].PHTML) {
          return this.data[o].PHTML;
        }
        return { w: 0, h: 0, d: 0, l: 0, r: 0, t: 0, b: 0 };
      },
      PHTMLcanStretch: function (q, o, p) {
        if (this.isEmbellished()) {
          var n = this.Core();
          if (n && n !== this) {
            return n.PHTMLcanStretch(q, o, p);
          }
        }
        return false;
      },
      PHTMLstretchV: function (n, o) {},
      PHTMLstretchH: function (n) {},
      CoreParent: function () {
        var n = this;
        while (n && n.isEmbellished() && n.CoreMO() === this && !n.isa(h.math)) {
          n = n.Parent();
        }
        return n;
      },
      CoreText: function (n) {
        if (!n) {
          return '';
        }
        if (n.isEmbellished()) {
          return n.CoreMO().data.join('');
        }
        while (
          (n.isa(h.mrow) || n.isa(h.TeXAtom) || n.isa(h.mstyle) || n.isa(h.mphantom)) &&
          n.data.length === 1 &&
          n.data[0]
        ) {
          n = n.data[0];
        }
        if (!n.isToken) {
          return '';
        } else {
          return n.data.join('');
        }
      },
    });
    h.chars.Augment({
      toPreviewHTML: function (n) {
        var o = this.toString().replace(/[\u2061-\u2064]/g, '');
        this.PHTMLhandleText(n, o);
      },
    });
    h.entity.Augment({
      toPreviewHTML: function (n) {
        var o = this.toString().replace(/[\u2061-\u2064]/g, '');
        this.PHTMLhandleText(n, o);
      },
    });
    h.math.Augment({
      toPreviewHTML: function (n) {
        n = this.PHTMLdefaultSpan(n);
        if (this.Get('display') === 'block') {
          n.className += ' MJXp-display';
        }
        return n;
      },
    });
    h.mo.Augment({
      toPreviewHTML: function (o) {
        o = this.PHTMLdefaultSpan(o);
        this.PHTMLadjustAccent(o);
        var n = this.getValues('lspace', 'rspace', 'scriptlevel', 'displaystyle', 'largeop');
        if (n.scriptlevel === 0) {
          this.PHTML.l = g.length2em(n.lspace);
          this.PHTML.r = g.length2em(n.rspace);
          o.style.marginLeft = g.Em(this.PHTML.l);
          o.style.marginRight = g.Em(this.PHTML.r);
        } else {
          this.PHTML.l = 0.15;
          this.PHTML.r = 0.1;
        }
        if (n.displaystyle && n.largeop) {
          var p = e.Element('span', { className: 'MJXp-largeop' });
          p.appendChild(o.firstChild);
          o.appendChild(p);
          this.PHTML.h *= 1.2;
          this.PHTML.d *= 1.2;
          if (this.data.join('') === '\u222B') {
            p.className += ' MJXp-int';
          }
        }
        return o;
      },
      PHTMLadjustAccent: function (p) {
        var o = this.CoreParent();
        if (o && o.isa(h.munderover) && this.CoreText(o.data[o.base]).length === 1) {
          var q = o.data[o.over],
            n = o.data[o.under];
          var s = this.data.join(''),
            r;
          if (q && this === q.CoreMO() && o.Get('accent')) {
            r = g.REMAPACCENT[s];
          } else {
            if (n && this === n.CoreMO() && o.Get('accentunder')) {
              r = g.REMAPACCENTUNDER[s];
            }
          }
          if (r) {
            s = p.innerHTML = r;
          }
          if (s.match(/[\u02C6-\u02DC\u00A8]/)) {
            this.PHTML.acc = -0.52;
          } else {
            if (s === '\u2192') {
              this.PHTML.acc = -0.15;
              this.PHTML.vec = true;
            }
          }
        }
      },
      PHTMLcanStretch: function (q, o, p) {
        if (!this.Get('stretchy')) {
          return false;
        }
        var r = this.data.join('');
        if (r.length > 1) {
          return false;
        }
        r = g.DELIMITERS[r];
        var n = r && r.dir === q.substr(0, 1);
        if (n) {
          n =
            this.PHTML.h !== o ||
            this.PHTML.d !== p ||
            this.Get('minsize', true) ||
            this.Get('maxsize', true);
        }
        return n;
      },
      PHTMLstretchV: function (p, u) {
        var o = this.PHTMLspanElement(),
          t = this.PHTML;
        var n = this.getValues('symmetric', 'maxsize', 'minsize');
        if (n.symmetric) {
          l = 2 * Math.max(p - 0.25, u + 0.25);
        } else {
          l = p + u;
        }
        n.maxsize = g.length2em(n.maxsize, t.h + t.d);
        n.minsize = g.length2em(n.minsize, t.h + t.d);
        l = Math.max(n.minsize, Math.min(n.maxsize, l));
        var s = l / (t.h + t.d - 0.3);
        var q = e.Element('span', { style: { 'font-size': g.Em(s) } });
        if (s > 1.25) {
          var r = Math.ceil((1.25 / s) * 10);
          q.className = 'MJXp-right MJXp-scale' + r;
          q.style.marginLeft = g.Em(t.w * (r / 10 - 1) + 0.07);
          t.w *= (s * r) / 10;
        }
        q.appendChild(o.firstChild);
        o.appendChild(q);
        if (n.symmetric) {
          o.style.verticalAlign = g.Em(0.25 * (1 - s));
        }
      },
    });
    h.mspace.Augment({
      toPreviewHTML: function (q) {
        q = this.PHTMLdefaultSpan(q);
        var o = this.getValues('height', 'depth', 'width');
        var n = g.length2em(o.width),
          p = g.length2em(o.height),
          s = g.length2em(o.depth);
        var r = this.PHTML;
        r.w = n;
        r.h = p;
        r.d = s;
        if (n < 0) {
          if (!g.lastIsInt) {
            q.style.marginLeft = g.Em(n);
          }
          n = 0;
        }
        q.style.width = g.Em(n);
        q.style.height = g.Em(p + s);
        if (s) {
          q.style.verticalAlign = g.Em(-s);
        }
        return q;
      },
    });
    h.mpadded.Augment({
      toPreviewHTML: function (u) {
        u = this.PHTMLdefaultSpan(u, { childSpans: true, className: 'MJXp-box', forceChild: true });
        var o = u.firstChild;
        var v = this.getValues('width', 'height', 'depth', 'lspace', 'voffset');
        var s = this.PHTMLdimen(v.lspace);
        var q = 0,
          n = 0,
          t = s.len,
          r = -s.len,
          p = 0;
        if (v.width !== '') {
          s = this.PHTMLdimen(v.width, 'w', 0);
          if (s.pm) {
            r += s.len;
          } else {
            u.style.width = g.Em(s.len);
          }
        }
        if (v.height !== '') {
          s = this.PHTMLdimen(v.height, 'h', 0);
          if (!s.pm) {
            q += -this.PHTMLbboxFor(0).h;
          }
          q += s.len;
        }
        if (v.depth !== '') {
          s = this.PHTMLdimen(v.depth, 'd', 0);
          if (!s.pm) {
            n += -this.PHTMLbboxFor(0).d;
            p += -s.len;
          }
          n += s.len;
        }
        if (v.voffset !== '') {
          s = this.PHTMLdimen(v.voffset);
          q -= s.len;
          n += s.len;
          p += s.len;
        }
        if (q) {
          o.style.marginTop = g.Em(q);
        }
        if (n) {
          o.style.marginBottom = g.Em(n);
        }
        if (t) {
          o.style.marginLeft = g.Em(t);
        }
        if (r) {
          o.style.marginRight = g.Em(r);
        }
        if (p) {
          u.style.verticalAlign = g.Em(p);
        }
        return u;
      },
      PHTMLdimen: function (q, r, n) {
        if (n == null) {
          n = -k;
        }
        q = String(q);
        var o = q.match(/width|height|depth/);
        var p = o ? this.PHTML[o[0].charAt(0)] : r ? this.PHTML[r] : 0;
        return { len: g.length2em(q, p) || 0, pm: !!q.match(/^[-+]/) };
      },
    });
    h.munderover.Augment({
      toPreviewHTML: function (r) {
        var t = this.getValues('displaystyle', 'accent', 'accentunder', 'align');
        var n = this.data[this.base];
        if (!t.displaystyle && n != null && (n.movablelimits || n.CoreMO().Get('movablelimits'))) {
          r = h.msubsup.prototype.toPreviewHTML.call(this, r);
          r.className = r.className.replace(/munderover/, 'msubsup');
          return r;
        }
        r = this.PHTMLdefaultSpan(r, { childSpans: true, className: '', noBBox: true });
        var p = this.PHTMLbboxFor(this.over),
          v = this.PHTMLbboxFor(this.under),
          u = this.PHTMLbboxFor(this.base),
          s = this.PHTML,
          o = p.acc;
        if (this.data[this.over]) {
          if (r.lastChild.firstChild) {
            r.lastChild.firstChild.style.marginLeft = p.l = r.lastChild.firstChild.style.marginRight = p.r = 0;
          }
          var q = e.Element('span', {}, [['span', { className: 'MJXp-over' }]]);
          q.firstChild.appendChild(r.lastChild);
          if (r.childNodes.length > (this.data[this.under] ? 1 : 0)) {
            q.firstChild.appendChild(r.firstChild);
          }
          this.data[this.over].PHTMLhandleScriptlevel(q.firstChild.firstChild);
          if (o != null) {
            if (p.vec) {
              q.firstChild.firstChild.firstChild.style.fontSize = '60%';
              p.h *= 0.6;
              p.d *= 0.6;
              p.w *= 0.6;
            }
            o = o - p.d + 0.1;
            if (u.t != null) {
              o += u.t - u.h;
            }
            q.firstChild.firstChild.style.marginBottom = g.Em(o);
          }
          if (r.firstChild) {
            r.insertBefore(q, r.firstChild);
          } else {
            r.appendChild(q);
          }
        }
        if (this.data[this.under]) {
          if (r.lastChild.firstChild) {
            r.lastChild.firstChild.style.marginLeft = v.l = r.lastChild.firstChild.marginRight = v.r = 0;
          }
          this.data[this.under].PHTMLhandleScriptlevel(r.lastChild);
        }
        s.w = Math.max(0.8 * p.w, 0.8 * v.w, u.w);
        s.h = 0.8 * (p.h + p.d + (o || 0)) + u.h;
        s.d = u.d + 0.8 * (v.h + v.d);
        return r;
      },
    });
    h.msubsup.Augment({
      toPreviewHTML: function (q) {
        q = this.PHTMLdefaultSpan(q, { noBBox: true });
        if (!this.data[this.base]) {
          if (q.firstChild) {
            q.insertBefore(e.Element('span'), q.firstChild);
          } else {
            q.appendChild(e.Element('span'));
          }
        }
        var s = this.data[this.base],
          p = this.data[this.sub],
          n = this.data[this.sup];
        if (!s) {
          s = { bbox: { h: 0.8, d: 0.2 } };
        }
        q.firstChild.style.marginRight = '.05em';
        var o = Math.max(0.4, s.PHTML.h - 0.4),
          u = Math.max(0.2, s.PHTML.d + 0.1);
        var t = this.PHTML;
        if (n && p) {
          var r = e.Element(
            'span',
            {
              className: 'MJXp-script-box',
              style: {
                height: g.Em(o + n.PHTML.h * 0.8 + u + p.PHTML.d * 0.8),
                'vertical-align': g.Em(-u - p.PHTML.d * 0.8),
              },
            },
            [
              [
                'span',
                {},
                [
                  [
                    'span',
                    {},
                    [['span', { style: { 'margin-bottom': g.Em(-(n.PHTML.d - 0.05)) } }]],
                  ],
                ],
              ],
              [
                'span',
                {},
                [['span', {}, [['span', { style: { 'margin-top': g.Em(-(n.PHTML.h - 0.05)) } }]]]],
              ],
            ],
          );
          p.PHTMLhandleScriptlevel(r.firstChild);
          n.PHTMLhandleScriptlevel(r.lastChild);
          r.firstChild.firstChild.firstChild.appendChild(q.lastChild);
          r.lastChild.firstChild.firstChild.appendChild(q.lastChild);
          q.appendChild(r);
          t.h = Math.max(s.PHTML.h, n.PHTML.h * 0.8 + o);
          t.d = Math.max(s.PHTML.d, p.PHTML.d * 0.8 + u);
          t.w = s.PHTML.w + Math.max(n.PHTML.w, p.PHTML.w) + 0.07;
        } else {
          if (n) {
            q.lastChild.style.verticalAlign = g.Em(o);
            n.PHTMLhandleScriptlevel(q.lastChild);
            t.h = Math.max(s.PHTML.h, n.PHTML.h * 0.8 + o);
            t.d = Math.max(s.PHTML.d, n.PHTML.d * 0.8 - o);
            t.w = s.PHTML.w + n.PHTML.w + 0.07;
          } else {
            if (p) {
              q.lastChild.style.verticalAlign = g.Em(-u);
              p.PHTMLhandleScriptlevel(q.lastChild);
              t.h = Math.max(s.PHTML.h, p.PHTML.h * 0.8 - u);
              t.d = Math.max(s.PHTML.d, p.PHTML.d * 0.8 + u);
              t.w = s.PHTML.w + p.PHTML.w + 0.07;
            }
          }
        }
        return q;
      },
    });
    h.mfrac.Augment({
      toPreviewHTML: function (r) {
        r = this.PHTMLdefaultSpan(r, {
          childSpans: true,
          className: 'MJXp-box',
          forceChild: true,
          noBBox: true,
        });
        var o = this.getValues('linethickness', 'displaystyle');
        if (!o.displaystyle) {
          if (this.data[0]) {
            this.data[0].PHTMLhandleScriptlevel(r.firstChild);
          }
          if (this.data[1]) {
            this.data[1].PHTMLhandleScriptlevel(r.lastChild);
          }
        }
        var n = e.Element('span', { className: 'MJXp-box' }, [
          [
            'span',
            { className: 'MJXp-denom' },
            [
              ['span', {}, [['span', { className: 'MJXp-rule', style: { height: '1em' } }]]],
              ['span'],
            ],
          ],
        ]);
        n.firstChild.lastChild.appendChild(r.lastChild);
        r.appendChild(n);
        var s = this.PHTMLbboxFor(0),
          p = this.PHTMLbboxFor(1),
          v = this.PHTML;
        v.w = Math.max(s.w, p.w) * 0.8;
        v.h = s.h + s.d + 0.1 + 0.25;
        v.d = p.h + p.d - 0.25;
        v.l = v.r = 0.125;
        o.linethickness = Math.max(0, g.length2em(o.linethickness || '0', 0));
        if (o.linethickness) {
          var u = n.firstChild.firstChild.firstChild;
          var q = g.Em(o.linethickness);
          u.style.borderTop = 'none';
          u.style.borderBottom = (o.linethickness < 0.15 ? '1px' : q) + ' solid';
          u.style.margin = q + ' 0';
          q = o.linethickness;
          n.style.marginTop = g.Em(3 * q - 1.2);
          r.style.verticalAlign = g.Em(1.5 * q + 0.1);
          v.h += 1.5 * q - 0.1;
          v.d += 1.5 * q;
        } else {
          n.style.marginTop = '-.7em';
        }
        return r;
      },
    });
    h.msqrt.Augment({
      toPreviewHTML: function (n) {
        n = this.PHTMLdefaultSpan(n, {
          childSpans: true,
          className: 'MJXp-box',
          forceChild: true,
          noBBox: true,
        });
        this.PHTMLlayoutRoot(n, n.firstChild);
        return n;
      },
      PHTMLlayoutRoot: function (u, n) {
        var v = this.PHTMLbboxFor(0);
        var q = Math.ceil((v.h + v.d + 0.14) * 100),
          w = g.Em(14 / q);
        var r = e.Element('span', { className: 'MJXp-surd' }, [
          ['span', { style: { 'font-size': q + '%', 'margin-top': w } }, ['\u221A']],
        ]);
        var s = e.Element('span', { className: 'MJXp-root' }, [
          ['span', { className: 'MJXp-rule', style: { 'border-top': '.08em solid' } }],
        ]);
        var p = ((1.2 / 2.2) * q) / 100;
        if (q > 150) {
          var o = Math.ceil((150 / q) * 10);
          r.firstChild.className = 'MJXp-right MJXp-scale' + o;
          r.firstChild.style.marginLeft = g.Em(((p * (o / 10 - 1)) / q) * 100);
          p = (p * o) / 10;
          s.firstChild.style.borderTopWidth = g.Em(0.08 / Math.sqrt(o / 10));
        }
        s.appendChild(n);
        u.appendChild(r);
        u.appendChild(s);
        this.PHTML.h = v.h + 0.18;
        this.PHTML.d = v.d;
        this.PHTML.w = v.w + p;
        return u;
      },
    });
    h.mroot.Augment({
      toPreviewHTML: function (q) {
        q = this.PHTMLdefaultSpan(q, {
          childSpans: true,
          className: 'MJXp-box',
          forceChild: true,
          noBBox: true,
        });
        var p = this.PHTMLbboxFor(1),
          n = q.removeChild(q.lastChild);
        var t = this.PHTMLlayoutRoot(e.Element('span'), q.firstChild);
        n.className = 'MJXp-script';
        var u = parseInt(t.firstChild.firstChild.style.fontSize);
        var o = 0.55 * (u / 120) + p.d * 0.8,
          s = -0.6 * (u / 120);
        if (u > 150) {
          s *= (0.95 * Math.ceil((150 / u) * 10)) / 10;
        }
        n.style.marginRight = g.Em(s);
        n.style.verticalAlign = g.Em(o);
        if (-s > p.w * 0.8) {
          n.style.marginLeft = g.Em(-s - p.w * 0.8);
        }
        q.appendChild(n);
        q.appendChild(t);
        this.PHTML.w += Math.max(0, p.w * 0.8 + s);
        this.PHTML.h = Math.max(this.PHTML.h, p.h * 0.8 + o);
        return q;
      },
      PHTMLlayoutRoot: h.msqrt.prototype.PHTMLlayoutRoot,
    });
    h.mfenced.Augment({
      toPreviewHTML: function (q) {
        q = this.PHTMLcreateSpan(q);
        this.PHTMLhandleStyle(q);
        this.PHTMLhandleColor(q);
        this.addFakeNodes();
        this.PHTMLaddChild(q, 'open', {});
        for (var p = 0, n = this.data.length; p < n; p++) {
          this.PHTMLaddChild(q, 'sep' + p, {});
          this.PHTMLaddChild(q, p, {});
        }
        this.PHTMLaddChild(q, 'close', {});
        var o = this.PHTML.h,
          r = this.PHTML.d;
        this.PHTMLstretchChild('open', o, r);
        for (p = 0, n = this.data.length; p < n; p++) {
          this.PHTMLstretchChild('sep' + p, o, r);
          this.PHTMLstretchChild(p, o, r);
        }
        this.PHTMLstretchChild('close', o, r);
        return q;
      },
    });
    h.mrow.Augment({
      toPreviewHTML: function (q) {
        q = this.PHTMLdefaultSpan(q);
        var p = this.PHTML.h,
          r = this.PHTML.d;
        for (var o = 0, n = this.data.length; o < n; o++) {
          this.PHTMLstretchChild(o, p, r);
        }
        return q;
      },
    });
    h.mstyle.Augment({
      toPreviewHTML: function (n) {
        n = this.PHTMLdefaultSpan(n);
        this.PHTMLhandleScriptlevel(n);
        return n;
      },
    });
    h.TeXAtom.Augment({
      toPreviewHTML: function (n) {
        n = this.PHTMLdefaultSpan(n);
        n.className = 'MJXp-mrow';
        return n;
      },
    });
    h.mtable.Augment({
      toPreviewHTML: function (E) {
        E = this.PHTMLdefaultSpan(E, { noBBox: true });
        var r = this.getValues(
          'columnalign',
          'rowalign',
          'columnspacing',
          'rowspacing',
          'columnwidth',
          'equalcolumns',
          'equalrows',
          'columnlines',
          'rowlines',
          'frame',
          'framespacing',
          'align',
          'width',
        );
        var u = MathJax.Hub.SplitList,
          F,
          A,
          D,
          z;
        var N = u(r.columnspacing),
          w = u(r.rowspacing),
          L = u(r.columnalign),
          t = u(r.rowalign);
        for (F = 0, A = N.length; F < A; F++) {
          N[F] = g.length2em(N[F]);
        }
        for (F = 0, A = w.length; F < A; F++) {
          w[F] = g.length2em(w[F]);
        }
        var K = e.Element('span');
        while (E.firstChild) {
          K.appendChild(E.firstChild);
        }
        E.appendChild(K);
        var y = 0,
          s = 0;
        for (F = 0, A = this.data.length; F < A; F++) {
          var v = this.data[F];
          if (v) {
            var J = g.arrayEntry(w, F - 1),
              C = g.arrayEntry(t, F);
            var x = v.PHTML,
              q = v.PHTMLspanElement();
            q.style.verticalAlign = C;
            var B = v.type === 'mlabeledtr' ? 1 : 0;
            for (D = 0, z = v.data.length; D < z - B; D++) {
              var p = v.data[D + B];
              if (p) {
                var M = g.arrayEntry(N, D - 1),
                  G = g.arrayEntry(L, D);
                var I = p.PHTMLspanElement();
                if (D) {
                  x.w += M;
                  I.style.paddingLeft = g.Em(M);
                }
                if (F) {
                  I.style.paddingTop = g.Em(J);
                }
                I.style.textAlign = G;
              }
            }
            y += x.h + x.d;
            if (F) {
              y += J;
            }
            if (x.w > s) {
              s = x.w;
            }
          }
        }
        var o = this.PHTML;
        o.w = s;
        o.h = y / 2 + 0.25;
        o.d = y / 2 - 0.25;
        o.l = o.r = 0.125;
        return E;
      },
    });
    h.mlabeledtr.Augment({
      PHTMLdefaultSpan: function (q, o) {
        if (!o) {
          o = {};
        }
        q = this.PHTMLcreateSpan(q);
        this.PHTMLhandleStyle(q);
        this.PHTMLhandleColor(q);
        if (this.isToken) {
          this.PHTMLhandleToken(q);
        }
        for (var p = 1, n = this.data.length; p < n; p++) {
          this.PHTMLaddChild(q, p, o);
        }
        return q;
      },
    });
    h.semantics.Augment({
      toPreviewHTML: function (n) {
        n = this.PHTMLcreateSpan(n);
        if (this.data[0]) {
          this.data[0].toPreviewHTML(n);
          MathJax.Hub.Insert(this.data[0].PHTML || {}, this.PHTML);
        }
        return n;
      },
    });
    h.annotation.Augment({ toPreviewHTML: function (n) {} });
    h['annotation-xml'].Augment({ toPreviewHTML: function (n) {} });
    MathJax.Hub.Register.StartupHook('onLoad', function () {
      setTimeout(MathJax.Callback(['loadComplete', g, 'jax.js']), 0);
    });
  });
  MathJax.Hub.Register.StartupHook('End Cookie', function () {
    if (b.config.menuSettings.zoom !== 'None') {
      i.Require('[MathJax]/extensions/MathZoom.js');
    }
  });
})(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.PreviewHTML);
