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
  mxEventSource,
} from '../lib/jgraph/mxClient.js';
import { Editor } from '../lib/jgraph/Editor.js';
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api';

interface CustomEvent {
  getProperty?(propName: string): string | boolean;
}

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
  },
  setup(props) {
    const { graph } = props.editorUi.editor;

    const redoDisabled = ref<boolean>(true);

    const undoDisabled = ref<boolean>(true);

    const isSomethingSelected = ref<boolean>(false);

    const isMultipleCellSelected = ref<boolean>(false);

    const controlKey = ref<string>(Editor.ctrlKey);

    const isUngroupButtonVisible = ref<boolean>(false);

    const checkboxes = ref({
      formatPanel: true,
      outline: false,
      layers: false,
      color: false,
      scratchpad: true,
      pageView: true,
      scrollbars: true,
      tooltips: true,
      ruler: false,
      grid: true,
      guides: true,
      connectionArrow: true,
      connectionPoints: true,
      copyOnConnect: true,
      collapseExpand: true,
    });

    function doAction(action: string) {
      props.editorUi.actions.get(action).funct();
      redoDisabled.value = !props.editorUi.canRedo();
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
        // TODO: Figure out how we are able to hide all sub menu on mouse hover
        const [_, ele] = (document.getElementById(submenus[i])
          .children as unknown) as ListElement[];
        if (ele) {
          ele.style.display = 'none';
        }
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
      graph.distributeCells(side === 'horizontal');
    }

    function direction(flip: string) {
      graph.toggleCellStyles(
        flip === 'horizontal' ? mxConstants.STYLE_FLIPH : mxConstants.STYLE_FLIPV,
        false,
      );
    }

    function fireEvent(type: string) {
      props.editorUi.fireEvent(new mxEventObject(type));
    }

    function changeMenuStatus(_sender: typeof mxEventSource, event: CustomEvent) {
      const type = event.getProperty('type');
      const value = event.getProperty('value') as boolean;

      if (type === 'formatPanel') {
        checkboxes.value.formatPanel = value;
      } else if (type === 'outline') {
        checkboxes.value.outline = value;
      } else if (type === 'layers') {
        checkboxes.value.layers = value;
      } else if (type === 'color') {
        checkboxes.value.color = value;
      } else if (type === 'scratchpad') {
        checkboxes.value.scratchpad = value;
      } else if (type === 'pageView') {
        checkboxes.value.pageView = value;
      } else if (type === 'scrollbars') {
        checkboxes.value.scrollbars = value;
      } else if (type === 'tooltips') {
        checkboxes.value.tooltips = value;
      } else if (type === 'ruler') {
        checkboxes.value.ruler = value;
      } else if (type === 'grid') {
        checkboxes.value.grid = value;
      } else if (type === 'guides') {
        checkboxes.value.guides = value;
      } else if (type === 'connectionArrow') {
        checkboxes.value.connectionArrow = value;
      } else if (type === 'connectionPoints') {
        checkboxes.value.connectionPoints = value;
      } else if (type === 'collapseExpand') {
        checkboxes.value.collapseExpand = value;
      } else if (type === 'copyOnConnect') {
        checkboxes.value.copyOnConnect = value;
      }
    }

    onMounted(() => {
      hideAll();
      props.editorUi.addListener('changeMenuStatus', changeMenuStatus);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(changeMenuStatus);
    });

    watch(
      () => graph.getSelectionCount(),
      (val) => {
        isSomethingSelected.value = val > 0;
        isMultipleCellSelected.value = val > 1;

        if (val > 0) {
          const cells = graph.getSelectionCells();
          if (cells[0].style.includes('group')) {
            isUngroupButtonVisible.value = true;
          }
        } else {
          isUngroupButtonVisible.value = false;
        }
      },
    );

    watch(
      () => props.editorUi.editor.undoManager.indexOfNextAdd,
      (val) => {
        undoDisabled.value = val > 0;
      },
    );

    return {
      align,
      checkboxes,
      controlKey,
      circle,
      direction,
      distribute,
      doAction,
      fireEvent,
      graph,
      hide,
      horizontalFlow,
      isMultipleCellSelected,
      isSomethingSelected,
      isUngroupButtonVisible,
      redoDisabled,
      showSubmenu,
      undoDisabled,
    };
  },
});
</script>

<template lang="pug">
.menubar-container(v-if='editorUi')
  b-navbar.menubar(toggleable='lg', type='dark', variant='')
    b-navbar-nav.text-hover
      b-nav-item-dropdown.file.pl-35(text='File')
        b-dropdown-item(@click='doAction("print")')
          span Print
      b-nav-item-dropdown.pl-35(text='Edit')
        b-dropdown-item(href='#', @click='handleClick("undo")', :disabled='undoDisabled')
          span Undo
          span.float-right.shortcut.f-12 {{ controlKey }}+Z
        b-dropdown-item(href='#', @click='doAction("redo")', :disabled='redoDisabled')
          span Redo
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+Z
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("cut")', :disabled='!isSomethingSelected')
          span Cut
          span.float-right.shortcut.f-12 {{ controlKey }}+X
        b-dropdown-item(href='#', @click='doAction("copy")', :disabled='!isSomethingSelected')
          span Copy
          span.float-right.shortcut.f-12 {{ controlKey }}+C
        b-dropdown-item(href='#', @click='doAction("paste")', :disabled='!isSomethingSelected')
          span Paste
          span.float-right.shortcut.f-12 {{ controlKey }}+P
        b-dropdown-item(href='#', @click='doAction("delete")', :disabled='!isSomethingSelected')
          span Delete
          span.float-right.shortcut.f-12 Delete
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("duplicate")', :disabled='!isSomethingSelected')
          span Duplicate
          span.float-right.shortcut.f-12 {{ controlKey }}+D
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("find")')
          span Find/Replace...
          span.float-right.shortcut.f-12 {{ controlKey }}+F
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editData")')
          span Edit Data...
          span.float-right.shortcut.f-12 {{ controlKey }}+M
        b-dropdown-item(
          href='#',
          @click='doAction("editTooltip")',
          :disabled='!isSomethingSelected'
        )
          span Edit Tooltip...
          span.float-right.shortcut.f-12 Alt+Shift+T
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editStyle")', :disabled='!isSomethingSelected')
          span Edit Style...
          span.float-right.shortcut.f-12 {{ controlKey }}+E
        b-dropdown-item(href='#', @click='doAction("edit")', :disabled='!isSomethingSelected')
          span Edit
          span.float-right.shortcut.f-12 F2/Enter
        b-dropdown-item(href='#', @click='doAction("editLink")', :disabled='!isSomethingSelected')
          span Edit link...
          span.float-right.shortcut.f-12 Alt+Shift+L
        b-dropdown-item(href='#', @click='doAction("openLink")', :disabled='!isSomethingSelected')
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
          span.float-right.shortcut.f-12 {{ controlKey }}+A
        b-dropdown-item(href='#', @click='doAction("selectNone")')
          span Select None
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+A
        b-dropdown-divider
        b-dropdown-item(
          href='#',
          @click='doAction("lockUnlock")',
          :disabled='!isSomethingSelected'
        )
          span Lock/Unlock
      b-nav-item-dropdown.large-dropdown.pl-35(text='View')
        b-dropdown-item(href='#', @click='doAction("formatPanel")')
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.formatPanel')
          span Format Panel
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+P
        b-dropdown-item(href='#', @click='doAction("outline")') Outline
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.outline')
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+O
        b-dropdown-item(href='#', @click='doAction("layers")') Layers
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.layers')
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+L
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
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+G
        b-dropdown-item(href='#', @click='doAction("guides")')
          span Guides
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.guides')
        b-dropdown-item(href='#', @click='doAction("shadow")', :disabled='!isSomethingSelected')
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
          span.float-right.shortcut.f-12 {{ controlKey }}+(Numpad) / Alt+MouseWheel
        b-dropdown-item(href='#', @click='doAction("zoomOut")')
          span Zoom Out
          span.float-right.shortcut.f-12 {{ controlKey }}-(Numpad) / Alt+MouseWheel
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("fullscreen")')
          span Fullscreen
      b-nav-item-dropdown.large-dropdown.pl-35(text='Arrange')
        b-dropdown-item(href='#', @click='doAction("toFront")', :disabled='!isSomethingSelected')
          span To Front
          span.float-right.shortcut.f-12 Alt+Shift+F
        b-dropdown-item(href='#', @click='doAction("toBack")', :disabled='!isSomethingSelected')
          span To Back
          span.float-right.shortcut.f-12 Alt+Shift+B
        b-dropdown-item(
          href='#',
          @click='doAction("bringForward")',
          :disabled='!isSomethingSelected'
        )
          span Bring Forward
        b-dropdown-item(
          href='#',
          @click='doAction("sendBackward")',
          :disabled='!isSomethingSelected'
        )
          span Send Backward
        b-dropdown-divider
        b-dropdown#direction-dropright.sub-menu(
          dropright='',
          text='Direction',
          block,
          @mouseover.native='showSubmenu("direction-dropright")',
          @mouseleave.native='hide("direction-dropright")',
          :disabled='!isSomethingSelected'
        )
          b-dropdown-item(href='#', @click='direction("horizontal")')
            span Flip Horizontal
          b-dropdown-item(href='#', @click='direction("vertical")')
            span Flip Vertical
          b-dropdown-item(href='#', @click='fireEvent("openRotation")')
            span Rotate
        b-dropdown-item(href='#', @click='doAction("turn")', :disabled='!isSomethingSelected')
          span Rotate shape only by 90/ Reverse
          span.float-right.shortcut.f-12 {{ controlKey }}+R
        b-dropdown-divider
        b-dropdown#align-dropright.sub-menu(
          dropright='',
          text='Align',
          block,
          @mouseover.native='showSubmenu("align-dropright")',
          @mouseleave.native='hide("align-dropright")',
          :disabled='!isMultipleCellSelected'
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
          :disabled='!isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='distribute("horizontal")')
            span Horizontal
          b-dropdown-item(href='#', @click='distribute("vertical")')
            span Vertical
        b-dropdown-divider
        b-dropdown#navigation-dropright.sub-menu(
          dropright='',
          text='Navigation',
          block,
          @mouseover.native='showSubmenu("navigation-dropright")',
          @mouseleave.native='hide("navigation-dropright")',
          :disabled='!isSomethingSelected'
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
        b-dropdown#insert-dropright.sub-menu(
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
        b-dropdown#layout-dropright.sub-menu(
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
          b-dropdown-item(href='#', @click='fireEvent("OrganicLayout")')
            span Organic
          b-dropdown-item(href='#', @click='circle')
            span Circle
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("group")', :disabled='!isSomethingSelected')
          span Group
          span.float-right.shortcut.f-12 {{ controlKey }}+G
        b-dropdown-item(
          href='#',
          @click='doAction("ungroup")',
          :disabled='!isUngroupButtonVisible'
        )
          span Ungroup
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+U
        b-dropdown-item(href='#', @click='doAction("removeFromGroup")')
          span Remove from Group
        b-dropdown-divider
        b-dropdown-item(
          href='#',
          @click='doAction("clearWaypoints")',
          :disabled='!isSomethingSelected'
        )
          span Clear waypoints
          span.float-right.shortcut.f-12 Alt+Shift+C
        b-dropdown-item(href='#', @click='doAction("autosize")', :disabled='!isSomethingSelected')
          span Autosize
          span.float-right.shortcut.f-12 {{ controlKey }}+Shift+Y
      b-nav-item-dropdown.extra.pl-35(text='Extra')
        b-dropdown-item(href='#', @click='doAction("copyConnect")')
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.copyOnConnect')
          span Copy on Connect
        b-dropdown-item(href='#', @click='doAction("collapseExpand")')
          i.fa-solid.fa-check.float-left.pr-2.menu-checkbox(v-show='checkboxes.collapseExpand')
          span Collapse/Expand
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editDiagram")')
          span Edit Diagram...
</template>

<style lang="scss">
@import '../styles/menubar.scss';
</style>
