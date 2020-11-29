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

(function()
{
	Sidebar.prototype.addCiscoPalette = function(cisco, dir)
	{
		for (var i = 0; i < cisco.length; i++)
		{
			this.setCurrentSearchEntryLibrary('cisco', 'cisco' + cisco[i]);
			this.addStencilPalette('cisco' + cisco[i], 'Cisco / ' + cisco[i],
				dir + '/cisco/' + cisco[i].toLowerCase().replace(/ /g, '_') + '.xml',
				';html=1;pointerEvents=1;dashed=0;fillColor=#036897;strokeColor=#ffffff;strokeWidth=2;verticalLabelPosition=bottom;verticalAlign=top;align=center;outlineConnect=0;',
				null, null, 1.6, null, null, 'cisco');
		}

		this.setCurrentSearchEntryLibrary();
	};

})();
