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
import { defineComponent, nextTick, onMounted, onUnmounted, ref } from '@vue/composition-api';
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
  bringForward: boolean;
  sendBackward: boolean;
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

    const controlKey = ref<string>(Editor.ctrlKey);

    const left = ref<number>(0);

    const top = ref<number>(0);

    const { graph } = props.editorUi.editor;

    const enabledState = ref<EnabledState>(new EnabledState());

    function isEnabled(key: string) {
      return enabledState.value[key];
    }

    function updateState() {
      const cell = graph.getSelectionCell();
      const state = graph.view.getState(cell);
      const selectionCount = graph.getSelectionCount();
      const coordinates = graphUtils.getDocumentContainerRect();
      let hasWaypoints = false;

      left.value = graph.lastMouseX - coordinates.x;
      top.value = graph.lastMouseY - coordinates.y;

      isSelectionEmpty.value = selectionCount === 0;

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
      enabledState.value.bringForward = !isSelectionEmpty.value;
      enabledState.value.sendBackward = !isSelectionEmpty.value;

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
        mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) != 'arrow'
      ) {
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

        // Adds reset waypoints option if waypoints exist
        const geo = graph.getModel().getGeometry(cell);
        hasWaypoints = geo != null && geo.points != null && geo.points.length > 0;
      } else {
        enabledState.value.reverse = false;
        enabledState.value.addWaypoint = false;
        enabledState.value.removeWaypoint = false;
      }

      enabledState.value.clearWaypoints =
        selectionCount === 1 &&
        (hasWaypoints ||
          (graph.getModel().isVertex(cell) && graph.getModel().getEdgeCount(cell) > 0));

      enabledState.value.editStyle = selectionCount === 1;
      enabledState.value.editData = selectionCount === 1;
      enabledState.value.editLink = selectionCount === 1;

      enabledState.value.selectVertices = selectionCount === 0;
      enabledState.value.selectEdges = selectionCount === 0;
      enabledState.value.selectAll = selectionCount === 0;

      enabledState.value.editImage =
        selectionCount === 1 &&
        graph.getModel().isVertex(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) !== null;
    }

    function openPopupMenu() {
      show.value = true;
      nextTick(() => {
        updateState();
      });
    }

    function close() {
      show.value = false;
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
      close,
      controlKey,
      doAction,
      editImage,
      graph,
      hide,
      isEnabled,
      isSelectionEmpty,
      left,
      mxClient,
      openPopupMenu,
      show,
      showSubmenu,
      top,
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
    //- Popup Menu History Items
    b-list-group-item.none-border(@click='doAction("undo")', v-show='isEnabled("undo")')
      span.material-icons.menu-icons undo
      span.item-name Undo
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}Z
    b-list-group-item.none-border(@click='doAction("redo")', v-show='isEnabled("redo")')
      span.material-icons.menu-icons redo
      span.item-name Redo
      span.shortcut {{ controlKey }}+Shift+Z

    //- Popup Menu Edit Items
    b-list-group-item.none-border(@click='doAction("pasteHere")', v-show='isEnabled("pasteHere")')
      span.material-icons.menu-icons content_paste
      span.item-name Paste Here
    b-list-group-item.none-border(@click='doAction("delete")', v-show='isEnabled("delete")')
      span.item-name Delete
      span.shortcut Delete
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("cut")'
    )
    b-list-group-item.none-border(@click='doAction("cut")')
      span.material-icons.menu-icons content_cut
      span.item-name Cut
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}X
    b-list-group-item.none-border(@click='doAction("copy")')
      span.material-icons.menu-icons content_copy
      span.item-name Copy
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}C
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("duplicate")'
    )
    b-list-group-item.none-border(@click='doAction("duplicate")')
      span.item-name Duplicate
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}D

    //- Popup Menu Style Items
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("setAsDefaultStyle")'
    )
    b-list-group-item.none-border(
      @click='doAction("setAsDefaultStyle")',
      v-show='isEnabled("setAsDefaultStyle")'
    )
      span.item-name Set as Default Style
      span.shortcut {{ controlKey }}+Shift+D
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("clearDefaultStyle")'
    )
    b-list-group-item.none-border(
      @click='doAction("clearDefaultStyle")',
      v-show='isEnabled("clearDefaultStyle")'
    )
      span.item-name Clear Default Style
      span.shortcut {{ controlKey }}+Shift+R

    //- Popup Menu Arrange Items
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("toFront")'
    )
    b-list-group-item.none-border(@click='doAction("toFront")', v-show='isEnabled("toFront")')
      span.item-name To Front
      span.shortcut {{ controlKey }}+Shift+F
    b-list-group-item.none-border(@click='doAction("toBack")', v-show='isEnabled("toBack")')
      span.item-name To Back
      span.shortcut {{ controlKey }}+Shift+B
    b-list-group-item.none-border(
      @click='doAction("bringForward")',
      v-show='isEnabled("bringForward")'
    )
      span.item-name Bring Forward
    b-list-group-item.none-border(
      @click='doAction("sendBackward")',
      v-show='isEnabled("sendBackward")'
    )
      span.item-name Send Backward
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("group") || isEnabled("ungroup")'
    )
    b-list-group-item.none-border(@click='doAction("group")', v-show='isEnabled("group")')
      span.item-name Group
      span.shortcut {{ controlKey }}+G
    b-list-group-item(@click='doAction("ungroup")', v-show='isEnabled("ungroup")')
      span.item-name Ungroup
      span.shortcut {{ controlKey }}+Shift+G

    //- Popup Menu Cell Items
    //- hr.popup-dropdown-divider(
    //-   role='separator',
    //-   aria-orientation='horizontal',
    //-   v-show='isEnabled("line")'
    //- )
    //- b-dropdown#line-dropright.sub-menu(
    //-   dropright='',
    //-   text='Line',
    //-   block,
    //-   @mouseover.native='showSubmenu("line-dropright")',
    //-   @mouseleave.native='hide("line-dropright")',
    //-   v-show='isEnabled("line")'
    //- )
    //- TODO: check these
      b-dropdown-item(href='#', @click='doAction("insertRectangle")')
        span.material-icons open_in_full
      b-dropdown-item(href='#', @click='doAction("insertEllipse")')
        .geIcon.geSprite.geSprite-orthogonal
      b-dropdown-item(href='#', @click='doAction("insertRhombus")')
        .geIcon.geSprite.geSprite-horizontalelbow
      b-dropdown-item(href='#', @click='doAction("insertText")')
        .geIcon.geSprite.geSprite-verticalelbow
      b-dropdown-item(href='#', @click='doAction("link")')
        .geIcon.geSprite.geSprite-horizontalisometric
      b-dropdown-item(href='#', @click='doAction("image")')
        .geIcon.geSprite.geSprite-verticalisometric
      b-dropdown-item(href='#', @click='doAction("image")')
        .geIcon.geSprite.geSprite-curved
      b-dropdown-item(href='#', @click='doAction("image")')
        .geIcon.geSprite.geSprite-entity
      b-dropdown-item(href='#', @click='doAction("insertRectangle")')
        span.material-icons east
      b-dropdown-item(href='#', @click='doAction("insertRectangle")')
        .geIcon.geSprite.geSprite-linkedge
      b-dropdown-item(href='#', @click='doAction("insertRectangle")')
        .geIcon.geSprite.geSprite-arrow
      b-dropdown-item(href='#', @click='doAction("insertRectangle")')
        .geIcon.geSprite.geSprite-simplearrow
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("reverse")'
    )
    b-list-group-item.none-border(@click='doAction("turn")', v-show='isEnabled("reverse")')
      span.item-name Reverse
      span.shortcut {{ controlKey }}+R
    b-list-group-item.none-border(
      @click='doAction("addWaypoint")',
      v-show='isEnabled("addWaypoint")'
    )
      span.item-name Add Waypoint
    b-list-group-item.none-border(
      @click='doAction("removeWaypoint")',
      v-show='isEnabled("removeWaypoint")'
    )
      span.item-name Remove Waypoint
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("clearWaypoints")'
    )
    b-list-group-item.none-border(
      @click='doAction("clearWaypoints")',
      v-show='isEnabled("clearWaypoints")'
    )
      span.item-name Clear Waypoints
      span.shortcut Alt+Shift+C
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("editStyle")'
    )
    b-list-group-item.none-border(@click='doAction("editStyle")', v-show='isEnabled("editStyle")')
      span.item-name Edit Style...
      span.shortcut {{ controlKey }}+E
    b-list-group-item.none-border(@click='doAction("editData")', v-show='isEnabled("editData")')
      span.item-name Edit Data...
      span.shortcut {{ controlKey }}+M
    b-list-group-item.none-border(@click='doAction("editLink")', v-show='isEnabled("editLink")')
      span.item-name Edit Link...
      span.shortcut Alt +Shift+L
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("editImage")'
    )
    b-list-group-item.none-border(@click='editImage', v-show='isEnabled("editImage")')
      span.item-name Edit Image...
    hr.popup-dropdown-divider(
      role='separator',
      aria-orientation='horizontal',
      v-show='isEnabled("selectVertices")'
    )
    b-list-group-item.none-border(
      @click='doAction("selectVertices")',
      v-show='isEnabled("selectVertices")'
    )
      span.item-name Select Vertices
      span.shortcut {{ controlKey }}+Shift+I
    b-list-group-item.none-border(
      @click='doAction("selectEdges")',
      v-show='isEnabled("selectEdges")'
    )
      span.item-name Select Edges
      span.shortcut {{ controlKey }}+Shift+E
    b-list-group-item.none-border(@click='doAction("selectAll")', v-show='isEnabled("selectAll")')
      span.item-name Select All
      span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}A
</template>
