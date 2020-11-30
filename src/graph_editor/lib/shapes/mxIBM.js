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

const {
	mxCellRenderer,
	mxShape,
	mxStencilRegistry,
	mxUtils,
	} = require('../jgraph/mxClient.js');

/**
 * $Id: mxIBM.js,v 1.0 2018/08/21 13:05:39 mate Exp $
 * Copyright (c) 2006-2020, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Box
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIBMBox(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeIBMBox, mxShape);

mxShapeIBMBox.prototype.cst = {
		IBM_BOX : 'mxgraph.ibm.box'
};

mxShapeIBMBox.prototype.customProperties = [
	{name: 'prType', dispName: 'Box Type', defVal: 'cloud', type: 'enum',
		enumList: [{val: 'cloud', dispName: 'IBM Cloud'},
				   {val: 'vpc', dispName: 'VPC'},
				   {val: 'region', dispName: 'Region'},
				   {val: 'zone', dispName: 'Zone'},
				   {val: 'subnet', dispName: 'Subnet ACL'},
				   {val: 'public', dispName: 'Public Network'},
				   {val: 'enterprise', dispName: 'Enterprise Network'},
				   {val: 'classic', dispName: 'Classic Infrastructure'}]}
];

/**
* Function: paintVertexShape
*
* Paints the vertex shape.
*/
mxShapeIBMBox.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.rect(0,0, w, h);
	c.fillAndStroke();

	var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', 'none');
	c.setFillColor(strokeColor);
	c.setStrokeColor('none');

	var prType = mxUtils.getValue(this.state.style, 'prType', '');

	switch(prType)
	{
		case 'cloud':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.cloudtag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'vpc':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.vpctag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'region':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.regiontag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'zone':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.zonetag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'subnet':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.subnettag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'public':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.publictag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'enterprise':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.enterprisetag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		case 'classic':
			var bgSt1 = mxStencilRegistry.getStencil('mxgraph.ibm.classictag');
			bgSt1.drawShape(c, this, 0, 0, 25, 25);
			break;
		default:
			break;
	}
};

mxCellRenderer.registerShape(mxShapeIBMBox.prototype.cst.IBM_BOX, mxShapeIBMBox);
