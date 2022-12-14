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

/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
// TEN9: Added imports
const { mxResources, mxUtils } = require('../jgraph/mxClient.js');
const { StorageFile } = require('./StorageFile.js');

StorageLibrary = function (ui, data, title) {
  StorageFile.call(this, ui, data, title);
};

//Extends mxEventSource
mxUtils.extend(StorageLibrary, StorageFile);

/**
 * A differentiator of the stored object type (file or lib)
 */
StorageLibrary.prototype.type = 'L';

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageLibrary.prototype.isAutosave = function () {
  return true;
};

/**
 * Overridden to avoid updating data with current file.
 */
StorageLibrary.prototype.saveAs = function (title, success, error) {
  this.saveFile(title, false, success, error);
};

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageLibrary.prototype.getHash = function () {
  return 'L' + encodeURIComponent(this.title);
};

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
StorageLibrary.prototype.getTitle = function () {
  return this.title == '.scratchpad' ? mxResources.get('scratchpad') : this.title;
};

/**
 * Overridden to avoid updating data with current file.
 */
StorageLibrary.prototype.isRenamable = function (title, success, error) {
  return this.title != '.scratchpad';
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
StorageLibrary.prototype.open = function () {
  // Do nothing - this should never be called
};

// TEN9: module export
module.exports = {
  StorageLibrary,
};
