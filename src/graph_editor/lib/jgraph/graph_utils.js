/**
 * ten9, Inc
 * Copyright (c) 2015 - 2020 ten9, Inc
 * -----
 * NOTICE:  All information contained herein is, and remains
 * the property of ten9 Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to ten9 Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from ten9 Incorporated.
 * -----
 */

const { mxPoint, mxRectangle } = require('./mxClient.js');

export function getOffset(originEl, el) {
  const originRect = originEl.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  const offsetLeft = elRect.left - originRect.left;
  const offsetTop = elRect.top - originRect.top;

  return new mxPoint(offsetLeft, offsetTop);
}

export function copyTextToClipboard(text) {
  var textArea = document.createElement('textarea');

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
  } catch (err) {
    // do nothing
  }

  document.body.removeChild(textArea);
}

export function fit(node, container) {
  if (container.offsetHeight === 0) {
    container = container.offsetParent;
  }

  var ds = new mxRectangle(0, 0, container.clientWidth, container.clientHeight);

  var left = parseInt(node.offsetLeft);
  var width = parseInt(node.offsetWidth);
  var sl = container.scrollLeft;
  var st = container.scrollTop;
  var right = sl + ds.width;

  if (left + width > right) {
    node.style.left = Math.max(sl, right - width) + 'px';
  }

  var top = parseInt(node.offsetTop);
  var height = parseInt(node.offsetHeight);

  var bottom = st + ds.height;

  if (top + height > bottom) {
    node.style.top = Math.max(st, bottom - height) + 'px';
  }
}
