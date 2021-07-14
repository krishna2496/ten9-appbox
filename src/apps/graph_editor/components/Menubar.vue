/* eslint-disable prefer-destructuring */
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
  mxCircleLayout,
  mxConstants,
  mxHierarchicalLayout,
  mxEventObject,
} from '../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import '../styles/menubar.scss';
interface ListElementStyle {
  display: string;
}

interface ListElement extends Element {
  style?: ListElementStyle;
}

export default defineComponent({
  name: 'Menubar',
  props: {
    editorUi: {
      type: Object,
      required: false,
      default: null,
    },
    checkboxes: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const disable = ref<boolean>(true);

    const { graph } = props.editorUi.editor;

    const redo = ref<boolean>(true);

    const undo = ref<boolean>(true);

    const submenu = ref(null);

    const isMultipleCellSelected = ref<boolean>(true);

    const btnName = ref<string>('Ctrl');

    function doAction(action: string) {
      props.editorUi.actions.get(action).funct();
      redo.value = !props.editorUi.canRedo();
    }

    function showSubmenu(id: string) {
      // TODO: Figure out how we are able to show sub menu on mouse hover
      // eslint-disable-next-line prefer-destructuring
      const ele: ListElement = document.getElementById(id).children[1];
      ele.style.display = 'block';
    }

    function hide(id: string) {
      // TODO: Figure out how we are able to hide sub menu on mouse hover
      // eslint-disable-next-line prefer-destructuring
      const ele: ListElement = document.getElementById(id).children[1];
      ele.style.display = 'none';
    }

    function hideAll() {
      const submenus = [
        'layout-dropright',
        'insert-dropright',
        'direction-dropright',
        'navigation-dropright',
        'align-dropright',
        'distribute-dropright',
      ];
      for (let i = 0; i < submenus.length; i++) {
        // TODO: Figure out how we are able to hidea all sub menu on mouse hover
        // eslint-disable-next-line prefer-destructuring
        const ele: ListElement = document.getElementById(submenus[i]).children[1];
        ele.style.display = 'none';
      }
    }

    function horizontalFlow(flow: string) {
      let constant;
      if (flow == 'horizontal') {
        constant = mxConstants.DIRECTION_WEST;
      } else {
        constant = mxConstants.DIRECTION_NORTH;
      }
      const layout = new mxHierarchicalLayout(graph, constant);

      props.editorUi.executeLayout(() => {
        const selectionCells = graph.getSelectionCells();
        layout.execute(
          graph.getDefaultParent(),
          selectionCells.length == 0 ? null : selectionCells,
        );
      }, true);
    }

    function circle() {
      const layout = new mxCircleLayout(graph);

      props.editorUi.executeLayout(() => {
        let tmp = graph.getSelectionCell();

        if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
          tmp = graph.getDefaultParent();
        }

        layout.execute(tmp);

        if (graph.getModel().isVertex(tmp)) {
          graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
        }
      }, true);
    }

    function align(side: string) {
      if (side === 'left') {
        graph.alignCells(mxConstants.ALIGN_LEFT);
      } else if (side === 'center') {
        graph.alignCells(mxConstants.ALIGN_CENTER);
      } else if (side === 'right') {
        graph.alignCells(mxConstants.ALIGN_RIGHT);
      } else if (side === 'top') {
        graph.alignCells(mxConstants.ALIGN_TOP);
      } else if (side === 'middle') {
        graph.alignCells(mxConstants.ALIGN_MIDDLE);
      } else if (side === 'bottom') {
        graph.alignCells(mxConstants.ALIGN_BOTTOM);
      }
    }

    function distribute(side: string) {
      if (side === 'horizontal') {
        graph.distributeCells(true);
      } else {
        graph.distributeCells(false);
      }
    }

    function direction(flip: string) {
      if (flip === 'horizontal') {
        graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
      } else {
        graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
      }
    }

    function fireEvent(type: string) {
      props.editorUi.fireEvent(new mxEventObject(type));
    }

    onMounted(() => {
      hideAll();
      const isOSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      const isiOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);

      if (isOSX || isiOS) {
        btnName.value = 'Cmd';
      } else {
        btnName.value = 'Ctrl';
      }
    });

    watch(
      () => graph.getSelectionCount(),
      (val) => {
        if (val === 0) {
          disable.value = true;
          isMultipleCellSelected.value = true;
        } else if (val == 1) {
          disable.value = false;
          isMultipleCellSelected.value = true;
        } else if (val > 1) {
          disable.value = false;
          isMultipleCellSelected.value = false;
        }
      },
    );

    watch(
      () => props.editorUi.editor.undoManager.indexOfNextAdd,
      (val) => {
        if (val > 0) {
          undo.value = false;
        } else {
          undo.value = true;
        }
      },
    );

    return {
      align,
      btnName,
      circle,
      direction,
      disable,
      distribute,
      doAction,
      fireEvent,
      graph,
      hide,
      horizontalFlow,
      isMultipleCellSelected,
      redo,
      submenu,
      showSubmenu,
      undo,
    };
  },
});
</script>

<template lang="pug">
.menubar-container(v-if='editorUi')
  b-navbar.menubar(toggleable='lg', type='dark', variant='')
    b-navbar-nav.text-hover
      b-nav-item-dropdown.file.pl-35(text='File', html='<p class="m-0 text-color">File</p>')
        b-dropdown-item(@click='doAction("print")')
          span Print
      b-nav-item-dropdown.pl-35(text='Edit')
        b-dropdown-item(href='#', @click='doAction("undo")', :disabled='undo')
          span Undo
          span.float-right.shortcut.f-12 {{ btnName }}+Z
        b-dropdown-item(href='#', @click='doAction("redo")', :disabled='redo')
          span Redo
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+Z
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("cut")', :disabled='disable')
          span Cut
          span.float-right.shortcut.f-12 {{ btnName }}+X
        b-dropdown-item(href='#', @click='doAction("copy")', :disabled='disable')
          span Copy
          span.float-right.shortcut.f-12 {{ btnName }}+C
        b-dropdown-item(href='#', @click='doAction("paste")', :disabled='disable')
          span Paste
          span.float-right.shortcut.f-12 {{ btnName }}+P
        b-dropdown-item(href='#', @click='doAction("delete")', :disabled='disable')
          span Delete
          span.float-right.shortcut.f-12 Delete
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("duplicate")', :disabled='disable')
          span Duplicate
          span.float-right.shortcut.f-12 {{ btnName }}+D
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("find")')
          span Find...
          span.float-right.shortcut.f-12 {{ btnName }}+F
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editData")')
          span Edit Data...
          span.float-right.shortcut.f-12 {{ btnName }}+M
        b-dropdown-item(href='#', @click='doAction("editTooltip")', :disabled='disable')
          span Edit Tooltip...
          span.float-right.shortcut.f-12 Alt+Shift+T
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editStyle")', :disabled='disable')
          span Edit Style...
          span.float-right.shortcut.f-12 {{ btnName }}+E
        b-dropdown-item(href='#', @click='doAction("edit")', :disabled='disable')
          span Edit
          span.float-right.shortcut.f-12 F2/Enter
        b-dropdown-item(href='#', @click='doAction("editLink")', :disabled='disable')
          span Edit link...
          span.float-right.shortcut.f-12 Alt+Shift+L
        b-dropdown-item(href='#', @click='doAction("openLink")', :disabled='disable')
          span Open Link
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("selectVertices")')
          span Select Vertices
          span.float-right.shortcut.f-12 Alt+Shift+I
        b-dropdown-item(href='#', @click='doAction("selectEdges")')
          span Select Edges
          span.float-right.shortcut.f-12 Alt+Shift+E
        b-dropdown-item(href='#', @click='doAction("selectAll")')
          span Select All
          span.float-right.shortcut.f-12 {{ btnName }}+A
        b-dropdown-item(href='#', @click='doAction("selectNone")')
          span Select None
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+A
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("lockUnlock")', :disabled='disable')
          span Lock/Unlock
      b-nav-item-dropdown.large-dropdown.pl-35(text='View')
        b-dropdown-item(href='#', @click='doAction("formatPanel")')
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.formatPanel')
          span Format Panel
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+P
        b-dropdown-item(href='#', @click='doAction("outline")') Outline
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.outline')
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+O
        b-dropdown-item(href='#', @click='doAction("layers")') Layers
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.layers')
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+L
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("colors")')
          span Colors
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.color')
        b-dropdown-item(href='#', @click='doAction("scratchpad")')
          span Scratchpad
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.scratchpad')
        b-dropdown-item(href='#', @click='fireEvent("moreShapes")')
          span Shapes...
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("pageView")')
          span Page View
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.pageView')
        b-dropdown-item(href='#', @click='doAction("pageScale")')
          span Page Scale...
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("scrollbars")')
          span Scrollbars
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.scrollbars')
        b-dropdown-item(href='#', @click='')
          span Tooltip
        b-dropdown-item(href='#', @click='doAction("ruler")')
          span Ruler
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.ruler')
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("grid")')
          span Grid
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.grid')
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+G
        b-dropdown-item(href='#', @click='doAction("guides")')
          span Guides
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.guides')
        b-dropdown-item(href='#', @click='doAction("shadow")', :disabled='disable')
          span Shadow
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("connectionArrows")')
          span Connection Arrow
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.connectionArrow')
          span.float-right.shortcut.f-12 Alt+Shift+A
        b-dropdown-item(href='#', @click='doAction("connectionPoints")')
          span Connection Points
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.connectionPoints')
          span.float-right.shortcut.f-12 Alt+Shift+P
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("resetView")')
          span Reset View
          span.float-right.shortcut.f-12 Enter/Home
        b-dropdown-item(href='#', @click='doAction("zoomIn")')
          span Zoom In
          span.float-right.shortcut.f-12 {{ btnName }}+(Numpad) / Alt+MouseWheel
        b-dropdown-item(href='#', @click='doAction("zoomOut")')
          span Zoom Out
          span.float-right.shortcut.f-12 {{ btnName }}-(Numpad) / Alt+MouseWheel
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("fullscreen")')
          span Fullscreen
      b-nav-item-dropdown.large-dropdown.pl-35(text='Arrange', @click='hide')
        b-dropdown-item(href='#', @click='doAction("toFront")', :disabled='disable')
          span To Front
          span.float-right.shortcut.f-12 Alt+Shift+F
        b-dropdown-item(href='#', @click='doAction("toBack")', :disabled='disable')
          span To Back
          span.float-right.shortcut.f-12 Alt+Shift+B
        b-dropdown-divider
        b-dropdown#direction-dropright.ml-5.sub-menu(
          dropright='',
          text='Direction',
          block,
          @mouseover.native='showSubmenu("direction-dropright")',
          @mouseleave.native='hide("direction-dropright")',
          :disabled='disable'
        )
          b-dropdown-item(href='#', @click='direction("horizontal")')
            span Flip Horizonta
          b-dropdown-item(href='#', @click='direction("vertical")')
            span Flip Vertical
          b-dropdown-item(href='#', @click='doAction("rotation")')
            span Rotate
        b-dropdown-item(href='#', @click='doAction("turn")', :disabled='disable')
          span Rotate shape only by 90/ Reverse
          span.float-right.shortcut.f-12 {{ btnName }}+R
        b-dropdown-divider
        b-dropdown#align-dropright.ml-5.sub-menu(
          dropright='',
          text='Align',
          block,
          @mouseover.native='showSubmenu("align-dropright")',
          @mouseleave.native='hide("align-dropright")',
          :disabled='isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='align("left")')
            span Left Align
          b-dropdown-item(href='#', @click='align("center")')
            span Center
          b-dropdown-item(href='#', @click='align("right")')
            span Right Align
          b-dropdown-item(href='#', @click='align("top")')
            span Top Align
          b-dropdown-item(href='#', @click='align("middle")')
            span Middle
          b-dropdown-item(href='#', @click='align("bottom")')
            span Bottom Align
        b-dropdown#distribute-dropright.ml-5.sub-menu(
          dropright='',
          text='Distribute',
          block,
          @mouseover.native='showSubmenu("distribute-dropright")',
          @mouseleave.native='hide("distribute-dropright")',
          :disabled='isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='distribute("horizontal")')
            span Horizontal
          b-dropdown-item(href='#', @click='distribute("vertical")')
            span Vertical
        b-dropdown-divider
        b-dropdown#navigation-dropright.ml-5.sub-menu(
          dropright='',
          text='Navigation',
          block,
          @mouseover.native='showSubmenu("navigation-dropright")',
          @mouseleave.native='hide("navigation-dropright")',
          :disabled='disable'
        )
          b-dropdown-item(href='#', @click='doAction("home")')
            span Home
          b-dropdown-item(href='#', @click='doAction("exitGroup")')
            span Exit Group
          b-dropdown-item(href='#', @click='doAction("enterGroup")')
            span Enter Group
          b-dropdown-item(href='#', @click='doAction("expand")')
            span Expand
          b-dropdown-item(href='#', @click='doAction("collapse")')
            span Collapse
          b-dropdown-item(href='#', @click='')
            span Collapsable
        b-dropdown#insert-dropright.ml-5.sub-menu(
          dropright='',
          text='Insert',
          block,
          @mouseover.native='showSubmenu("insert-dropright")',
          @mouseleave.native='hide("insert-dropright")'
        )
          b-dropdown-item(href='#', @click='doAction("insertRectangle")')
            span Rectangle
          b-dropdown-item(href='#', @click='doAction("insertEllipse")')
            span Ellipse
          b-dropdown-item(href='#', @click='doAction("insertRhombus")')
            span Rhombus
          b-dropdown-item(href='#', @click='doAction("insertText")')
            span Text
          b-dropdown-item(href='#', @click='doAction("link")')
            span Link...
          b-dropdown-item(href='#', @click='doAction("image")')
            span Image...
        b-dropdown#layout-dropright.ml-5.sub-menu(
          dropright='',
          text='Layout',
          block,
          @mouseover.native='showSubmenu("layout-dropright")',
          @mouseleave.native='hide("layout-dropright")'
        )
          b-dropdown-item(href='#', @click='horizontalFlow("horizontal")')
            span Horizontal Flow
          b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
            span Vertical Flow
          b-dropdown-item(href='#', @click='fireEvent("horizontalTree")')
            span Horizontal Tree
          b-dropdown-item(href='#', @click='fireEvent("verticalTree")')
            span Vertical Tree
          b-dropdown-item(href='#', @click='fireEvent("radialTree")')
            span Radial Tree
          b-dropdown-item(href='#', @click='doAction("image")')
            span Organic
          b-dropdown-item(href='#', @click='circle')
            span Circle
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("group")', :disabled='disable')
          span Grpup
          span.float-right.shortcut.f-12 {{ btnName }}+G
        b-dropdown-item(href='#', @click='doAction("ungroup")', :disabled='disable')
          span Ungroup
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+U
        b-dropdown-item(href='#', @click='doAction("removeFromGroup")')
          span Remove from Group
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("clearWaypoints")', :disabled='disable')
          span Clear waypoints
          span.float-right.shortcut.f-12 Alt+Shift+C
        b-dropdown-item(href='#', @click='doAction("autosize")', :disabled='disable')
          span Autosize
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+Y
      b-nav-item-dropdown.extra.pl-35(text='Extra')
        b-dropdown-item(href='#', @click='doAction("copyConnect")')
          span Copy on Connect
        b-dropdown-item(href='#', @click='doAction("collapseExpand")')
          span Collapse/Expand
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editDiagram")')
          span Edit Diagram...
</template>
