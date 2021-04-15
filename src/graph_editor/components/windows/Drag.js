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

export default function dragElement(elmnt, index) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  function closeDragElement() {
    // stop moving when mouse button is r   eleased:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    let windowHeight;
    let windowWidth;
    const paddingTop = document.getElementById('container').getBoundingClientRect();
    if (index == 0) {
      windowHeight = document.getElementsByClassName('find')[0].offsetHeight;
      windowWidth = document.getElementsByClassName('find')[0].offsetWidth;
    } else {
      windowHeight = document.getElementsByClassName('card')[index].offsetHeight;
      windowWidth = document.getElementsByClassName('card')[index].offsetWidth;
    }

    if (
      paddingTop.y <= elmnt.offsetTop - pos2 + paddingTop.y &&
      paddingTop.height >=
        Number(elmnt.offsetTop) - Number(pos2) + Number(paddingTop.y) + Number(windowHeight)
    ) {
      const top = elmnt.offsetTop - pos2;
      elmnt.style.top = String(top) + 'px';
    }

    if (paddingTop.x <= elmnt.offsetLeft - pos1 + paddingTop.x) {
      const left = elmnt.offsetLeft - pos1;
      elmnt.style.left = String(left) + 'px';
      console.log(1);
    } else {
      elmnt.style.left = String(0) + 'px';
    }

    if (
      paddingTop.width + paddingTop.x >=
      Number(elmnt.offsetLeft) - Number(pos1) + Number(paddingTop.x) + Number(windowWidth)
    ) {
      const left = elmnt.offsetLeft - pos1;
      elmnt.style.left = String(left) + 'px';
    } else {
      const left = paddingTop.width - windowWidth;
      elmnt.style.left = String(left) + 'px';
    }
  }

  function dragMouseDown(e) {
    const handle = document.getElementsByClassName('card-header')[index];
    if (handle.contains(e.target)) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  }

  if (document.getElementById(String(elmnt.id) + 'header')) {
    // if present, the header is where you move the DIV from:
    document.getElementById(String(elmnt.id) + 'header').onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
}
