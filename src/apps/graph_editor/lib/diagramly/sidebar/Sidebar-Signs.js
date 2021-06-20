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

const { Sidebar } = require('../../jgraph/Sidebar.js');

(function () {
  Sidebar.prototype.addSignsPalette = function (signs, dir) {
    for (var i = 0; i < signs.length; i++) {
      this.setCurrentSearchEntryLibrary('signs', 'signs' + signs[i]);
      this.addStencilPalette(
        'signs' + signs[i],
        'Signs / ' + signs[i],
        dir + '/signs/' + signs[i].toLowerCase() + '.xml',
        ';html=1;pointerEvents=1;fillColor=#000000;strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
        null,
        null,
        null,
        null,
        null,
        'signs',
      );
    }

    this.setCurrentSearchEntryLibrary();
  };
})();
