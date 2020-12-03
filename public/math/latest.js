/*
 *  /MathJax-v2/latest.js
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

(function () {
  var k = {
    'cdnjs.cloudflare.com': {
      api: 'https://api.cdnjs.com/libraries/mathjax?fields=version',
      key: 'version',
      base: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/',
    },
    'rawcdn.githack.com': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      key: 'tag_name',
      base: 'https://rawcdn.githack.com/mathjax/MathJax/',
    },
    'gitcdn.xyz': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      key: 'tag_name',
      base: 'https://gitcdn.xyz/mathjax/MathJax/',
    },
    'cdn.statically.io': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      key: 'tag_name',
      base: 'https://cdn.statically.io/gh/mathjax/MathJax/',
    },
    'unpkg.com': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      key: 'tag_name',
      base: 'https://unpkg.com/mathjax@',
    },
    'cdn.jsdelivr.net': {
      api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
      key: 'tag_name',
      base: 'https://cdn.jsdelivr.net/npm/mathjax@',
    },
  };
  var t = { api: 'https://api.github.com/repos/mathjax/mathjax/releases', key: 'tag_name' };
  var r = 2;
  var n = 'mjx-latest-version' + r;
  var g = 1000 * 60 * 60 * 24 * 7;
  var s = null;
  function u(v) {
    if (console && console.error) {
      console.error('MathJax(latest.js): ' + v);
    }
  }
  function o(w, v) {
    w.parentNode.removeChild(w);
    var z = w.src;
    var x = z.replace(/.*?\/latest\.js(\?|$)/, '$1');
    var y = z.match(/(\d+\.\d+\.\d+)(\/unpacked)?\/latest.js\?/) || ['', '', ''];
    return { tag: w, src: z, id: w.id, version: y[1], unpacked: y[2] || '', config: x, cdn: v };
  }
  function l(x) {
    var A = Object.keys(k);
    for (var z = 0, v = A.length; z < v; z++) {
      var w = k[A[z]];
      var y = w.base;
      var B = x.src;
      if (B && B.substr(0, y.length) === y && B.match(/\/latest\.js(\?|$)/)) {
        return o(x, w);
      }
    }
    return null;
  }
  function p() {
    if (document.currentScript) {
      return o(document.currentScript);
    }
    var x = document.getElementById('MathJax-script');
    if (x && x.nodeName.toLowerCase() === 'script') {
      return l(x);
    }
    var w = document.getElementsByTagName('script');
    for (var y = 0, v = w.length; y < v; y++) {
      var z = l(w[y]);
      if (z) {
        return z;
      }
    }
    return null;
  }
  function c(v) {
    try {
      var x = v + ' ' + Date.now();
      localStorage.setItem(n, x);
    } catch (w) {}
  }
  function j() {
    try {
      var y = localStorage.getItem(n).split(/ /);
      var v = y[0],
        w = y[0];
      if (w && Date.now() - parseInt(w) < g) {
        return v;
      }
    } catch (x) {}
    return null;
  }
  function a(w, y) {
    var v = document.createElement('script');
    v.type = 'text/javascript';
    v.async = true;
    v.src = w;
    if (y) {
      v.id = y;
    }
    var x = document.head || document.getElementsByTagName('head')[0] || document.body;
    if (x) {
      x.appendChild(v);
    } else {
      u("Can't find the document <head> element");
    }
  }
  function q() {
    if (s) {
      a(s.src.replace(/\/latest\.js/, '/MathJax.js'), s.id);
    } else {
      u("Can't determine the URL for loading MathJax");
    }
  }
  function b(v) {
    var w = 'MathJax.js' + s.config;
    if (s.version && s.version !== v) {
      w = 'latest.js' + s.config;
    }
    a(s.cdn.base + v + s.unpacked + '/' + w, s.id);
  }
  function d(v) {
    var w = parseInt(v.split(/\./)[0]);
    if (w === r && !v.match(/-(beta|rc)/)) {
      c(v);
      b(v);
      return true;
    }
    return false;
  }
  function f() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
      try {
        return new window.ActiveXObject('Msxml2.XMLHTTP');
      } catch (v) {}
      try {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
      } catch (v) {}
    }
  }
  function i(v, y, w) {
    var x = f();
    if (x) {
      x.onreadystatechange = function () {
        if (x.readyState === 4) {
          if (x.status === 200) {
            !y(JSON.parse(x.responseText)) && w();
          } else {
            u('Problem acquiring MathJax version: status = ' + x.status);
            w();
          }
        }
      };
      x.open('GET', v.api, true);
      x.send(null);
    } else {
      u("Can't create XMLHttpRequest object");
      w();
    }
  }
  function h() {
    i(
      t,
      function (x) {
        if (!(x instanceof Array)) {
          return;
        }
        for (var w = 0, v = x.length; w < v; w++) {
          if (d(x[w][t.key])) {
            return true;
          }
        }
        return false;
      },
      q,
    );
  }
  function m() {
    i(
      s.cdn,
      function (v) {
        if (v instanceof Array) {
          v = v[0];
        }
        if (!d(v[s.cdn.key])) {
          h();
        }
        return true;
      },
      q,
    );
  }
  s = p();
  if (s && s.cdn) {
    var e = j();
    e ? b(e) : m();
  } else {
    q();
  }
})();
