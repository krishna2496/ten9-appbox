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

const graphUtils = require('../../lib/jgraph/graph_utils.js');

export function bringWindowToFront(index: number) {
  const children = document.getElementsByClassName('card');
  const currentSelected = children[index] as HTMLElement;
  for (const selectedEle of children) {
    const selectedHtml = selectedEle as HTMLElement;
    selectedHtml.style.zIndex = '800';
  }
  currentSelected.style.zIndex = '1000';
}

export function dragElement(el: HTMLDivElement, index: number) {
  let newX = 0,
    newY = 0,
    prevX = 0,
    prevY = 0;

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function elementDrag(e: MouseEvent) {
    e.preventDefault();
    // calculate the new cursor position:
    newX = prevX - e.clientX;
    newY = prevY - e.clientY;
    prevX = e.clientX;
    prevY = e.clientY;
    // set the element's new position:
    let windowHeight;
    let windowWidth;

    // TODO: Need to abstract out the 'find'/'card' and indexes
    const containerRect = graphUtils.getDocumentContainerRect() as DOMRect;
    if (index === 0) {
      const findWindow = document.getElementsByClassName('find')[index] as HTMLElement;
      windowHeight = findWindow.offsetHeight;
      windowWidth = findWindow.offsetWidth;
    } else {
      const card = document.getElementsByClassName('card')[index] as HTMLElement;
      windowHeight = card.offsetHeight;
      windowWidth = card.offsetWidth;
    }

    // Update the element top
    let newTop = el.offsetTop - newY;
    newTop = Math.max(0, newTop);
    newTop = Math.min(containerRect.height - windowHeight, newTop);
    el.style.top = `${newTop}px`;

    // Update the element left
    let newLeft = el.offsetLeft - newX;
    newLeft = Math.max(0, newLeft);
    newLeft = Math.min(containerRect.width - windowWidth, newLeft);
    el.style.left = `${newLeft}px`;
  }

  function dragMouseDown(e: MouseEvent) {
    bringWindowToFront(index);
    const handle = document.getElementsByClassName('card-header')[index];

    if (handle.contains(e.target as Node)) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      prevX = e.clientX;
      prevY = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  }
  const headerEl = document.getElementById(el.id + 'header');

  if (headerEl) {
    // if present, the header is where you move the DIV from:
    headerEl.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    el.onmousedown = dragMouseDown;
  }
}
