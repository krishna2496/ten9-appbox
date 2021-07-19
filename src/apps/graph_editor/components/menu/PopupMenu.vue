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
import { mxEventSource, mxPoint, mxResources, mxUtils } from '../../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
const graphUtils = require('../../lib/jgraph/graph_utils.js');
interface CustomEvent {
  getProperty?(propName: string): mxPoint | mxPoint;
}

export default defineComponent({
  name: 'PopupMenu',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const visible = ref<boolean>(false);

    const cellSelectedVisible = ref<boolean>(false);

    const left = ref<number>(0);

    const top = ref<number>(0);

    const isMultiplCellSelected = ref<boolean>(false);

    const pagePopupVisible = ref<boolean>(false);

    const { graph } = props.editorUi.editor;

    const redoDisabled = ref<boolean>(true);

    const undoDisabled = ref<boolean>(true);

    const pageMenu = ref<boolean>(false);

    const pages = ref(['page-1']);

    function setPopupPosition(pagePopup: boolean) {
      const coordinates = graphUtils.getDocumentContainerRect();
      if (pagePopup) {
        const popupMenuHeight = 100;
        left.value = graph.lastEvent.clientX - coordinates.x;
        top.value = graph.lastEvent.clientY - coordinates.y - popupMenuHeight;
      } else {
        left.value = graph.lastMouseX - coordinates.x;
        top.value = graph.lastMouseY - coordinates.y;
      }
    }

    function openPopupMenu() {
      setPopupPosition(false);
      if (graph.getSelectionCount() == 0) {
        visible.value = true;
      } else if (graph.getSelectionCount() == 1) {
        cellSelectedVisible.value = true;
      } else {
        cellSelectedVisible.value = true;
        isMultiplCellSelected.value = true;
      }
    }

    function openPagePopupMenu() {
      setPopupPosition(true);
      pagePopupVisible.value = true;
    }

    function close() {
      visible.value = false;
      cellSelectedVisible.value = false;
      isMultiplCellSelected.value = false;
      pagePopupVisible.value = false;
      pageMenu.value = false;
    }

    function openPageMenuPopup(_sender: typeof mxEventSource, event: CustomEvent) {
      const pageCount = pages.value.length;
      const popupMenuHeight = 100;
      const pageMenuHeight = 30;
      const pagesMenuHeight = pageCount * pageMenuHeight;
      const pointer = event.getProperty('pointer');
      top.value = pointer.y - popupMenuHeight - pagesMenuHeight;
      left.value = pointer.x;
      pageMenu.value = true;
    }

    onMounted(() => {
      props.editorUi.addListener('openPopupMenu', openPopupMenu);
      props.editorUi.addListener('closePopupMenu', close);
      props.editorUi.addListener('openPagePopupMenu', openPagePopupMenu);
      props.editorUi.addListener('openPageMenuPopup', openPageMenuPopup);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPopupMenu);
      props.editorUi.removeListener(openPagePopupMenu);
      props.editorUi.removeListener(openPageMenuPopup);
      props.editorUi.removeListener(close);
    });

    function doAction(action: string) {
      const Action = props.editorUi.actions.get(action);
      Action.funct();
      close();
    }

    function insertPage() {
      props.editorUi.insertPage(
        null,
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        mxUtils.indexOf(props.editorUi.pages, props.editorUi.getCurrentPage()) + 1,
      );
      close();
    }

    function deletePage() {
      props.editorUi.removePage(props.editorUi.getCurrentPage());
      close();
    }

    function renamePage() {
      props.editorUi.renamePage(
        props.editorUi.getCurrentPage(),
        props.editorUi.getCurrentPage().node.attributes.name.nodeValue,
      );
      close();
    }

    function duplicatePage() {
      props.editorUi.duplicatePage(
        props.editorUi.getCurrentPage(),
        mxResources.get('copyOf', [props.editorUi.getCurrentPage().node.attributes.name.nodeValue]),
      );
      close();
    }

    function updatePages() {
      pages.value = [];
      for (let i = 0; i < props.editorUi.pages.length; i++) {
        pages.value.push(props.editorUi.pages[i].getName());
      }
    }

    function selectPage(pageNumner: number) {
      props.editorUi.selectPage(props.editorUi.pages[pageNumner]);
    }

    function isCurrentPgae(pageNumner: number) {
      return props.editorUi.getCurrentPage() == props.editorUi.pages[pageNumner];
    }

    watch(
      () => props.editorUi.editor.undoManager.indexOfNextAdd,
      (val) => {
        undoDisabled.value = val > 0;
      },
    );

    watch(
      () => cellSelectedVisible.value,
      (val) => {
        if (val) {
          pagePopupVisible.value = false;
          pageMenu.value = false;
          visible.value = false;
        }
      },
    );

    watch(
      () => pagePopupVisible.value,
      (val) => {
        if (val) {
          cellSelectedVisible.value = false;
          pageMenu.value = false;
          visible.value = false;
        }
      },
    );

    watch(
      () => visible.value,
      (val) => {
        if (val) {
          cellSelectedVisible.value = false;
          pageMenu.value = false;
          pagePopupVisible.value = false;
        }
      },
    );

    watch(
      () => props.editorUi.pages,
      () => {
        updatePages();
      },
    );

    return {
      cellSelectedVisible,
      close,
      deletePage,
      doAction,
      duplicatePage,
      graph,
      insertPage,
      isCurrentPgae,
      isMultiplCellSelected,
      left,
      openPageMenuPopup,
      openPagePopupMenu,
      openPopupMenu,
      pageMenu,
      pagePopupVisible,
      pages,
      renamePage,
      redoDisabled,
      setPopupPosition,
      selectPage,
      top,
      updatePages,
      undoDisabled,
      visible,
    };
  },
});
</script>

<template lang="pug">
div
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='visible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item(@click='doAction("undo")', v-show='!undoDisabled') Undo
      span.shortcuts Ctrl + Z
    b-list-group-item(@click='doAction("redo")', v-show='!redoDisabled') Redo
      span.shortcuts Ctrl + Shift + Z
    b-list-group-item(@click='doAction("pasteHere")') Paste Here
    b-list-group-item(@click='doAction("clearDefaultStyle")') Clear Default Style
      span.shortcuts Ctrl + Shift + R
    b-list-group-item(@click='doAction("selectVertices")') Select Vertices
      span.shortcuts Ctrl + Shift + I
    b-list-group-item(@click='doAction("selectEdges")') Select Edges
      span.shortcuts Ctrl + Shift + E
    b-list-group-item(@click='doAction("selectAll")') Select All
      span.shortcuts Ctrl + A
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='cellSelectedVisible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item(@click='doAction("delete")') Delete
      span.shortcuts Delete
    b-list-group-item(@click='doAction("cut")') Cut
      span.shortcuts Ctrl + X
    b-list-group-item(@click='doAction("pasteHere")') Copy
      span.shortcuts Ctrl + C
    b-list-group-item(@click='doAction("clearDefaultStyle")') Copy as Image
    b-list-group-item(@click='doAction("duplicate")') Duplicate
      span.shortcuts Ctrl + D
    b-list-group-item(@click='doAction("setAsDefaultStyle")', v-show='!isMultiplCellSelected') Set as Default Style
      span.shortcuts Ctrl + Shift + D
    b-list-group-item(@click='doAction("toFront")') To Fromt
      span.shortcuts Ctrl + Shift + F
    b-list-group-item(@click='doAction("toBack")') To Back
      span.shortcuts Ctrl + Shift + B
    b-list-group-item(@click='doAction("editStyle")', v-show='!isMultiplCellSelected') Edit Style...
      span.shortcuts Ctrl + E
    b-list-group-item(@click='doAction("editData")', v-show='!isMultiplCellSelected') Edit Data...
      span.shortcuts Ctrl + M
    b-list-group-item(@click='doAction("editLink")', v-show='!isMultiplCellSelected') Edit Link...
      span.shortcuts Alt + Shift + L
    b-list-group-item(@click='doAction("group")', v-show='isMultiplCellSelected') Group
      span.shortcuts Ctrl + G
    b-list-group-item(@click='doAction("ungroup")', v-show='isMultiplCellSelected') Ungroup
      span.shortcuts Ctrl + Shift + G
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='pagePopupVisible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item(@click='insertPage') Insert
    b-list-group-item(@click='deletePage') Delete
    b-list-group-item(@click='renamePage') Rename
    b-list-group-item(@click='duplicatePage') Duplicate
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='pageMenu',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item(v-for='(item, index) in pages', :key='index', @click='selectPage(index)')
      i.fa-solid.fa-check.float-left(v-show='isCurrentPgae(index)')
      span(:class='[isCurrentPgae(index) ? "pl-2" : "pl-20"]') {{ item }}
    b-list-group-item(@click='insertPage')
      span.pl-20 Insert
    b-list-group-item(@click='deletePage')
      span.pl-20 Delete
    b-list-group-item(@click='renamePage')
      span.pl-20 Rename
    b-list-group-item(@click='duplicatePage')
      span.pl-20 Duplicate
</template>

<style type="scss">
@import '../../styles/popupmenu.scss';
</style>
