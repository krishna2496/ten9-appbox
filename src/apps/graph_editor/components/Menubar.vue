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
      b-nav-item-dropdown(text='File', html='<p class="m-0 text-color">File</p>')
        b-dropdown-item(@click='doAction("print")') Print
      b-nav-item-dropdown(text='Edit')
        b-dropdown-item(href='#', @click='doAction("undo")', :disabled='undo') Undo
          span.float-right.shortcut.f-12 {{ btnName }}+Z
        b-dropdown-item(href='#', @click='doAction("redo")', :disabled='redo') Redo
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+Z
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("cut")', :disabled='disable') Cut
          span.float-right.shortcut.f-12 {{ btnName }}+X
        b-dropdown-item(href='#', @click='doAction("copy")', :disabled='disable') Copy
          span.float-right.shortcut.f-12 {{ btnName }}+C
        b-dropdown-item(href='#', @click='doAction("paste")', :disabled='disable') Paste
          span.float-right.shortcut.f-12 {{ btnName }}+P
        b-dropdown-item(href='#', @click='doAction("delete")', :disabled='disable') Delete
          span.float-right.shortcut.f-12 Delete
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("duplicate")', :disabled='disable') Duplicate
          span.float-right.shortcut.f-12 {{ btnName }}+D
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("find")') Find...
          span.float-right.shortcut.f-12 {{ btnName }}+F
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editData")') Edit Data...
          span.float-right.shortcut.f-12 {{ btnName }}+M
        b-dropdown-item(href='#', @click='doAction("editTooltip")', :disabled='disable') Edit Tooltip...
          span.float-right.shortcut.f-12 Alt+Shift+T
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editStyle")', :disabled='disable') Edit Style...
          span.float-right.shortcut.f-12 {{ btnName }}+E
        b-dropdown-item(href='#', @click='doAction("edit")', :disabled='disable') Edit
          span.float-right.shortcut.f-12 F2/Enter
        b-dropdown-item(href='#', @click='doAction("editLink")', :disabled='disable') Edit link...
          span.float-right.shortcut.f-12 Alt+Shift+L
        b-dropdown-item(href='#', @click='doAction("openLink")', :disabled='disable') Open Link
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("selectVertices")') Select Vertices
          span.float-right.shortcut.f-12 Alt+Shift+I
        b-dropdown-item(href='#', @click='doAction("selectEdges")') Select Edges
          span.float-right.shortcut.f-12 Alt+Shift+E
        b-dropdown-item(href='#', @click='doAction("selectAll")') Select All
          span.float-right.shortcut.f-12 {{ btnName }}+A
        b-dropdown-item(href='#', @click='doAction("selectNone")') Select None
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+A
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("lockUnlock")', :disabled='disable') Lock/Unlock
      b-nav-item-dropdown(text='View')
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
        b-dropdown-item(href='#', @click='doAction("colors")') Colors
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.color')
        b-dropdown-item(href='#', @click='doAction("scratchpad")') Scratchpad
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.scratchpad')
        b-dropdown-item(href='#', @click='fireEvent("moreShapes")') Shapes...
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("pageView")') Page View
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.pageView')
        b-dropdown-item(href='#', @click='doAction("pageScale")') Page Scale...
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("scrollbars")') Scrollbars
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.scrollbars')
        b-dropdown-item(href='#', @click='') Tooltip
        b-dropdown-item(href='#', @click='doAction("ruler")') Ruler
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.ruler')
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("grid")') Grid
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.grid')
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+G
        b-dropdown-item(href='#', @click='doAction("guides")') Guides
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.guides')
        b-dropdown-item(href='#', @click='doAction("shadow")', :disabled='disable') Shadow
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("connectionArrows")') Connection Arrow
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.connectionArrow')
          span.float-right.shortcut.f-12 Alt+Shift+A
        b-dropdown-item(href='#', @click='doAction("connectionPoints")') Connection Points
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.connectionPoints')
          span.float-right.shortcut.f-12 Alt+Shift+P
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("resetView")') Reset View
          span.float-right.shortcut.f-12 Enter/Home
        b-dropdown-item(href='#', @click='doAction("zoomIn")') Zoom In
          span.float-right.shortcut.f-12 {{ btnName }}+(Numpad) / Alt+MouseWheel
        b-dropdown-item(href='#', @click='doAction("zoomOut")') Zoom Out
          span.float-right.shortcut.f-12 {{ btnName }}-(Numpad) / Alt+MouseWheel
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("fullscreen")') Fullscreen
      b-nav-item-dropdown(text='Arrange', @click='hide')
        b-dropdown-item(href='#', @click='doAction("toFront")', :disabled='disable') To Front
          span.float-right.shortcut.f-12 Alt+Shift+F
        b-dropdown-item(href='#', @click='doAction("toBack")', :disabled='disable') To Back
          span.float-right.shortcut.f-12 Alt+Shift+B
        b-dropdown-divider
        b-dropdown#direction-dropright.ml-5(
          dropright='',
          text='Direction',
          block,
          @mouseover.native='showSubmenu("direction-dropright")',
          @mouseleave.native='hide("direction-dropright")',
          :disabled='disable'
        )
          b-dropdown-item(href='#', @click='direction("horizontal")') Flip Horizonta;
          b-dropdown-item(href='#', @click='direction("vertical")') Flip Vertical
          b-dropdown-item(href='#', @click='doAction("rotation")') Rotate
        b-dropdown-item(href='#', @click='doAction("turn")', :disabled='disable') Rotate shape only by 90/ Reverse
          span.float-right.shortcut.f-12 {{ btnName }}+R
        b-dropdown-divider
        b-dropdown#align-dropright.ml-5(
          dropright='',
          text='Align',
          block,
          @mouseover.native='showSubmenu("align-dropright")',
          @mouseleave.native='hide("align-dropright")',
          :disabled='isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='align("left")') Left Align
          b-dropdown-item(href='#', @click='align("center")') Center
          b-dropdown-item(href='#', @click='align("right")') Right Align
          b-dropdown-item(href='#', @click='align("top")') Top Align
          b-dropdown-item(href='#', @click='align("middle")') Middle
          b-dropdown-item(href='#', @click='align("bottom")') Bottom Align
        b-dropdown#distribute-dropright.ml-5(
          dropright='',
          text='Distribute',
          block,
          @mouseover.native='showSubmenu("distribute-dropright")',
          @mouseleave.native='hide("distribute-dropright")',
          :disabled='isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='distribute("horizontal")') Horizontal
          b-dropdown-item(href='#', @click='distribute("vertical")') Vertical
        b-dropdown-divider
        b-dropdown#navigation-dropright.ml-5(
          dropright='',
          text='Navigation',
          block,
          @mouseover.native='showSubmenu("navigation-dropright")',
          @mouseleave.native='hide("navigation-dropright")',
          :disabled='disable'
        )
          b-dropdown-item(href='#', @click='doAction("home")') Home
          b-dropdown-item(href='#', @click='doAction("exitGroup")') Exit Group
          b-dropdown-item(href='#', @click='doAction("enterGroup")') Enter Group
          b-dropdown-item(href='#', @click='doAction("expand")') Expand
          b-dropdown-item(href='#', @click='doAction("collapse")') Collapse
          b-dropdown-item(href='#', @click='') Collapsable
        b-dropdown#insert-dropright.ml-5(
          dropright='',
          text='Insert',
          block,
          @mouseover.native='showSubmenu("insert-dropright")',
          @mouseleave.native='hide("insert-dropright")'
        )
          b-dropdown-item(href='#', @click='doAction("insertRectangle")') Rectangle
          b-dropdown-item(href='#', @click='doAction("insertEllipse")') Ellipse
          b-dropdown-item(href='#', @click='doAction("insertRhombus")') Rhombus
          b-dropdown-item(href='#', @click='doAction("insertText")') Text
          b-dropdown-item(href='#', @click='doAction("link")') Link...
          b-dropdown-item(href='#', @click='doAction("image")') Image...
        b-dropdown#layout-dropright.ml-5(
          dropright='',
          text='Layout',
          block,
          @mouseover.native='showSubmenu("layout-dropright")',
          @mouseleave.native='hide("layout-dropright")'
        )
          b-dropdown-item(href='#', @click='horizontalFlow("horizontal")') Horizontal Flow
          b-dropdown-item(href='#', @click='horizontalFlow("vertical")') Vertical Flow
          b-dropdown-item(href='#', @click='fireEvent("horizontalTree")') Horizontal Tree
          b-dropdown-item(href='#', @click='fireEvent("verticalTree")') Vertical Tree
          b-dropdown-item(href='#', @click='fireEvent("radialTree")') Radial Tree
          b-dropdown-item(href='#', @click='doAction("image")') Organic
          b-dropdown-item(href='#', @click='circle') Circle
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("group")', :disabled='disable') Group
          span.float-right.shortcut.f-12 {{ btnName }}+G
        b-dropdown-item(href='#', @click='doAction("ungroup")', :disabled='disable') Ungroup
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+U
        b-dropdown-item(href='#', @click='doAction("removeFromGroup")') Remove from Group
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("clearWaypoints")', :disabled='disable') Clear waypoints
          span.float-right.shortcut.f-12 Alt+Shift+C
        b-dropdown-item(href='#', @click='doAction("autosize")', :disabled='disable') Autosize
          span.float-right.shortcut.f-12 {{ btnName }}+Shift+Y
      b-nav-item-dropdown(text='Extra')
        b-dropdown-item(href='#', @click='doAction("copyConnect")') Copy on Connect
        b-dropdown-item(href='#', @click='doAction("collapseExpand")') Collapse/Expand
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editDiagram")') Edit Diagram...
</template>
