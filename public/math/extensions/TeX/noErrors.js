/*
 *  /MathJax-v2/extensions/TeX/noErrors.js
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

(function (b, e) {
  var d = '2.7.9';
  var a = b.CombineConfig('TeX.noErrors', {
    disabled: false,
    multiLine: true,
    inlineDelimiters: ['', ''],
    style: {
      'font-size': '90%',
      'text-align': 'left',
      color: 'black',
      padding: '1px 3px',
      border: '1px solid',
    },
  });
  var c = '\u00A0';
  MathJax.Extension['TeX/noErrors'] = { version: d, config: a };
  b.Register.StartupHook('TeX Jax Ready', function () {
    var f = MathJax.InputJax.TeX.formatError;
    MathJax.InputJax.TeX.Augment({
      formatError: function (j, i, k, g) {
        if (a.disabled) {
          return f.apply(this, arguments);
        }
        var h = j.message.replace(/\n.*/, '');
        b.signal.Post(['TeX Jax - parse error', h, i, k, g]);
        var m = a.inlineDelimiters;
        var l = k || a.multiLine;
        if (!k) {
          i = m[0] + i + m[1];
        }
        if (l) {
          i = i.replace(/ /g, c);
        } else {
          i = i.replace(/\n/g, ' ');
        }
        return MathJax.ElementJax.mml.merror(i).With({ isError: true, multiLine: l });
      },
    });
  });
  b.Register.StartupHook('HTML-CSS Jax Config', function () {
    b.Config({
      'HTML-CSS': {
        styles: {
          '.MathJax .noError': b.Insert(
            { 'vertical-align': b.Browser.isMSIE && a.multiLine ? '-2px' : '' },
            a.style,
          ),
        },
      },
    });
  });
  b.Register.StartupHook('HTML-CSS Jax Ready', function () {
    var g = MathJax.ElementJax.mml;
    var h = MathJax.OutputJax['HTML-CSS'];
    var f = g.math.prototype.toHTML,
      i = g.merror.prototype.toHTML;
    g.math.Augment({
      toHTML: function (j, k) {
        var l = this.data[0];
        if (l && l.data[0] && l.data[0].isError) {
          j.style.fontSize = '';
          j = this.HTMLcreateSpan(j);
          j.bbox = l.data[0].toHTML(j).bbox;
        } else {
          j = f.apply(this, arguments);
        }
        return j;
      },
    });
    g.merror.Augment({
      toHTML: function (p) {
        if (!this.isError) {
          return i.apply(this, arguments);
        }
        p = this.HTMLcreateSpan(p);
        p.className = 'noError';
        if (this.multiLine) {
          p.style.display = 'inline-block';
        }
        var r = this.data[0].data[0].data.join('').split(/\n/);
        for (var o = 0, l = r.length; o < l; o++) {
          h.addText(p, r[o]);
          if (o !== l - 1) {
            h.addElement(p, 'br', { isMathJax: true });
          }
        }
        var q = h.getHD(p.parentNode),
          k = h.getW(p.parentNode);
        if (l > 1) {
          var n = (q.h + q.d) / 2,
            j = h.TeX.x_height / 2;
          p.parentNode.style.verticalAlign = h.Em(q.d + (j - n));
          q.h = j + n;
          q.d = n - j;
        }
        p.bbox = { h: q.h, d: q.d, w: k, lw: 0, rw: k };
        return p;
      },
    });
  });
  b.Register.StartupHook('SVG Jax Config', function () {
    b.Config({
      SVG: {
        styles: {
          '.MathJax_SVG .noError': b.Insert(
            { 'vertical-align': b.Browser.isMSIE && a.multiLine ? '-2px' : '' },
            a.style,
          ),
        },
      },
    });
  });
  b.Register.StartupHook('SVG Jax Ready', function () {
    var g = MathJax.ElementJax.mml;
    var f = g.math.prototype.toSVG,
      h = g.merror.prototype.toSVG;
    g.math.Augment({
      toSVG: function (i, j) {
        var k = this.data[0];
        if (k && k.data[0] && k.data[0].isError) {
          i = k.data[0].toSVG(i);
        } else {
          i = f.apply(this, arguments);
        }
        return i;
      },
    });
    g.merror.Augment({
      toSVG: function (n) {
        if (!this.isError || this.Parent().type !== 'math') {
          return h.apply(this, arguments);
        }
        n = e.addElement(n, 'span', { className: 'noError', isMathJax: true });
        if (this.multiLine) {
          n.style.display = 'inline-block';
        }
        var o = this.data[0].data[0].data.join('').split(/\n/);
        for (var l = 0, j = o.length; l < j; l++) {
          e.addText(n, o[l]);
          if (l !== j - 1) {
            e.addElement(n, 'br', { isMathJax: true });
          }
        }
        if (j > 1) {
          var k = n.offsetHeight / 2;
          n.style.verticalAlign = -k + k / j + 'px';
        }
        return n;
      },
    });
  });
  b.Register.StartupHook('NativeMML Jax Ready', function () {
    var h = MathJax.ElementJax.mml;
    var g = MathJax.Extension['TeX/noErrors'].config;
    var f = h.math.prototype.toNativeMML,
      i = h.merror.prototype.toNativeMML;
    h.math.Augment({
      toNativeMML: function (j) {
        var k = this.data[0];
        if (k && k.data[0] && k.data[0].isError) {
          j = k.data[0].toNativeMML(j);
        } else {
          j = f.apply(this, arguments);
        }
        return j;
      },
    });
    h.merror.Augment({
      toNativeMML: function (n) {
        if (!this.isError) {
          return i.apply(this, arguments);
        }
        n = n.appendChild(document.createElement('span'));
        var o = this.data[0].data[0].data.join('').split(/\n/);
        for (var l = 0, k = o.length; l < k; l++) {
          n.appendChild(document.createTextNode(o[l]));
          if (l !== k - 1) {
            n.appendChild(document.createElement('br'));
          }
        }
        if (this.multiLine) {
          n.style.display = 'inline-block';
          if (k > 1) {
            n.style.verticalAlign = 'middle';
          }
        }
        for (var p in g.style) {
          if (g.style.hasOwnProperty(p)) {
            var j = p.replace(/-./g, function (m) {
              return m.charAt(1).toUpperCase();
            });
            n.style[j] = g.style[p];
          }
        }
        return n;
      },
    });
  });
  b.Register.StartupHook('PreviewHTML Jax Config', function () {
    b.Config({
      PreviewHTML: {
        styles: {
          '.MathJax_PHTML .noError': b.Insert(
            { 'vertical-align': b.Browser.isMSIE && a.multiLine ? '-2px' : '' },
            a.style,
          ),
        },
      },
    });
  });
  b.Register.StartupHook('PreviewHTML Jax Ready', function () {
    var f = MathJax.ElementJax.mml;
    var h = MathJax.HTML;
    var g = f.merror.prototype.toPreviewHTML;
    f.merror.Augment({
      toPreviewHTML: function (l) {
        if (!this.isError) {
          return g.apply(this, arguments);
        }
        l = this.PHTMLcreateSpan(l);
        l.className = 'noError';
        if (this.multiLine) {
          l.style.display = 'inline-block';
        }
        var n = this.data[0].data[0].data.join('').split(/\n/);
        for (var k = 0, j = n.length; k < j; k++) {
          h.addText(l, n[k]);
          if (k !== j - 1) {
            h.addElement(l, 'br', { isMathJax: true });
          }
        }
        return l;
      },
    });
  });
  b.Register.StartupHook('CommonHTML Jax Config', function () {
    b.Config({
      CommonHTML: {
        styles: {
          '.mjx-chtml .mjx-noError': b.Insert(
            { 'line-height': 1.2, 'vertical-align': b.Browser.isMSIE && a.multiLine ? '-2px' : '' },
            a.style,
          ),
        },
      },
    });
  });
  b.Register.StartupHook('CommonHTML Jax Ready', function () {
    var f = MathJax.ElementJax.mml;
    var g = MathJax.OutputJax.CommonHTML;
    var i = MathJax.HTML;
    var h = f.merror.prototype.toCommonHTML;
    f.merror.Augment({
      toCommonHTML: function (n) {
        if (!this.isError) {
          return h.apply(this, arguments);
        }
        n = g.addElement(n, 'mjx-noError');
        var p = this.data[0].data[0].data.join('').split(/\n/);
        for (var k = 0, j = p.length; k < j; k++) {
          i.addText(n, p[k]);
          if (k !== j - 1) {
            g.addElement(n, 'br', { isMathJax: true });
          }
        }
        var o = (this.CHTML = g.BBOX.zero());
        o.w = n.offsetWidth / g.em;
        if (j > 1) {
          var l = (1.2 * j) / 2;
          o.h = l + 0.25;
          o.d = l - 0.25;
          n.style.verticalAlign = g.Em(0.45 - l);
        } else {
          o.h = 1;
          o.d = 0.2 + 2 / g.em;
        }
        return n;
      },
    });
  });
  b.Startup.signal.Post('TeX noErrors Ready');
})(MathJax.Hub, MathJax.HTML);
MathJax.Ajax.loadComplete('[MathJax]/extensions/TeX/noErrors.js');
