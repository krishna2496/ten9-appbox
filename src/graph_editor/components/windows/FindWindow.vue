<!--
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
-->

<script lang="ts">
import WindowHeader from './Header.vue';
import { mxUtils } from '../../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
// TODO: Figure out why we can't import here
const { dragElement, bringWindowToFront } = require('./utils.ts');
const { SelectPage } = require('../../lib/diagramly/Pages.js');

interface RegularExpression {
  test: FunctionStringCallback;
}

interface Node {
  nodeName: string;
  nodeValue: string;
}

interface CellAttribute {
  attributes: Array<Node>;
}

interface CellProperty {
  value: CellAttribute;
}

export default defineComponent({
  name: 'FindWindow',
  components: {
    WindowHeader,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const allChecked = ref<boolean>(false);

    const lastFound = ref(null);

    const show = ref<boolean>(false);

    const searchInput = ref<string>('');

    const allPagesInput = ref<boolean>(false);

    const allPagesDisable = ref<boolean>(true);

    const regexInput = ref<boolean>(false);

    const graph = ref(props.editorUi.editor.graph);

    const notFound = ref<boolean>(false);

    const isMin = ref<boolean>(false);

    const replaceInput = ref<string>('');

    const validated = ref<boolean>(true);

    const replaceAllBtn = ref<boolean>(true);

    const safeguard = ref<number>(0);

    const visibleReplaceCount = ref<boolean>(false);

    const lblMatch = ref<string>('');

    const lblMatchPos = ref<number>(0);

    function close() {
      show.value = false;
      lastFound.value = null;
      allChecked.value = true;
      searchInput.value = '';
      allPagesInput.value = false;
      regexInput.value = false;
      notFound.value = false;
      const hideFindWindowAction = props.editorUi.actions.get('hideFindWindows');
      hideFindWindowAction.funct();
    }

    function openFindWindow() {
      show.value = true;
      bringWindowToFront(1);
    }

    function testMeta(re: RegularExpression, cell: CellProperty, search: string) {
      if (typeof cell.value === 'object' && cell.value.attributes != null) {
        const attrs = cell.value.attributes;

        for (let i = 0; i < attrs.length; i++) {
          if (attrs[i].nodeName != 'label') {
            const value = mxUtils
              // This is an acceptable use of control chars in our regex
              // since we are looking to convert control chars to spaces for safety.
              // eslint-disable-next-line no-control-regex
              .trim(attrs[i].nodeValue.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' '))
              .toLowerCase();

            if (
              (re == null && value.substring(0, search.length) === search) ||
              (re != null && re.test(value))
            ) {
              return true;
            }
          }
        }
      }

      return false;
    }

    function searchText(internalCall: boolean, replaceAllCall: boolean): boolean {
      const tmp = document.createElement('div');
      const cells = graph.value.model.getDescendants(graph.value.model.getRoot());
      const searchStr = searchInput.value.toLowerCase();
      const re = regexInput.value ? new RegExp(searchStr) : null;
      let firstMatch = null;
      lblMatch.value = searchInput.value;
      lblMatchPos.value = lblMatch.value.length;

      let active = lastFound.value == null;
      let i;
      if (searchStr.length > 0) {
        if (allChecked.value) {
          allChecked.value = false;

          // Find current page index
          let currentPageIndex;

          for (let j = 0; j < props.editorUi.pages.length; j++) {
            if (props.editorUi.getCurrentPage() == props.editorUi.pages[j]) {
              currentPageIndex = j;
              break;
            }
          }

          let nextPageIndex = (currentPageIndex + 1) % props.editorUi.pages.length,
            nextPage;
          lastFound.value = null;

          do {
            allChecked.value = false;
            nextPage = props.editorUi.pages[nextPageIndex];
            graph.value = props.editorUi.createTemporaryGraph(graph.value.getStylesheet());
            props.editorUi.updatePageRoot(nextPage);
            graph.value.model.setRoot(nextPage.root);
            nextPageIndex = (nextPageIndex + 1) % props.editorUi.pages.length;
          } while (!searchText(true, false) && nextPageIndex != currentPageIndex);
          if (lastFound.value) {
            lastFound.value = null;
            props.editorUi.selectPage(nextPage);
          }

          allChecked.value = false;
          graph.value = props.editorUi.editor.graph;
          if (replaceAllCall) {
            return searchText(true, true);
          } else {
            return searchText(true, false);
          }
        }

        for (i = 0; i < cells.length; i++) {
          const state = graph.value.view.getState(cells[i]);
          let label;
          if (
            state != null &&
            state.cell.value != null &&
            (active || firstMatch == null) &&
            (graph.value.model.isVertex(state.cell) || graph.value.model.isEdge(state.cell))
          ) {
            if (graph.value.isHtmlLabel(state.cell)) {
              tmp.innerHTML = graph.value.sanitizeHtml(graph.value.getLabel(state.cell));
              label = mxUtils.extractTextWithWhitespace([tmp]);
            } else {
              label = graph.value.getLabel(state.cell);
            }

            // This is an acceptable use of control chars in our regex
            // since we are looking to convert control chars to spaces for safety.
            // eslint-disable-next-line no-control-regex
            label = mxUtils.trim(label.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' ')).toLowerCase();

            let lblPosShift = 0;

            if (re != null && state == lastFound) {
              label = label.substr(lblMatchPos);
              lblPosShift = lblMatchPos.value;
            }

            if (
              (re == null &&
                (label.substring(0, searchStr.length) === searchStr ||
                  testMeta(re, state.cell, searchStr))) ||
              (re != null && (re.test(label) || testMeta(re, state.cell, searchStr)))
            ) {
              if (re != null) {
                const result = label.match(re);
                lblMatch.value = result[0].toLowerCase();
                lblMatchPos.value = lblPosShift + parseInt(result.index) + lblMatch.value.length;
              } else {
                lblMatch.value = searchStr;
                lblMatchPos.value = lblMatch.value.length;
              }

              if (active) {
                firstMatch = state;

                break;
              } else if (firstMatch == null) {
                firstMatch = state;
              }
            }
          }

          active = active || state == lastFound.value;
        }
      }

      if (firstMatch != null) {
        if (i == cells.length && allPagesInput.value) {
          lastFound.value = null;
          allChecked.value = true;
          return searchText(true, false);
        }
        lastFound.value = firstMatch;
        graph.value.scrollCellToVisible(lastFound.value.cell);

        if (graph.value.isEnabled()) {
          graph.value.setSelectionCell(lastFound.value.cell);
          notFound.value = false;
        } else {
          graph.value.highlightCell(lastFound.value.cell);
        }
      }
      //Check other pages
      else if (!internalCall && allPagesInput.value) {
        allChecked.value = true;
        return searchText(true, false);
      } else if (graph.value.isEnabled()) {
        graph.value.clearSelection();
        if (!replaceAllCall) {
          notFound.value = true;
        }
      }

      return searchStr.length == 0 || firstMatch != null;
      // } catch {
      //   alert(123);
      // }
    }

    function replace(find = false) {
      try {
        if (lblMatch != null && lastFound.value != null && replaceInput.value) {
          const { cell } = lastFound.value,
            lbl = graph.value.getLabel(cell);

          graph.value.model.setValue(
            cell,
            props.editorUi.replaceInLabel(
              lbl,
              lblMatch.value,
              replaceInput.value,
              lblMatchPos.value - lblMatch.value.length,
              graph.value.getCurrentCellStyle(cell),
            ),
          );
          if (find) {
            searchText(false, false);
          } else {
            validated.value = true;
          }
        }
      } catch (e) {
        props.editorUi.handleError(e);
      }
    }

    function replaceAll() {
      if (replaceInput.value) {
        const currentPage = props.editorUi.getCurrentPage();
        const cells = props.editorUi.editor.graph.getSelectionCells();
        const thisGraph = props.editorUi.editor.graph;

        let marker = 1;
        thisGraph.rendering = false;

        graph.value.getModel().beginUpdate();
        try {
          const seen = {};
          const safeguardCount = 100;

          while (searchText(false, true) && safeguard.value < safeguardCount) {
            const { cell } = lastFound.value,
              lbl = graph.value.getLabel(cell);
            const oldSeen = seen[cell.id];

            if (
              oldSeen &&
              oldSeen.replAllMrk == marker &&
              oldSeen.replAllPos >= lblMatchPos.value
            ) {
              break;
            }

            seen[cell.id] = { replAllMrk: marker, replAllPos: lblMatchPos.value };

            graph.value.model.setValue(
              cell,
              props.editorUi.replaceInLabel(
                lbl,
                lblMatch.value,
                replaceInput.value,
                lblMatchPos.value - lblMatch.value.length,
                graph.value.getCurrentCellStyle(cell),
              ),
            );

            safeguard.value += 1;
          }

          if (currentPage != props.editorUi.getCurrentPage()) {
            props.editorUi.editor.graph.model.execute(new SelectPage(props.editorUi, currentPage));
          }

          //mxUtils.write(replAllNotif, mxResources.get('matchesRepl', [safeguard]));
        } catch (e) {
          props.editorUi.handleError(e);
        } finally {
          graph.value.getModel().endUpdate();
          props.editorUi.editor.graph.setSelectionCells(cells);
        }

        marker += 1;
      }
      visibleReplaceCount.value = true;
    }

    function enableAllPage() {
      allPagesDisable.value = false;
    }

    function disableAllPage() {
      allPagesDisable.value = true;
    }

    onMounted(() => {
      props.editorUi.addListener('openFindWindow', openFindWindow);
      props.editorUi.addListener('enableAllPage', enableAllPage);
      props.editorUi.addListener('disableAllPage', disableAllPage);
      props.editorUi.addListener('hideFind', close);

      const ele: unknown = document.getElementsByClassName('card');
      dragElement(ele[1], 1);
    });

    function checkAllPages() {
      allPagesInput.value = !allPagesInput.value;
    }

    function isRegularExpression() {
      regexInput.value = !regexInput.value;
    }

    function reset() {
      lastFound.value = null;
      allChecked.value = true;
      searchInput.value = '';
      notFound.value = false;
      replaceInput.value = '';
    }

    function changeMinStatus() {
      isMin.value = !isMin.value;
    }

    onUnmounted(() => {
      props.editorUi.removeListener(openFindWindow);
      props.editorUi.removeListener(enableAllPage);
      props.editorUi.removeListener(disableAllPage);
    });

    watch(
      () => searchInput.value,
      (val) => {
        if (val !== '') {
          searchText(false, false);
        }
        visibleReplaceCount.value = false;
        safeguard.value = 0;
      },
    );

    watch(
      () => replaceInput.value,
      (val) => {
        if (val !== '' && searchInput.value !== '') {
          validated.value = false;
          replaceAllBtn.value = false;
        } else {
          validated.value = true;
          replaceAllBtn.value = true;
        }
        visibleReplaceCount.value = false;
        safeguard.value = 0;
      },
    );

    return {
      allChecked,
      allPagesDisable,
      allPagesInput,
      changeMinStatus,
      checkAllPages,
      close,
      disableAllPage,
      enableAllPage,
      graph,
      isMin,
      isRegularExpression,
      lastFound,
      notFound,
      regexInput,
      replace,
      replaceAll,
      replaceAllBtn,
      replaceInput,
      reset,
      safeguard,
      searchInput,
      searchText,
      show,
      validated,
      visibleReplaceCount,
    };
  },
});
</script>

<template lang="pug">
.find-window(v-show='show')
  b-card.mb-2.find(
    tag='article',
    style='max-width: 20rem',
    no-body,
    :class='isMin ? "minimize" : ""'
  )
    template.row(#header='')
      window-header(
        title='Find/Replace',
        @close-window='close',
        :isMin='isMin',
        @change-min-status='changeMinStatus'
      )
    .card-body.py-0.mt-4.mb-2
      input.txt-input-window(
        type='text',
        v-model='searchInput',
        :class='{ bgLightPink: notFound }',
        placeholder='Find'
      )
      input.mt-2.txt-input-window(type='text', v-model='replaceInput', placeholder='Replace with')
      .row.mt-2.ml-1
        .col-md-6.pl-0
          button.btn-center.btn.btn-primary(@click='searchText(true, false)') Find
        .col-md-6.pl-0
          button.btn-center.btn.btn-primary(@click='replace("true")', :disabled='validated') Replace/Find
      .row.mt-2.ml-1
        .col-md-6.pl-0
          button.btn-center.btn.btn-primary(@click='replace', :disabled='validated') Replace
        .col-md-6.pl-0
          button.btn-center.btn.btn-primary(@click='replaceAll', :disabled='replaceAllBtn') Replace All
      .row.mt-2.ml-1
        .col-md-6.pl-0
          button.btn-center.btn.btn-grey(@click='reset') Reset
        .col-md-6.pl-0
          button.btn-center.btn.btn-grey(@click='close') Close
      .row.mt-2.ml-1
        b-form-checkbox#checkbox-1(name='checkbox-1', @change='isRegularExpression')
          span.checkbox-text
            | Regular Expression
      .row.ml-1
        b-form-checkbox#checkbox-2(
          name='checkbox-2',
          @change='checkAllPages',
          :disabled='allPagesDisable'
        )
          span.checkbox-text
            | All Pages
      .row
        label.ml-5.mt-3.font-weight-normal.mb-0(v-show='visibleReplaceCount') {{ safeguard }} {{ safeguard > 1 ? "matches" : "match" }} replaced
</template>
