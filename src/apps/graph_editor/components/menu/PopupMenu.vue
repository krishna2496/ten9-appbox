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
  mxEdgeHandler,
  mxMouseEvent,
  mxClient,
  mxConstants,
  mxEventObject,
  mxUtils,
} from '../../lib/jgraph/mxClient.js';
import { Editor } from '../../lib/jgraph/Editor.js';
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
import VClamp from 'vue-clamp';
const graphUtils = require('../../lib/jgraph/graph_utils.js');

interface ListElementStyle {
  display: string;
}

interface ListElement extends Element {
  style?: ListElementStyle;
}

import '../../styles/popupmenu.scss';

class EnabledState {
  undo: boolean;
  redo: boolean;
  group: boolean;
  ungroup: boolean;
  pasteHere: boolean;
  delete: boolean;
  cut: boolean;
  copy: boolean;
  duplicate: boolean;
  setAsDefaultStyle: boolean;
  clearDefaultStyle: boolean;
  toFront: boolean;
  toBack: boolean;
  line: boolean;
  reverse: boolean;
  addWaypoint: boolean;
  removeWaypoint: boolean;
  clearWaypoints: boolean;
  editStyle: boolean;
  editData: boolean;
  editLink: boolean;
  editImage: boolean;
  selectVertices: boolean;
  selectEdges: boolean;
  selectAll: boolean;
}

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
    const isSelectionEmpty = ref<boolean>(true);

    const show = ref<boolean>(false);

    const cellSelectedVisible = ref<boolean>(false);

    const controlKey = ref<string>(Editor.ctrlKey);

    const left = ref<number>(0);

    const top = ref<number>(0);

    const isMultipleCellSelected = ref<boolean>(false);

    const { graph } = props.editorUi.editor;

    const enabledState = ref<EnabledState>(new EnabledState());

    function updateState() {
      const cell = graph.getSelectionCell();
      const state = graph.view.getState(cell);
      const selectionCount = graph.getSelectionCount();
      const coordinates = graphUtils.getDocumentContainerRect();

      left.value = graph.lastMouseX - coordinates.x;
      top.value = graph.lastMouseY - coordinates.y;

      isSelectionEmpty.value = selectionCount === 0;
      isMultipleCellSelected.value = selectionCount > 1;
      cellSelectedVisible.value = selectionCount > 0;

      enabledState.value.undo =
        isSelectionEmpty.value && props.editorUi.actions.get('undo').isEnabled();
      enabledState.value.redo =
        isSelectionEmpty.value && props.editorUi.actions.get('redo').isEnabled();
      enabledState.value.pasteHere = isSelectionEmpty.value;

      enabledState.value.delete = !isSelectionEmpty.value;
      enabledState.value.cut = !isSelectionEmpty.value;
      enabledState.value.copy = !isSelectionEmpty.value;
      enabledState.value.duplicate = !isSelectionEmpty.value;
      enabledState.value.setAsDefaultStyle = selectionCount === 1;
      enabledState.value.clearDefaultStyle = selectionCount !== 1 && isSelectionEmpty.value;
      enabledState.value.toFront = !isSelectionEmpty.value;
      enabledState.value.toBack = !isSelectionEmpty.value;

      enabledState.value.group = selectionCount > 1;
      enabledState.value.ungroup =
        selectionCount === 1 &&
        !graph.getModel().isEdge(cell) &&
        !graph.isSwimlane(cell) &&
        graph.getModel().getChildCount(cell) > 0;

      enabledState.value.line = selectionCount === 1 && graph.getModel().isEdge(cell);

      if (
        graph.getModel().isEdge(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_EDGE, null) != 'entityRelationEdgeStyle' &&
        mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) != 'arrow') {
        enabledState.value.reverse = true;

        let isWaypoint = false;
        const handler = graph.selectionCellsHandler.getHandler(cell);
        if (handler instanceof mxEdgeHandler && handler.bends != null && handler.bends.length > 2) {
          // TODO: set evt here
          const index = handler.getHandleForEvent(graph.updateMouseEvent(new mxMouseEvent(null)));

          // Configures removeWaypoint action before execution
          // Using trigger parameter is cleaner but have to find waypoint here anyway.
          const rmWaypointAction = props.editorUi.actions.get('removeWaypoint');
          rmWaypointAction.handler = handler;
          rmWaypointAction.index = index;

          isWaypoint = index > 0 && index < handler.bends.length - 1;
        }

        enabledState.value.addWaypoint = !isWaypoint;
        enabledState.value.removeWaypoint = isWaypoint;
      } else {
        enabledState.value.reverse = false;
        enabledState.value.addWaypoint = false;
        enabledState.value.removeWaypoint = false;
      }

<<<<<<< Updated upstream
      enabledState.value.reverse =
        graph.getModel().isEdge(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_EDGE, null) != 'entityRelationEdgeStyle' &&
        mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) != 'arrow';

      reverse: boolean;
      addWaypoint: boolean;
      removeWaypoint: boolean;
      clearWaypoints: boolean;
=======
      clearWaypoints: boolean;

      enabledState.value.editStyle = selectionCount === 1;
      enabledState.value.editdata = selectionCount === 1;
      enabledState.value.editStyle = selectionCount === 1;

>>>>>>> Stashed changes
      editStyle: boolean;
      editData: boolean;
      editLink: boolean;

      enabledState.value.editImage =
        selectionCount === 1 &&
        graph.getModel().isVertex(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) !== null;

      selectVertices: boolean;
      selectEdges: boolean;
      selectAll: boolean;
    }

    function openPopupMenu() {
      updateState();
    }

    function close() {
      isSelectionEmpty.value = true;
      cellSelectedVisible.value = false;
      isMultipleCellSelected.value = false;
    }

    onMounted(() => {
      props.editorUi.addListener('openPopupMenu', openPopupMenu);
      props.editorUi.addListener('closePopupMenu', close);
      props.editorUi.editor.graph.refresh();
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPopupMenu);
      props.editorUi.removeListener(close);
    });

    function doAction(action: string) {
      const Action = props.editorUi.actions.get(action);
      Action.funct();
      close();
    }

    function editImage() {
      const cell = graph.getSelectionCell();
      const imageUrl = mxUtils.getValue(cell.style, mxConstants.STYLE_IMAGE, null);
      props.editorUi.fireEvent(new mxEventObject('editImage', 'image', imageUrl));
    }

    function showSubmenu(id: string) {
      // TODO: Figure out how we are able to show sub menu on mouse hover
      const [_, ele] = (document.getElementById(id)?.children as unknown) as ListElement[];
      if (ele) {
        ele.style.display = 'block';
      }
    }

    function hide(id: string) {
      // TODO: Figure out how we are able to hide sub menu on mouse hover
      const [_, ele] = (document.getElementById(id)?.children as unknown) as ListElement[];
      if (ele) {
        ele.style.display = 'none';
      }
    }

    // watch(
    //   () => cellSelectedVisible.value,
    //   (val) => {
    //     console.log(graph.getSelectionCell().style);
    //     imageSelected.value = graph.getSelectionCell().style.includes('shape=image;');
    //     checkWayPoints();
    //     isLine.value = graph.getSelectionCell().style.includes('endArrow=');
    //     if (val) {
    //       nothingSelected.value = false;
    //       props.editorUi.fireEvent(new mxEventObject('closedMenu'));
    //     }
    //   },
    // );

    // watch(
    //   () => visible.value,
    //   (val) => {
    //     if (val) {
    //       cellSelectedVisible.value = false;
    //       props.editorUi.fireEvent(new mxEventObject('closedMenu'));
    //     }
    //   },
    // );

    return {
      cellSelectedVisible,
      close,
      controlKey,
      doAction,
      enabledState,
      graph,
      hide,
      isSelectionEmpty,
      isMultipleCellSelected,
      left,
      mxClient,
      openPopupMenu,
      show,
      showSubmenu,
      top,
      undoEnabled,
    };
  },
});
</script>

<template lang="pug">
div
  b-list-group.w-22.position-absolute.cursor-pointer.tp-5(
    v-show='show',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(@click='doAction("undo")', v-show='undoEnabled')
      span.material-icons.menu-icons undo
      span.item-name Undo
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}Z
    b-list-group-item.none-border(@click='doAction("redo")', v-show='redoEnabled')
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
  b-list-group.w-22.position-absolute.cursor-pointer(
    v-show='somethingSelected',
    v-bind:style='{ left: left + "px", top: top + "px" }'
  )
    b-list-group-item.none-border(@click='doAction("delete")')
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
      v-show='!isMultipleCellSelected'
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
    //- b-dropdown#line-dropright.sub-menu(
    //-   dropright='',
    //-   text='Line',
    //-   block,
    //-   @mouseover.native='showSubmenu("line-dropright")',
    //-   @mouseleave.native='hide("line-dropright")',
    //-   v-show='isLine'
    //- )
    //-   b-dropdown-item(href='#', @click='doAction("insertRectangle")')
    //-     span.material-icons open_in_full
    //-   b-dropdown-item(href='#', @click='doAction("insertEllipse")')
    //-     .geIcon.geSprite.geSprite-orthogonal
    //-   b-dropdown-item(href='#', @click='doAction("insertRhombus")')
    //-     .geIcon.geSprite.geSprite-horizontalelbow
    //-   b-dropdown-item(href='#', @click='doAction("insertText")')
    //-     .geIcon.geSprite.geSprite-verticalelbow
    //-   b-dropdown-item(href='#', @click='doAction("link")')
    //-     .geIcon.geSprite.geSprite-horizontalisometric
    //-   b-dropdown-item(href='#', @click='doAction("image")')
    //-     .geIcon.geSprite.geSprite-verticalisometric
    //-   b-dropdown-item(href='#', @click='doAction("image")')
    //-     .geIcon.geSprite.geSprite-curved
    //-   b-dropdown-item(href='#', @click='doAction("image")')
    //-     .geIcon.geSprite.geSprite-entity
    //-   b-dropdown-item(href='#', @click='doAction("insertRectangle")')
    //-     span.material-icons east
    //-   b-dropdown-item(href='#', @click='doAction("insertRectangle")')
    //-     .geIcon.geSprite.geSprite-linkedge
    //-   b-dropdown-item(href='#', @click='doAction("insertRectangle")')
    //-     .geIcon.geSprite.geSprite-arrow
    //-   b-dropdown-item(href='#', @click='doAction("insertRectangle")')
    //-     .geIcon.geSprite.geSprite-simplearrow
    //- hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal', v-show='isLine')
    b-list-group-item.none-border(@click='doAction("turn")', v-show='isLine')
      span.item-name Reverse
      span.shortcut {{ controlKey }}+R
    b-list-group-item.none-border(@click='doAction("addWaypoint")', v-show='isLine')
      span.item-name Add Waypoints
    b-list-group-item.none-border(@click='doAction("removeWaypoint")', v-show='isLine')
      span.item-name Remove Waypoints
    b-list-group-item.none-border(@click='doAction("clearWaypoints")', v-show='isLine')
      span.item-name Clear Waypoints
      span.shortcut Alt+Shift+C
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal', v-show='isLine')
    b-list-group-item.none-border(@click='doAction("editStyle")', v-show='!isMultipleCellSelected')
      span.item-name Edit Style...
      span.shortcut {{ controlKey }}+E
    b-list-group-item.none-border(@click='doAction("editData")', v-show='!isMultipleCellSelected')
      span.item-name Edit Data...
      span.shortcut {{ controlKey }}+M
    b-list-group-item.none-border(@click='doAction("editLink")', v-show='!isMultipleCellSelected')
      span.item-name Edit Link...
      span.shortcut Alt +Shift+L
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='imageSelected || editorUi.actions.get("group").isEnabled() || editorUi.actions.get("ungroup").isEnabled()'
    )
    b-list-group-item.none-border(@click='editImage', v-show='imageSelected')
      span.item-name Edit Image...
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='imageSelected && (editorUi.actions.get("group").isEnabled() || editorUi.actions.get("ungroup").isEnabled())'
    )
    b-list-group-item.none-border(@click='doAction("group")', v-show='groupEnabled')
      span.item-name Group
      span.shortcut {{ controlKey }}+G
    b-list-group-item(@click='doAction("ungroup")', v-show='ungroupEnabled')
      span.item-name Ungroup
      span.shortcut {{ controlKey }}+Shift+G
</template>
