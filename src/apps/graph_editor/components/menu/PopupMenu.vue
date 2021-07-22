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
import { Editor } from '../../lib/jgraph/Editor.js';
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

    const controlKey = ref<string>(Editor.ctrlKey);

    const left = ref<number>(0);

    const top = ref<number>(0);

    const isMultiplCellSelected = ref<boolean>(false);

    const pagePopupVisible = ref<boolean>(false);

    const { graph } = props.editorUi.editor;

    const pageMenu = ref<boolean>(false);

    const pages = ref(['Page-1']);

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
      const popupMenuHeight = 130;
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
      props.editorUi.editor.graph.refresh();
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

    function updatePages() {
      pages.value = [];
      for (let i = 0; i < props.editorUi.pages.length; i++) {
        pages.value.push(props.editorUi.pages[i].getName());
      }
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

    function selectPage(pageNumner: number) {
      props.editorUi.selectPage(props.editorUi.pages[pageNumner]);
    }

    function isCurrentPgae(pageNumner: number) {
      return props.editorUi.getCurrentPage() == props.editorUi.pages[pageNumner];
    }

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

    watch(
      () => pageMenu.value,
      (val) => {
        if (val) {
          updatePages();
        }
      },
    );

    return {
      cellSelectedVisible,
      close,
      controlKey,
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
      setPopupPosition,
      selectPage,
      top,
      updatePages,
      visible,
    };
  },
});
</script>

<template lang="pug">
div
  b-list-group.w-18.position-absolute.cursor-pointer(
    v-show='visible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(
      @click='doAction("undo")',
      v-show='editorUi.actions.get("undo").isEnabled()'
    ) Undo
      span.shortcuts {{ controlKey }}+ Z
    b-list-group-item.none-border(
      @click='doAction("redo")',
      v-show='editorUi.actions.get("redo").isEnabled()'
    ) Redo
      span.shortcuts {{ controlKey }}+Shift+Z
    b-list-group-item.none-border(@click='doAction("pasteHere")') Paste Here
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("clearDefaultStyle")') Clear Default Style
      span.shortcuts {{ controlKey }}+Shift+R
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("selectVertices")') Select Vertices
      span.shortcuts {{ controlKey }}+Shift+I
    b-list-group-item.none-border(@click='doAction("selectEdges")') Select Edges
      span.shortcuts {{ controlKey }}+Shift+E
    b-list-group-item.none-border(@click='doAction("selectAll")') Select All
      span.shortcuts {{ controlKey }}+ A
  b-list-group.w-18.position-absolute.cursor-pointer(
    v-show='cellSelectedVisible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(@click='doAction("delete")') Delete
      span.shortcuts Delete
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("cut")') Cut
      span.shortcuts {{ controlKey }}+ X
    b-list-group-item.none-border(@click='doAction("pasteHere")') Copy
      span.shortcuts {{ controlKey }}+ C
    b-list-group-item.none-border(@click='doAction("clearDefaultStyle")') Copy as Image
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("duplicate")') Duplicate
      span.shortcuts {{ controlKey }}+ D
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(
      @click='doAction("setAsDefaultStyle")',
      v-show='!isMultiplCellSelected'
    ) Set as Default Style
      span.shortcuts {{ controlKey }}+Shift+D
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("toFront")') To Front
      span.shortcuts {{ controlKey }}+Shift+F
    b-list-group-item.none-border(@click='doAction("toBack")') To Back
      span.shortcuts {{ controlKey }}+Shift+B
    b-list-group-item.none-border(@click='doAction("bringForward")') Bring Forward
    b-list-group-item.none-border(@click='doAction("sendBackward")') Send Backward
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("editStyle")', v-show='!isMultiplCellSelected') Edit Style...
      span.shortcuts {{ controlKey }}+E
    b-list-group-item.none-border(@click='doAction("editData")', v-show='!isMultiplCellSelected') Edit Data...
      span.shortcuts {{ controlKey }}+M
    b-list-group-item(@click='doAction("editLink")', v-show='!isMultiplCellSelected') Edit Link...
      span.shortcuts Alt +Shift+L
    b-list-group-item.none-border(@click='doAction("group")', v-show='isMultiplCellSelected') Group
      span.shortcuts {{ controlKey }}+G
    b-list-group-item(@click='doAction("ungroup")', v-show='isMultiplCellSelected') Ungroup
      span.shortcuts {{ controlKey }}+Shift+G
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='pagePopupVisible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(@click='insertPage') Insert
    b-list-group-item.none-border(@click='deletePage') Delete
    b-list-group-item.none-border(@click='renamePage') Rename
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='duplicatePage') Duplicate
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='pageMenu',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(
      v-for='(item, index) in pages',
      :key='index',
      @click='selectPage(index)'
    )
      i.fa-solid.fa-check.float-left.pt-1(v-show='isCurrentPgae(index)')
      span(:class='[isCurrentPgae(index) ? "pl-2" : "pl-20"]') {{ item }}
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='insertPage')
      span.pl-20 Insert Page
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='deletePage')
      span.pl-20 Remove {{ editorUi.getCurrentPage().getName() }}
    b-list-group-item.none-border(@click='renamePage')
      span.pl-20 Rename {{ editorUi.getCurrentPage().getName() }}
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='duplicatePage')
      span.pl-20 Duplicate {{ editorUi.getCurrentPage().getName() }}
</template>

<style type="scss">
@import '../../styles/popupmenu.scss';
</style>
