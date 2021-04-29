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

export default function dragElement(elmnt: HTMLDivElement, index: number) {
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

    const containerRect = graphUtils.getDocumentContainerRect() as DOMRect;
    if (index == 0) {
      const findWindow = document.getElementsByClassName('find')[index] as HTMLElement;
      windowHeight = findWindow.offsetHeight;
      windowWidth = findWindow.offsetWidth;
    } else {
      const card = document.getElementsByClassName('card')[index] as HTMLElement;
      windowHeight = card.offsetHeight;
      windowWidth = card.offsetWidth;
    }

    if (
      containerRect.y <= elmnt.offsetTop - newY + containerRect.y &&
      containerRect.height >= elmnt.offsetTop - newY + containerRect.y + windowHeight
    ) {
      const top = elmnt.offsetTop - newY;
      elmnt.style.top = `${top}px`;
    }
    let count = 0;
    if (containerRect.x <= elmnt.offsetLeft - newX + containerRect.x) {
      count = 1;
      const left = elmnt.offsetLeft - newX;
      elmnt.style.left = `${left}px`;
    } else {
      count = 0;
      elmnt.style.left = '0px';
    }

    if (
      containerRect.width + containerRect.x >=
      elmnt.offsetLeft - newX + containerRect.x + windowWidth
    ) {
      if (count === 0) {
        const left = elmnt.offsetLeft - newX;
        elmnt.style.left = `${left}px`;
      }
    } else {
      const left = containerRect.width - windowWidth;
      elmnt.style.left = `${left}px`;
    }
  }

  function dragMouseDown(e: MouseEvent) {
    const children = document.getElementsByClassName('card');
    const currentSelected = children[index] as HTMLElement;
    for (const selectedEle of children) {
      const selectedHtml = selectedEle as HTMLElement;
      selectedHtml.style.zIndex = '800';
    }
    currentSelected.style.zIndex = '1000';
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
  const headerEl = document.getElementById(elmnt.id + 'header');

  if (headerEl) {
    // if present, the header is where you move the DIV from:
    headerEl.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
}
