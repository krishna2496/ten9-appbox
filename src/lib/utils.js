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

import { mxCodec, mxGraphModel, mxPoint, mxUtils } from '@/lib/jgraph/mxClient';

const MAX_REQUEST_SIZE = 10485760;

export var ExportXml = function(editorUi) {
  var graph = editorUi.editor.graph;
  var bounds = graph.getGraphBounds();
  var scale = graph.view.scale;
  var name = 'example.xml';
  var format = 'xml';
  var bg = graph.background;

  ExportXml.lastBorderValue = '';
  ExportXml.exportXmlFile(editorUi, name, format, bg, 1, 0, 100);
};

export var importXmlFile = function(editorUi, data) {
  var doc = mxUtils.parseXml(data);
  var model = new mxGraphModel();
  var codec = new mxCodec(doc);
  codec.decode(doc.documentElement, model);

  var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
  editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(children));

  // LATER: Why is hideDialog between begin-/endUpdate faster?
  editorUi.hideDialog();
};

ExportXml.exportXmlFile = function(editorUi, name, format, bg, s, b, dpi) {
  if (format == 'xml') {
    ExportXml.saveLocalFileXml(
      editorUi,
      mxUtils.getXml(editorUi.editor.getGraphXml()),
      name,
      format,
    );
  } else {
    alert('please select XML format');
  }
};

ExportXml.saveLocalFileXml = function(editorUi, data, fileName, format) {
  if (data.length < MAX_REQUEST_SIZE) {
    editorUi.hideDialog();

    var decodedString = data;

    var fileType = '.xml';

    var blob = new Blob([decodedString], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() {
      URL.revokeObjectURL(a.href);
    }, 1500);
  } else {
    mxUtils.alert(mxResources.get('drawingTooLarge'));
    mxUtils.popup(xml);
  }
};

export function getOffset(originElt, elt) {
  const originRect = originElt.getBoundingClientRect();
  const eltRect = elt.getBoundingClientRect();

  const offsetLeft = eltRect.left - originRect.left;
  const offsetTop = eltRect.top - originRect.top;

  return new mxPoint(offsetLeft, offsetTop);
}
