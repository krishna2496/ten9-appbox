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

import {
  mxPoint,
  mxUtils,
} from 'mxgraph/javascript/mxClient';

export function getOffset(originElt, elt) {
  // var offsetLeft = 0;
  // var offsetTop = 0;

  // Ignores document scroll origin for fixed elements
  // var fixed = false;
  // var node = elt;
  // var body = document.body;
  // var document = document.documentElement;

  const originRect = originElt.getBoundingClientRect();
  const eltRect = elt.getBoundingClientRect();

  const offsetLeft = eltRect.left - originRect.left;
  const offsetTop = eltRect.top - originRect.top;

  // while (node != null && node != originElt && node != body && node != document && !fixed) {
  //   var style = mxUtils.getCurrentStyle(node);
  //   if (style != null) {
  //     fixed = fixed || style.position == 'fixed';
  //   }
  //   node = node.parentNode;
  // }

  // if (!scrollOffset && !fixed) {
  //   var offset = mxUtils.getDocumentScrollOrigin(container.ownerDocument);
  //   offsetLeft += offset.x;
  //   offsetTop += offset.y;
  // }

  // var r = container.getBoundingClientRect();

  // if (r != null) {
  //   offsetLeft += r.left;
  //   offsetTop += r.top;
  // }

  return new mxPoint(offsetLeft, offsetTop);
}