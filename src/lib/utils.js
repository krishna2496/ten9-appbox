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

import {
  mxCodec,
  mxGraphModel,
  mxPoint,
  mxUtils 
} from '@/lib/jgraph/mxClient';

const MAX_REQUEST_SIZE = 10485760;

export function exportXml(editorUi)
{
	return mxUtils.getXml(editorUi.editor.getGraphXml());
};

export function importXmlFile(editorUi,data)
{
	var doc = mxUtils.parseXml(data);
	var model = new mxGraphModel();
	var codec = new mxCodec(doc);
	codec.decode(doc.documentElement, model);
	
	var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
	editorUi.editor.graph.importCells(children);
	//editorUi.editor.graph.setSelectionCells();//comment this line
}

export function getOffset(originElt, elt) {
  const originRect = originElt.getBoundingClientRect();
  const eltRect = elt.getBoundingClientRect();

  const offsetLeft = eltRect.left - originRect.left;
  const offsetTop = eltRect.top - originRect.top;

  return new mxPoint(offsetLeft, offsetTop);
}
