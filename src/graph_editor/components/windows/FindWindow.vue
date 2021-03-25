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
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
import { mxCell, mxUtils } from '../../lib/jgraph/mxClient.js';
export default defineComponent({
  name: 'FindWindow',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const searchInput = ref<string>('');

    const allPagesInput = ref<boolean>(true);

    function close() {
      show.value = false;
    }

    function openFindWindow() {
      show.value = true;
    }

    function testMeta(re: any, cell: any, search: string) {
      if (typeof cell.value === 'object' && cell.value.attributes != null) {
        const attrs = cell.value.attributes;

        for (let i = 0; i < attrs.length; i++) {
          if (attrs[i].nodeName != 'label') {
            const value = mxUtils
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

    function searchText(): any {
      //try {
      let { graph } = props.editorUi.editor;
      let lastFound = null;
      let allChecked = false;
      const tmp = document.createElement('div');
      const cells = graph.model.getDescendants(graph.model.getRoot());
      const searchStr = searchInput.value.toLowerCase();
      //const re = regexInput.checked ? new RegExp(searchStr) : null;
      const re = new RegExp(searchStr);
      let firstMatch = null;

      let active = lastFound == null;
      if (searchStr.length > 0) {
        if (allChecked) {
          allChecked = false;

          //Find current page index
          let currentPageIndex;

          for (let i = 0; i < props.editorUi.pages.length; i++) {
            if (props.editorUi.getCurrentPage() == props.editorUi.pages[i]) {
              currentPageIndex = i;
              break;
            }
          }

          let nextPageIndex = (currentPageIndex + 1) % props.editorUi.pages.length,
            nextPage;
          lastFound = null;

          do {
            allChecked = false;
            nextPage = props.editorUi.pages[nextPageIndex];
            graph = props.editorUi.createTemporaryGraph(graph.getStylesheet());
            props.editorUi.updatePageRoot(nextPage);
            graph.model.setRoot(nextPage.root);
            nextPageIndex = (nextPageIndex + 1) % props.editorUi.pages.length;
          } while (!searchText() && nextPageIndex != currentPageIndex);

          if (lastFound) {
            lastFound = null;
            props.editorUi.selectPage(nextPage);
          }

          allChecked = false;
          // eslint-disable-next-line prefer-destructuring
          graph = props.editorUi.editor.graph;

          return searchText();
        }

        let i;
        //console.log('len ', cells.length);
        for (i = 0; i < cells.length; i++) {
          const state = graph.view.getState(cells[i]);
          let label;
          if (
            state != null &&
            state.cell.value != null &&
            (active || firstMatch == null) &&
            (graph.model.isVertex(state.cell) || graph.model.isEdge(state.cell))
          ) {
            if (graph.isHtmlLabel(state.cell)) {
              tmp.innerHTML = graph.sanitizeHtml(graph.getLabel(state.cell));
              label = mxUtils.extractTextWithWhitespace([tmp]);
            } else {
              label = graph.getLabel(state.cell);
            }

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

          active = active || state == lastFound;
        }
      }

      if (firstMatch != null) {
        let i;
        if (i == cells.length && allPagesInput.value) {
          lastFound = null;
          allChecked = true;
          return searchText();
        }

        lastFound = firstMatch;
        graph.scrollCellToVisible(lastFound.cell);

        if (graph.isEnabled()) {
          graph.setSelectionCell(lastFound.cell);
        } else {
          graph.highlightCell(lastFound.cell);
        }
      }
      //Check other pages
      // else if (!internalCall && allPagesInput.value) {
      else if (allPagesInput.value) {
        allChecked = true;
        return searchText();
      } else if (graph.isEnabled()) {
        graph.clearSelection();
      }

      return searchStr.length == 0 || firstMatch != null;
      // } catch {
      //   alert(123);
      // }
    }

    onMounted(() => {
      props.editorUi.addListener('openFindWindow', openFindWindow);

      setTimeout(() => {
        function dragElement(elmnt: any) {
          let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
          function dragMouseDown(e: any) {
            // eslint-disable-next-line prefer-destructuring
            const handle = document.getElementsByClassName('card-header')[0];
            if (handle.contains(e.target)) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
            }
          }

          function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
          }

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (document.getElementById(elmnt.id + 'header')) {
            // if present, the header is where you move the DIV from:
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
          } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
          }

          function elementDrag(e:any) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
          }
        }
        // eslint-disable-next-line prefer-destructuring
        const ele = document.getElementsByClassName('card')[0];
        dragElement(ele);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 500);
    });

    onUnmounted(() => {
      console.log('unmount');
    });

    watch(
      () => searchInput.value,
      (val) => {
        if (val !== '') {
          searchText();
        }
      },
    );

    return {
      close,
      searchText,
      show,
      searchInput,
    };
  },
});
</script>

<template lang="pug">
.find-window(v-show='show')
  b-card.mb-2(tag='article', style='max-width: 20rem')
    template.row(#header='')
      h6.mb-0.col-sm-11 Find
      span.float-right.col.sm-1(@click='close') X
    .card-body
      .row
        input.txt-input(type='text', v-model='searchInput')
      .row.mt-2
        input(type='checkbox')
        label.ml-2 Regular Expression
      .row
        input(type='checkbox')
        label.ml-2 All Pages
    button.btn.btn-grey(@click='close') Reset
    button.btn.btn-primary(@click='') Apply
</template>

<style scoped>
.card-header {
  display: inline-flex;
}
.card {
  z-index: 1000;
}
.txt-input {
  border: 1px solid #ddd;
  padding: 5px 10px;

  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
