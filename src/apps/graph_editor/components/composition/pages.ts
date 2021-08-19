/**
 * ten9, Inc
 * Copyright (c) 2015 - 2021 ten9, Inc
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

import { mxResources, mxUtils } from '../../lib/jgraph/mxClient.js';
import { EditorUi } from '../../lib/jgraph/EditorUi.js';

export function usePageActions(editorUi: typeof EditorUi) {
  function insertPage() {
    editorUi.insertPage(
      null,
      (mxUtils.indexOf(editorUi.pages, editorUi.getCurrentPage()) as number) + 1,
    );
    // close();
  }

  function deletePage() {
    editorUi.removePage(editorUi.getCurrentPage());
    // close();
  }

  function renamePage() {
    editorUi.renamePage(
      editorUi.getCurrentPage(),
      editorUi.getCurrentPage().node.attributes.name.nodeValue,
    );
    // close();
  }

  function duplicatePage() {
    editorUi.duplicatePage(
      editorUi.getCurrentPage(),
      mxResources.get('copyOf', [editorUi.getCurrentPage().node.attributes.name.nodeValue]),
    );
    // close();
  }

  function selectPage(pageNumber: number) {
    editorUi.selectPage(editorUi.pages[pageNumber]);
  }

  function isCurrentPage(pageNumber: number) {
    return editorUi.getCurrentPage() == editorUi.pages[pageNumber];
  }

  return {
    deletePage,
    duplicatePage,
    insertPage,
    isCurrentPage,
    renamePage,
    selectPage,
  };
}
