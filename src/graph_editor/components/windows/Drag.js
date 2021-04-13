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
    // eslint-disable-next-line no-param-reassign
    e = e || window.event;
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
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      paddingTop.height >= elmnt.offsetTop - pos2 + paddingTop.y + windowHeight
    ) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    }

    if (
      paddingTop.x <= elmnt.offsetLeft - pos1 + paddingTop.x &&
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      paddingTop.width + paddingTop.x >= elmnt.offsetLeft - pos1 + paddingTop.x + windowWidth
    ) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }
    // else {
    //   elmnt.style.left = paddingTop.width - windowWidth + 'px';
    // }
  }

  function dragMouseDown(e) {
    // eslint-disable-next-line prefer-destructuring
    const handle = document.getElementsByClassName('card-header')[index];
    if (handle.contains(e.target)) {
      // eslint-disable-next-line no-param-reassign
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  }

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  if (document.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
}
