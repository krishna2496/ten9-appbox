/*
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

// const graphUtils = require('../../lib/jgraph/graph_utils.js');

export default function common(index: number) {
  const children = document.getElementsByClassName('card');
  const currentSelected = children[index] as HTMLElement;
  for (const selectedEle of children) {
    const selectedHtml = selectedEle as HTMLElement;
    selectedHtml.style.zIndex = '800';
  }
  currentSelected.style.zIndex = '1000';
}
