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
import {
  mxClient,
  mxEventObject,
  mxEventSource,
  mxPoint,
  mxResources,
  mxUtils,
} from '../../lib/jgraph/mxClient.js';
import { Editor } from '../../lib/jgraph/Editor.js';
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
import VClamp from 'vue-clamp';
const graphUtils = require('../../lib/jgraph/graph_utils.js');
interface CustomEvent {
  getProperty?(propName: string): mxPoint | mxPoint;
}

import '../../styles/popupmenu.scss';

export default defineComponent({
  name: 'PopupMenu',
  components: {
    VClamp,
  },
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

    function setPopupPosition() {
      const coordinates = graphUtils.getDocumentContainerRect();
      left.value = graph.lastMouseX - coordinates.x;
      top.value = graph.lastMouseY - coordinates.y;
    }

    function openPopupMenu() {
      setPopupPosition();
      if (graph.getSelectionCount() == 0) {
        visible.value = true;
      } else if (graph.getSelectionCount() == 1) {
        cellSelectedVisible.value = true;
      } else {
        cellSelectedVisible.value = true;
        isMultiplCellSelected.value = true;
      }
    }

    function openPagePopupMenu(_sender: typeof mxEventSource, event: CustomEvent) {
      const pointer = event.getProperty('pointer');
      const popupMenuHeight = 140;
      left.value = pointer.x;
      top.value = pointer.y - popupMenuHeight;
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
      const popupMenuHeight = 155;
      const pageMenuHeight = 40;
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

    function selectPage(pageNumber: number) {
      props.editorUi.selectPage(props.editorUi.pages[pageNumber]);
    }

    function isCurrentPage(pageNumber: number) {
      return props.editorUi.getCurrentPage() == props.editorUi.pages[pageNumber];
    }

    watch(
      () => cellSelectedVisible.value,
      (val) => {
        if (val) {
          pagePopupVisible.value = false;
          pageMenu.value = false;
          visible.value = false;
          props.editorUi.fireEvent(new mxEventObject('closedMenu'));
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
          props.editorUi.fireEvent(new mxEventObject('closedMenu'));
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
          props.editorUi.fireEvent(new mxEventObject('closedMenu'));
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
          visible.value = false;
          cellSelectedVisible.value = false;
          pagePopupVisible.value = false;
          props.editorUi.fireEvent(new mxEventObject('closedMenu'));
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
      isCurrentPage,
      isMultiplCellSelected,
      left,
      mxClient,
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
  b-list-group.w-22.position-absolute.cursor-pointer.tp-5(
    v-show='visible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(
      @click='doAction("undo")',
      v-show='editorUi.actions.get("undo").isEnabled()'
    )
      span.material-icons.menu-icons undo
      span.item-name Undo
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}Z
    b-list-group-item.none-border(
      @click='doAction("redo")',
      v-show='editorUi.actions.get("redo").isEnabled()'
    )
      span.material-icons.menu-icons redo
      span.item-name Redo
      span.shortcut {{ controlKey }}+Shift+Z
    b-list-group-item.none-border(@click='doAction("pasteHere")')
      span.material-icons.menu-icons content_paste
      span.item-name Paste Here
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
      span.item-name Clear Default Style
      span.shortcut {{ controlKey }}+Shift+R
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("selectVertices")')
      span.item-name Select Vertices
      span.shortcut {{ controlKey }}+Shift+I
    b-list-group-item.none-border(@click='doAction("selectEdges")')
      span.item-name Select Edges
      span.shortcut {{ controlKey }}+Shift+E
    b-list-group-item.none-border(@click='doAction("selectAll")')
      span.item-name Select All
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}A
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.material-icons.menu-icons content_cut
    //-   span.item-name Cut
    //-   span.shortcut {{ controlKey }}+X
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.material-icons.menu-icons content_copy
    //-   span.item-name Copy
    //-   span.shortcut {{ controlKey }}+C
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.material-icons.menu-icons content_paste
    //-   span.item-name Paste
    //-   span.shortcut {{ controlKey }}+V
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.material-icons.menu-icons undo
    //-   span.item-name Paste without formating
    //-   span.shortcut {{ controlKey }}+Shift+V
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.item-name Delete
    //- hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.item-name Background
    //- hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   i.material-icons.menu-icons.ten9-font.ten9-icon-insert-comment
    //-   span.item-name Comment
    //-   span.shortcut {{ controlKey }}+Alt+M
    //- hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    //- b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
    //-   span.item-name Guides
  b-list-group.w-22.position-absolute.cursor-pointer(
    v-show='cellSelectedVisible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(@click='doAction("delete")')
      span.material-icons.menu-icons delete
      span.item-name Delete
      span.shortcut Delete
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("cut")')
      span.material-icons.menu-icons content_cut
      span.item-name Cut
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}X
    b-list-group-item.none-border(@click='doAction("pasteHere")')
      span.material-icons.menu-icons content_copy
      span.item-name Copy
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}C
    b-list-group-item.none-border(@click='doAction("clearDefaultStyle")')
      span.item-name Copy as Image
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("duplicate")')
      span.item-name Duplicate
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}D
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(
      @click='doAction("setAsDefaultStyle")',
      v-show='!isMultiplCellSelected'
    )
      span.item-name Set as Default Style
      span.shortcut {{ controlKey }}+Shift+D
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("toFront")')
      span.item-name To Front
      span.shortcut {{ controlKey }}+Shift+F
    b-list-group-item.none-border(@click='doAction("toBack")')
      span.item-name To Back
      span.shortcut {{ controlKey }}+Shift+B
    b-list-group-item.none-border(@click='doAction("bringForward")')
      span.item-name Bring Forward
    b-list-group-item.none-border(@click='doAction("sendBackward")')
      span.item-name Send Backward
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='doAction("editStyle")', v-show='!isMultiplCellSelected')
      span.item-name Edit Style...
      span.shortcut {{ controlKey }}+E
    b-list-group-item.none-border(@click='doAction("editData")', v-show='!isMultiplCellSelected')
      span.item-name Edit Data...
      span.shortcut {{ controlKey }}+M
    b-list-group-item(@click='doAction("editLink")', v-show='!isMultiplCellSelected')
      span.item-name Edit Link...
      span.shortcut Alt +Shift+L
    b-list-group-item.none-border(@click='doAction("group")', v-show='isMultiplCellSelected')
      span.item-name Group
      span.shortcut {{ controlKey }}+G
    b-list-group-item(@click='doAction("ungroup")', v-show='isMultiplCellSelected')
      span.item-name Ungroup
      span.shortcut {{ controlKey }}+Shift+G
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='pagePopupVisible',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(@click='insertPage')
      span.item-name Insert
    b-list-group-item.none-border(@click='deletePage')
      span.item-name Delete
    b-list-group-item.none-border(@click='renamePage')
      span.item-name Rename
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='duplicatePage')
      span.item-name Duplicate
  b-list-group.w-15.position-absolute.cursor-pointer(
    v-show='pageMenu',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(
      v-for='(item, index) in pages',
      :key='index',
      @click='selectPage(index)'
    )
      span.material-icons.menu-icons(v-show='isCurrentPage(index)') done
      v-clamp.item-name(autoresize, :max-lines='1', :class='[isCurrentPage(index) ? "" : "pl-20"]') {{ item }}
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='insertPage')
      span.item-name Insert page
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='deletePage')
      v-clamp.item-name(autoresize, :max-lines='1') Remove {{ editorUi.getCurrentPage().getName() }}
    b-list-group-item.none-border(@click='renamePage')
      v-clamp.item-name(autoresize, :max-lines='1') Rename {{ editorUi.getCurrentPage().getName() }}
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='duplicatePage')
      v-clamp.item-name(autoresize, :max-lines='1') Duplicate {{ editorUi.getCurrentPage().getName() }}
</template>
