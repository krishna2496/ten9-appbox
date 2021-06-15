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
function DiagramPage(node, id) {
  this.node = node;

  if (id != null) {
    this.node.setAttribute('id', id);
  } else if (this.getId() == null) {
    this.node.setAttribute('id', Editor.guid());
  }
}

/**
 * Holds the diagram node for the page.
 */
DiagramPage.prototype.node = null;

/**
 * Holds the root cell for the page.
 */
DiagramPage.prototype.root = null;

/**
 * Holds the view state for the page.
 */
DiagramPage.prototype.viewState = null;

/**
 *
 */
DiagramPage.prototype.getId = function () {
  return this.node.getAttribute('id');
};

/**
 *
 */
DiagramPage.prototype.getName = function () {
  return this.node.getAttribute('name');
};

/**
 *
 */
DiagramPage.prototype.setName = function (value) {
  if (value == null) {
    this.node.removeAttribute('name');
  } else {
    this.node.setAttribute('name', value);
  }
};

module.exports = {
  DiagramPage,
};
