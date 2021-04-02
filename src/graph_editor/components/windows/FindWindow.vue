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
import { mxUtils } from '../../lib/jgraph/mxClient.js';
export default defineComponent({
  name: 'FindWindow',
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

    const regexInput = ref<boolean>(false);

    const graph = ref(props.editorUi.editor.graph);

    const count = ref<number>(0);

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

    function searchText(internalCall: boolean): any {
      //debugger
      //try {
      //let { graph } = props.editorUi.editor;
      const tmp = document.createElement('div');
      const cells = graph.value.model.getDescendants(graph.value.model.getRoot());
      const searchStr = searchInput.value.toLowerCase();
      //console.log('reg',regexInput.value);
      const re = regexInput.value ? new RegExp(searchStr) : null;
      //let re: any = null;
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            count.value += 1;
          } while (!searchText(true) && nextPageIndex != currentPageIndex && count.value < 50);
          if (lastFound.value) {
            lastFound.value = null;
            props.editorUi.selectPage(nextPage);
          }

          allChecked.value = false;
          // eslint-disable-next-line prefer-destructuring
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

    onMounted(() => {
      props.editorUi.addListener('openFindWindow', openFindWindow);

      setTimeout(() => {
        function dragElement(elmnt: any) {
          let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

          function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
          }

          function elementDrag(e: any) {
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

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (document.getElementById(elmnt.id + 'header')) {
            // if present, the header is where you move the DIV from:
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
          } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
          }
        }
        // eslint-disable-next-line prefer-destructuring
        const ele = document.getElementsByClassName('card')[0];
        dragElement(ele);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 500);
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
      console.log('unmount');
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
      allPagesInput,
      checkAllPages,
      close,
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
  b-card.mb-2(tag='article', style='max-width: 20rem')
    template.row(#header='')
      h6.mb-1.col-sm-11 Find
      span.float-right.col.sm-1.close(@click='close') X
    .card-body
      .row
        input.txt-input(type='text', v-model='searchInput', :class='{ bgLightPink: notFound }')
      .row.mt-2
        input.mt-1(type='checkbox', @change='isRegularExpression')
        label.ml-2 Regular Expression
      .row
        input.mt-1(type='checkbox', @change='checkAllPages')
        label.ml-2 All Pages
    button.btn.btn-grey.ml-3(@click='reset') Reset
    button.btn.btn-primary.ml-3(@click='') Apply
</template>

<style scoped>
.card-header {
  display: inline-flex;
}
.card {
  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.txt-input {
  border: 1px solid #ddd;
  padding: 5px 10px;
}
.close {
  cursor: pointer;
}
.bgLightPink {
  background: lightpink;
}
</style>
