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
const dragElement = require('./Drag.ts');

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

    function close() {
      show.value = false;
      lastFound.value = null;
      allChecked.value = true;
      searchInput.value = '';
      allPagesInput.value = false;
      regexInput.value = false;
      notFound.value = false;
    }

    function openFindWindow() {
      show.value = true;
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

    function searchText(internalCall: boolean): boolean {
      const tmp = document.createElement('div');
      const cells = graph.value.model.getDescendants(graph.value.model.getRoot());
      const searchStr = searchInput.value.toLowerCase();
      const re = regexInput.value ? new RegExp(searchStr) : null;
      let firstMatch = null;

      let active = lastFound.value == null;
      let i;
      if (searchStr.length > 0) {
        if (allChecked.value) {
          allChecked.value = false;

          //Find current page index
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
          } while (!searchText(true) && nextPageIndex != currentPageIndex);
          if (lastFound.value) {
            lastFound.value = null;
            props.editorUi.selectPage(nextPage);
          }

          allChecked.value = false;
          graph.value = props.editorUi.editor.graph;
          return searchText(true);
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
            if (
              (re == null &&
                (label.substring(0, searchStr.length) === searchStr ||
                  testMeta(re, state.cell, searchStr))) ||
              (re != null && (re.test(label) || testMeta(re, state.cell, searchStr)))
            ) {
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
          return searchText(true);
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
        return searchText(true);
      } else if (graph.value.isEnabled()) {
        graph.value.clearSelection();
        notFound.value = true;
      }

      return searchStr.length == 0 || firstMatch != null;
      // } catch {
      //   alert(123);
      // }
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

      const ele: unknown = document.getElementsByClassName('card');
      dragElement.default(ele[0], 0);
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
          searchText(false);
        }
      },
    );

    return {
      allChecked,
      allPagesDisable,
      allPagesInput,
      checkAllPages,
      close,
      disableAllPage,
      enableAllPage,
      graph,
      isRegularExpression,
      lastFound,
      notFound,
      regexInput,
      reset,
      searchText,
      show,
      searchInput,
    };
  },
});
</script>

<template lang="pug">
.find-window(v-show='show')
  b-card.mb-2.find(tag='article', style='max-width: 20rem')
    template.row(#header='')
      WindowHeader(title='Find', @close-window='close')
    .card-body.py-0
      input.txt-input-window(
        type='text',
        v-model='searchInput',
        :class='{ bgLightPink: notFound }'
      )
      .row.mt-2
        b-form-checkbox#checkbox-1(name='checkbox-1', @change='isRegularExpression')
          span.checkbox-text
            | Regular Expression
      .row
        b-form-checkbox#checkbox-2(
          name='checkbox-2',
          @change='checkAllPages',
          :disabled='allPagesDisable'
        )
          span.checkbox-text
            | All Pages
    template(#footer)
      .span.footer-buttons
        button.btn.btn-grey.ml-3(@click='reset') Reset
        button.btn.btn-primary.ml-2(@click='searchText(false)') Find
</template>
