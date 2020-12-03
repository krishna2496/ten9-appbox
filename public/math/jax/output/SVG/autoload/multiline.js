/*
 *  /MathJax-v2/jax/output/SVG/autoload/multiline.js
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

MathJax.Hub.Register.StartupHook('SVG Jax Ready', function () {
  var d = '2.7.9';
  var a = MathJax.ElementJax.mml,
    g = MathJax.OutputJax.SVG,
    b = g.BBOX;
  var f = a.mo().With({ SVGdata: { w: 0, x: 0 } });
  var e = {
    newline: 0,
    nobreak: 1000000,
    goodbreak: [-200],
    badbreak: [+200],
    auto: [0],
    maxwidth: 1.33,
    toobig: 800,
    nestfactor: 400,
    spacefactor: -100,
    spaceoffset: 2,
    spacelimit: 1,
    fence: 500,
    close: 500,
  };
  var c = { linebreakstyle: 'after' };
  a.mrow.Augment({
    SVGmultiline: function (l) {
      var p = this;
      while (p.inferred || (p.parent && p.parent.type === 'mrow' && p.isEmbellished())) {
        p = p.parent;
      }
      var o = (p.type === 'math' && p.Get('display') === 'block') || p.type === 'mtd';
      p.isMultiline = true;
      var q = this.getValues(
        'linebreak',
        'linebreakstyle',
        'lineleading',
        'linebreakmultchar',
        'indentalign',
        'indentshift',
        'indentalignfirst',
        'indentshiftfirst',
        'indentalignlast',
        'indentshiftlast',
      );
      if (q.linebreakstyle === a.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE) {
        q.linebreakstyle = this.Get('infixlinebreakstyle');
      }
      q.lineleading = g.length2em(q.lineleading, 1, 0.5);
      l = this.SVG();
      if (p.type === 'math') {
        if (g.linebreakWidth < g.BIGDIMEN) {
          l.w = g.linebreakWidth;
        } else {
          l.w = g.cwidth;
        }
      }
      var h = { n: 0, Y: 0, scale: this.scale || 1, isTop: o, values: {}, VALUES: q },
        n = this.SVGgetAlign(h, {}),
        j = this.SVGgetShift(h, {}, n),
        i = [],
        k = { index: [], penalty: e.nobreak, w: 0, W: j, shift: j, scanW: j, nest: 0 },
        m = false;
      while (
        this.SVGbetterBreak(k, h, true) &&
        (k.scanW >= g.linebreakWidth || k.penalty === e.newline)
      ) {
        this.SVGaddLine(l, i, k.index, h, k.values, m);
        i = k.index.slice(0);
        m = true;
        n = this.SVGgetAlign(h, k.values);
        j = this.SVGgetShift(h, k.values, n);
        if (n === a.INDENTALIGN.CENTER) {
          j = 0;
        }
        k.W = k.shift = k.scanW = j;
        k.penalty = e.nobreak;
      }
      h.isLast = true;
      this.SVGaddLine(l, i, [], h, c, m);
      this.SVGhandleSpace(l);
      this.SVGhandleColor(l);
      l.isMultiline = true;
      this.SVGsaveData(l);
      return l;
    },
  });
  a.mbase.Augment({
    SVGlinebreakPenalty: e,
    SVGbetterBreak: function (l, h, s) {
      if (this.isToken) {
        return false;
      }
      if (this.isEmbellished()) {
        l.embellished = this;
        return this.CoreMO().SVGbetterBreak(l, h);
      }
      if (this.linebreakContainer) {
        return false;
      }
      var r = l.index.slice(0),
        p = l.index.shift(),
        o = this.data.length,
        n,
        t,
        k,
        q = l.index.length > 0,
        j = false;
      if (p == null) {
        p = -1;
      }
      if (!q) {
        p++;
        l.W += l.w;
        l.w = 0;
      }
      k = l.scanW = l.W;
      l.nest++;
      while (p < o && (l.scanW < e.maxwidth * g.linebreakWidth || l.w === 0)) {
        if (this.data[p]) {
          if (this.data[p].SVGbetterBreak(l, h)) {
            j = true;
            r = [p].concat(l.index);
            n = l.W;
            t = l.w;
            if (l.penalty === e.newline) {
              l.index = r;
              if (l.nest) {
                l.nest--;
              }
              return true;
            }
          }
          k = q ? l.scanW : this.SVGaddWidth(p, l, k);
        }
        l.index = [];
        p++;
        q = false;
      }
      if (s && j) {
        f.parent = this.parent;
        f.inherit = this.inherit;
        if (f.SVGbetterBreak(l, h)) {
          j = false;
          r = l.index;
        }
      }
      if (l.nest) {
        l.nest--;
      }
      l.index = r;
      if (j) {
        l.W = n;
      }
      return j;
    },
    SVGaddWidth: function (j, l, k) {
      if (this.data[j]) {
        var h = this.data[j].SVGdata;
        k += h.w + h.x;
        if (h.X) {
          k += h.X;
        }
        l.W = l.scanW = k;
        l.w = 0;
      }
      return k;
    },
    SVGaddLine: function (m, i, l, h, q, o) {
      var r = b();
      h.first = o;
      h.last = true;
      this.SVGmoveLine(i, l, r, h, q);
      r.Clean();
      var p = this.SVGgetAlign(h, q),
        j = this.SVGgetShift(h, q, p);
      if (h.n > 0) {
        var n = g.FONTDATA.baselineskip * h.scale;
        var k = (h.values.lineleading == null ? h.VALUES : h.values).lineleading * h.scale;
        h.Y -= Math.max(n, h.d + r.h + k);
      }
      if (r.w + j > m.w) {
        m.w = r.w + j;
      }
      m.Align(r, p, 0, h.Y, j);
      h.d = r.d;
      h.values = q;
      h.n++;
    },
    SVGgetAlign: function (k, h) {
      var l = h,
        i = k.values,
        j = k.VALUES,
        m;
      if (k.n === 0) {
        m = l.indentalignfirst || i.indentalignfirst || j.indentalignfirst;
      } else {
        if (k.isLast) {
          m = i.indentalignlast || j.indentalignlast;
        } else {
          m = i.indentalign || j.indentalign;
        }
      }
      if (m === a.INDENTALIGN.INDENTALIGN) {
        m = i.indentalign || j.indentalign;
      }
      if (m === a.INDENTALIGN.AUTO) {
        m = k.isTop ? this.displayAlign : a.INDENTALIGN.LEFT;
      }
      return m;
    },
    SVGgetShift: function (m, j, o) {
      var n = j,
        k = m.values,
        l = m.VALUES,
        i;
      if (m.n === 0) {
        i = n.indentshiftfirst || k.indentshiftfirst || l.indentshiftfirst;
      } else {
        if (m.isLast) {
          i = k.indentshiftlast || l.indentshiftlast;
        } else {
          i = k.indentshift || l.indentshift;
        }
      }
      if (i === a.INDENTSHIFT.INDENTSHIFT) {
        i = k.indentshift || l.indentshift;
      }
      if (i === 'auto' || i === '') {
        i = '0';
      }
      i = g.length2em(i, 1, g.cwidth);
      if (m.isTop && this.displayIndent !== '0') {
        var h = g.length2em(this.displayIndent, 1, g.cwidth);
        i += o === a.INDENTALIGN.RIGHT ? -h : h;
      }
      return i;
    },
    SVGmoveLine: function (q, h, l, p, k) {
      var n = q[0],
        m = h[0];
      if (n == null) {
        n = -1;
      }
      if (m == null) {
        m = this.data.length - 1;
      }
      if (n === m && q.length > 1) {
        this.data[n].SVGmoveSlice(q.slice(1), h.slice(1), l, p, k, 'paddingLeft');
      } else {
        var o = p.last;
        p.last = false;
        while (n < m) {
          if (this.data[n]) {
            if (q.length <= 1) {
              this.data[n].SVGmove(l, p, k);
            } else {
              this.data[n].SVGmoveSlice(q.slice(1), [], l, p, k, 'paddingLeft');
            }
          }
          n++;
          p.first = false;
          q = [];
        }
        p.last = o;
        if (this.data[n]) {
          if (h.length <= 1) {
            this.data[n].SVGmove(l, p, k);
          } else {
            this.data[n].SVGmoveSlice([], h.slice(1), l, p, k, 'paddingRight');
          }
        }
      }
    },
    SVGmoveSlice: function (n, h, j, k, i, l) {
      var m = b();
      this.SVGmoveLine(n, h, m, k, i);
      m.Clean();
      if (this.href) {
        this.SVGaddHref(m);
      }
      this.SVGhandleColor(m);
      if (n.length == 0) {
        this.SVGhandleSpace(m);
      }
      j.Add(m, j.w, 0, true);
      return m;
    },
    SVGmove: function (h, k, j) {
      if (
        !(k.first || k.last) ||
        (k.first && k.values.linebreakstyle === a.LINEBREAKSTYLE.BEFORE) ||
        (k.last && j.linebreakstyle === a.LINEBREAKSTYLE.AFTER)
      ) {
        var i = this.toSVG(this.SVGdata.HW, this.SVGdata.D);
        if (k.first || k.nextIsFirst) {
          i.x = 0;
        }
        if (k.last && i.X) {
          i.X = 0;
        }
        h.Add(i, h.w, 0, true);
      }
      if (k.first && i && i.w === 0) {
        k.nextIsFirst = true;
      } else {
        delete k.nextIsFirst;
      }
    },
  });
  a.mfenced.Augment({
    SVGbetterBreak: function (n, h) {
      var v = n.index.slice(0),
        t = n.index.shift(),
        q = this.data.length,
        p,
        x,
        o,
        u = n.index.length > 0,
        l = false;
      if (t == null) {
        t = -1;
      }
      if (!u) {
        t++;
        n.W += n.w;
        n.w = 0;
      }
      o = n.scanW = n.W;
      n.nest++;
      if (!this.dataI) {
        this.dataI = [];
        if (this.data.open) {
          this.dataI.push('open');
        }
        if (q) {
          this.dataI.push(0);
        }
        for (var s = 1; s < q; s++) {
          if (this.data['sep' + s]) {
            this.dataI.push('sep' + s);
          }
          this.dataI.push(s);
        }
        if (this.data.close) {
          this.dataI.push('close');
        }
      }
      q = this.dataI.length;
      while (t < q && (n.scanW < e.maxwidth * g.linebreakWidth || n.w === 0)) {
        var r = this.dataI[t];
        if (this.data[r]) {
          if (this.data[r].SVGbetterBreak(n, h)) {
            l = true;
            v = [t].concat(n.index);
            p = n.W;
            x = n.w;
            if (n.penalty === e.newline) {
              n.index = v;
              if (n.nest) {
                n.nest--;
              }
              return true;
            }
          }
          o = u ? n.scanW : this.SVGaddWidth(t, n, o);
        }
        n.index = [];
        t++;
        u = false;
      }
      if (n.nest) {
        n.nest--;
      }
      n.index = v;
      if (l) {
        n.W = p;
        n.w = x;
      }
      return l;
    },
    SVGmoveLine: function (l, n, q, h, s) {
      var p = l[0],
        o = n[0];
      if (p == null) {
        p = -1;
      }
      if (o == null) {
        o = this.dataI.length - 1;
      }
      if (p === o && l.length > 1) {
        this.data[this.dataI[p]].SVGmoveSlice(l.slice(1), n.slice(1), q, h, s, 'paddingLeft');
      } else {
        var r = h.last;
        h.last = false;
        var m = this.dataI[p];
        while (p < o) {
          if (this.data[m]) {
            if (l.length <= 1) {
              this.data[m].SVGmove(q, h, s);
            } else {
              this.data[m].SVGmoveSlice(l.slice(1), [], q, h, s, 'paddingLeft');
            }
          }
          p++;
          m = this.dataI[p];
          h.first = false;
          l = [];
        }
        h.last = r;
        if (this.data[m]) {
          if (n.length <= 1) {
            this.data[m].SVGmove(q, h, s);
          } else {
            this.data[m].SVGmoveSlice([], n.slice(1), q, h, s, 'paddingRight');
          }
        }
      }
    },
  });
  a.msubsup.Augment({
    SVGbetterBreak: function (k, h) {
      if (!this.data[this.base]) {
        return false;
      }
      var p = k.index.slice(0),
        n = k.index.shift(),
        m,
        q,
        l,
        o = k.index.length > 0,
        j = false;
      if (!o) {
        k.W += k.w;
        k.w = 0;
      }
      l = k.scanW = k.W;
      if (n == null) {
        this.SVGdata.dw = this.SVGdata.w - this.data[this.base].SVGdata.w;
      }
      if (this.data[this.base].SVGbetterBreak(k, h)) {
        j = true;
        p = [this.base].concat(k.index);
        m = k.W;
        q = k.w;
        if (k.penalty === e.newline) {
          j = o = true;
        }
      }
      if (!o) {
        this.SVGaddWidth(this.base, k, l);
      }
      k.scanW += this.SVGdata.dw;
      k.W = k.scanW;
      k.index = [];
      if (j) {
        k.W = m;
        k.w = q;
        k.index = p;
      }
      return j;
    },
    SVGmoveLine: function (j, l, o, i, q) {
      if (this.data[this.base]) {
        if (j.length > 1) {
          this.data[this.base].SVGmoveSlice(j.slice(1), l.slice(1), o, i, q, 'paddingLeft');
        } else {
          if (l.length <= 1) {
            this.data[this.base].SVGmove(o, i, q);
          } else {
            this.data[this.base].SVGmoveSlice([], l.slice(1), o, i, q, 'paddingRight');
          }
        }
      }
      if (l.length === 0) {
        var n = this.data[this.sup],
          h = this.data[this.sub],
          p = o.w,
          m;
        var k = (this.data[this.base].SVGdata || {}).ic || 0;
        if (n) {
          m = n.SVGdata || {};
          o.Add(n.toSVG(), p + (m.dx || 0) - k, m.dy);
        }
        if (h) {
          m = h.SVGdata || {};
          o.Add(h.toSVG(), p + (m.dx || 0) - k, m.dy);
        }
      }
    },
  });
  a.mmultiscripts.Augment({
    SVGbetterBreak: function (k, i) {
      if (!this.data[this.base]) {
        return false;
      }
      var o = k.index.slice(0);
      k.index.shift();
      var m,
        p,
        l,
        n = k.index.length > 0,
        j = false;
      if (!n) {
        k.W += k.w;
        k.w = 0;
      }
      k.scanW = k.W;
      var h = this.SVGdata.w - this.data[this.base].SVGdata.w - this.SVGdata.dx;
      k.scanW += this.SVGdata.dx;
      l = k.scanW;
      if (this.data[this.base].SVGbetterBreak(k, i)) {
        j = true;
        o = [this.base].concat(k.index);
        m = k.W;
        p = k.w;
        if (k.penalty === e.newline) {
          j = n = true;
        }
      }
      if (!n) {
        this.SVGaddWidth(this.base, k, l);
      }
      k.scanW += h;
      k.W = k.scanW;
      k.index = [];
      if (j) {
        k.W = m;
        k.w = p;
        k.index = o;
      }
      return j;
    },
    SVGmoveLine: function (j, l, o, i, q) {
      var r,
        n = this.SVGdata;
      if (j.length < 1) {
        this.scriptBox = this.SVGgetScripts(this.SVGdata.s);
        var k = this.scriptBox[2],
          p = this.scriptBox[3];
        r = o.w + n.dx;
        if (p) {
          o.Add(p, r + n.delta - p.w, n.u);
        }
        if (k) {
          o.Add(k, r - k.w, -n.v);
        }
      }
      if (this.data[this.base]) {
        if (j.length > 1) {
          this.data[this.base].SVGmoveSlice(j.slice(1), l.slice(1), o, i, q, 'paddingLeft');
        } else {
          if (l.length <= 1) {
            this.data[this.base].SVGmove(o, i, q);
          } else {
            this.data[this.base].SVGmoveSlice([], l.slice(1), o, i, q, 'paddingRight');
          }
        }
      }
      if (l.length === 0) {
        var h = this.scriptBox[0],
          m = this.scriptBox[1];
        r = o.w + n.s;
        if (m) {
          o.Add(m, r, n.u);
        }
        if (h) {
          o.Add(h, r - n.delta, -n.v);
        }
        delete this.scriptBox;
      }
    },
  });
  a.mo.Augment({
    SVGbetterBreak: function (j, h) {
      if (j.values && j.values.last === this) {
        return false;
      }
      var r = this.getValues(
        'linebreak',
        'linebreakstyle',
        'lineleading',
        'linebreakmultchar',
        'indentalign',
        'indentshift',
        'indentalignfirst',
        'indentshiftfirst',
        'indentalignlast',
        'indentshiftlast',
        'texClass',
        'fence',
      );
      if (r.linebreakstyle === a.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE) {
        r.linebreakstyle = this.Get('infixlinebreakstyle');
      }
      if (r.texClass === a.TEXCLASS.OPEN) {
        j.nest++;
      }
      if (r.texClass === a.TEXCLASS.CLOSE && j.nest) {
        j.nest--;
      }
      var k = j.scanW,
        l = j.embellished;
      delete j.embellished;
      if (!l || !l.SVGdata) {
        l = this;
      }
      var n = l.SVGdata,
        q = n.w + n.x;
      if (r.linebreakstyle === a.LINEBREAKSTYLE.AFTER) {
        k += q;
        q = 0;
      }
      if (k - j.shift === 0 && r.linebreak !== a.LINEBREAK.NEWLINE) {
        return false;
      }
      var m = g.linebreakWidth - k;
      if (
        h.n === 0 &&
        (r.indentshiftfirst !== h.VALUES.indentshiftfirst ||
          r.indentalignfirst !== h.VALUES.indentalignfirst)
      ) {
        var o = this.SVGgetAlign(h, r),
          i = this.SVGgetShift(h, r, o);
        m += j.shift - i;
      }
      var p = Math.floor((m / g.linebreakWidth) * 1000);
      if (p < 0) {
        p = e.toobig - 3 * p;
      }
      if (r.fence) {
        p += e.fence;
      }
      if (
        (r.linebreakstyle === a.LINEBREAKSTYLE.AFTER && r.texClass === a.TEXCLASS.OPEN) ||
        r.texClass === a.TEXCLASS.CLOSE
      ) {
        p += e.close;
      }
      p += j.nest * e.nestfactor;
      var s = e[r.linebreak || a.LINEBREAK.AUTO] || 0;
      if (!MathJax.Object.isArray(s)) {
        if (s || m >= 0) {
          p = s * j.nest;
        }
      } else {
        p = Math.max(1, p + s[0] * j.nest);
      }
      if (p >= j.penalty) {
        return false;
      }
      j.penalty = p;
      j.values = r;
      j.W = k;
      j.w = q;
      r.lineleading = g.length2em(r.lineleading, 1, h.VALUES.lineleading);
      r.last = this;
      return true;
    },
  });
  a.mspace.Augment({
    SVGbetterBreak: function (i, h) {
      if (i.values && i.values.last === this) {
        return false;
      }
      var p = this.getValues('linebreak');
      var n = p.linebreak;
      if (!n || this.hasDimAttr()) {
        n = a.LINEBREAK.AUTO;
      }
      var j = i.scanW,
        l = this.SVGdata,
        o = l.w + l.x;
      if (j - i.shift === 0) {
        return false;
      }
      var k = g.linebreakWidth - j;
      var m = Math.floor((k / g.linebreakWidth) * 1000);
      if (m < 0) {
        m = e.toobig - 3 * m;
      }
      m += i.nest * e.nestfactor;
      var q = e[n] || 0;
      if (
        n === a.LINEBREAK.AUTO &&
        o >= e.spacelimit * 1000 &&
        !this.mathbackground &&
        !this.backrgound
      ) {
        q = [(o / 1000 + e.spaceoffset) * e.spacefactor];
      }
      if (!MathJax.Object.isArray(q)) {
        if (q || k >= 0) {
          m = q * i.nest;
        }
      } else {
        m = Math.max(1, m + q[0] * i.nest);
      }
      if (m >= i.penalty) {
        return false;
      }
      i.penalty = m;
      i.values = p;
      i.W = j;
      i.w = o;
      p.lineleading = h.VALUES.lineleading;
      p.linebreakstyle = 'before';
      p.last = this;
      return true;
    },
  });
  MathJax.Hub.Register.StartupHook('TeX mathchoice Ready', function () {
    a.TeXmathchoice.Augment({
      SVGbetterBreak: function (i, h) {
        return this.Core().SVGbetterBreak(i, h);
      },
      SVGmoveLine: function (l, h, j, k, i) {
        return this.Core().SVGmoveSlice(l, h, j, k, i);
      },
    });
  });
  a.maction.Augment({
    SVGbetterBreak: function (i, h) {
      return this.Core().SVGbetterBreak(i, h);
    },
    SVGmoveLine: function (l, h, j, k, i) {
      return this.Core().SVGmoveSlice(l, h, j, k, i);
    },
  });
  a.semantics.Augment({
    SVGbetterBreak: function (i, h) {
      return this.data[0] ? this.data[0].SVGbetterBreak(i, h) : false;
    },
    SVGmoveLine: function (l, h, j, k, i) {
      return this.data[0] ? this.data[0].SVGmoveSlice(l, h, j, k, i) : null;
    },
  });
  MathJax.Hub.Startup.signal.Post('SVG multiline Ready');
  MathJax.Ajax.loadComplete(g.autoloadDir + '/multiline.js');
});
