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
      copyOnConnect: false,
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
        //'navigation-dropright',
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
        //debugger;
        isSomethingSelected.value = val > 0;
        isMultipleCellSelected.value = val > 1;
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
      b-nav-item-dropdown#menu-padding(text='File')
        b-dropdown-item(@click='doAction("print")')
          i.fa-solid.fa-print.float-left.shortcut.f-12.py-0.pl-2
          span.lp-9 Print
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+P
      b-nav-item-dropdown#menu-padding(text='Edit')
        b-dropdown-item(
          href='#',
          @click='doAction("undo")',
          :disabled='!editorUi.actions.get("undo").isEnabled()'
        )
          i.fa-solid.fa-arrow-rotate-left.float-left.pl-2
          span.lp-9 Undo
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Z
        b-dropdown-item(
          href='#',
          @click='doAction("redo")',
          :disabled='!editorUi.actions.get("redo").isEnabled()'
        )
          i.fa-solid.fa-arrow-rotate-right.float-left.pl-2
          span.lp-9 Redo
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+Z
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("cut")', :disabled='!isSomethingSelected')
          i.fa-solid.fa-scissors.float-left.pl-2
          span.lp-9 Cut
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+X
        b-dropdown-item(href='#', @click='doAction("copy")', :disabled='!isSomethingSelected')
          i.fa-solid.fa-book-copy.float-left.pl-2
          span.pl-2 Copy
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+C
        b-dropdown-item(href='#', @click='doAction("paste")')
          i.fa-solid.fa-clipboard.float-left.pl-2
          span.pl-13 Paste
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+P
        b-dropdown-item(href='#', @click='doAction("delete")', :disabled='!isSomethingSelected')
          span.pl-5 Delete
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Delete
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("duplicate")', :disabled='!isSomethingSelected')
          span.pl-5 Duplicate
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+D
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("find")')
          span.pl-5 Find/Replace...
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+F
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editData")')
          span.pl-5 Edit Data...
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+M
        b-dropdown-item(
          href='#',
          @click='doAction("editTooltip")',
          :disabled='!isSomethingSelected'
        )
          span.pl-5 Edit Tooltip...
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+T
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("editStyle")', :disabled='!isSomethingSelected')
          span.pl-5 Edit Style...
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+E
        b-dropdown-item(href='#', @click='doAction("edit")', :disabled='!isSomethingSelected')
          span.pl-5 Edit
          span.float-right.shortcut.f-12.py-0.px-3.icon-color F2/Enter
        b-dropdown-item(href='#', @click='doAction("editLink")', :disabled='!isSomethingSelected')
          span.pl-5 Edit link...
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+L
        b-dropdown-item(href='#', @click='doAction("openLink")', :disabled='!isSomethingSelected')
          span.pl-5 Open Link
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("selectVertices")')
          span.pl-5 Select Vertices
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+I
        b-dropdown-item(href='#', @click='doAction("selectEdges")')
          span.pl-5 Select Edges
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+E
        b-dropdown-item(href='#', @click='doAction("selectAll")')
          span.pl-5 Select All
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+A
        b-dropdown-item(href='#', @click='doAction("selectNone")')
          span.pl-5 Select None
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+A
        b-dropdown-divider
        b-dropdown-item.pb-1(
          href='#',
          @click='doAction("lockUnlock")',
          :disabled='!isSomethingSelected'
        )
          span.pl-5 Lock/Unlock
      b-nav-item-dropdown#menu-padding.xl-large-dropdown.pl-35(text='View')
        b-dropdown-item(href='#', @click='doAction("formatPanel")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.formatPanel')
          span.pl-5 Format Panel
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+P
        b-dropdown-item(href='#', @click='doAction("outline")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.outline')
          span.pl-5 Outline
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+O
        b-dropdown-item(href='#', @click='doAction("layers")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.layers')
          span.pl-5 Layers
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+L
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("colors")')
          span.pl-5 Colors
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.color')
        b-dropdown-item(href='#', @click='doAction("scratchpad")')
          span.pl-5 Scratchpad
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.scratchpad')
        b-dropdown-item(href='#', @click='fireEvent("moreShapes")')
          span.pl-5 Shapes...
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("pageView")')
          span.pl-5 Page View
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.pageView')
        b-dropdown-item(href='#', @click='doAction("pageScale")')
          span.pl-5 Page Scale...
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("scrollbars")')
          span.pl-5 Scrollbars
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.scrollbars')
        b-dropdown-item(href='#', @click='')
          span.pl-5 Tooltip
        b-dropdown-item(href='#', @click='doAction("ruler")')
          span.pl-5 Ruler
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.ruler')
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("grid")')
          span.pl-5 Grid
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.grid')
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+G
        b-dropdown-item(href='#', @click='doAction("guides")')
          span.pl-5 Guides
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.guides')
        b-dropdown-item(href='#', @click='doAction("shadow")', :disabled='!isSomethingSelected')
          .pl-5 Shadow
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("connectionArrows")')
          span.pl-5 Connection Arrow
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(
            v-show='checkboxes.connectionArrow'
          )
          span.float-right.shortcut.f-12.py-0.px-3 Alt+Shift+A
        b-dropdown-item(href='#', @click='doAction("connectionPoints")')
          span.pl-5 Connection Points
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(
            v-show='checkboxes.connectionPoints'
          )
          span.float-right.shortcut.f-12.py-0.px-3 Alt+Shift+P
        b-dropdown-divider
        b-dropdown-item(href='#', @click='doAction("resetView")')
          span.pl-5 Reset View
          span.float-right.shortcut.f-12.py-0.px-3 Enter/Home
        b-dropdown-item(href='#', @click='doAction("zoomIn")')
          span.pl-5 Zoom In
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+(Numpad)
        b-dropdown-item(href='#', @click='doAction("zoomOut")')
          span.pl-5.pl-0 Zoom Out
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}-(Numpad)
        b-dropdown-divider
        b-dropdown-item.pb-1(href='#', @click='doAction("fullscreen")')
          span.pl-5 Fullscreen
      b-nav-item-dropdown#menu-padding.large-dropdown.pl-35(text='Arrange')
        b-dropdown-item(href='#', @click='doAction("toFront")', :disabled='!isSomethingSelected')
          span.pl-5 To Front
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+F
        b-dropdown-item(href='#', @click='doAction("toBack")', :disabled='!isSomethingSelected')
          span.pl-5 To Back
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+B
        b-dropdown-item(
          href='#',
          @click='doAction("bringForward")',
          :disabled='!isSomethingSelected'
        )
          span.pl-5.py-0 Bring Forward
        b-dropdown-item(
          href='#',
          @click='doAction("sendBackward")',
          :disabled='!isSomethingSelected'
        )
          span.pl-5.py-0 Send Backward
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
            span.pl-5 Flip Horizontal
          b-dropdown-item(href='#', @click='direction("vertical")')
            span.pl-5 Flip Vertical
          b-dropdown-divider
          b-dropdown-item(href='#', @click='fireEvent("openRotation")')
            span.pl-5 Rotation
        b-dropdown-item(href='#', @click='doAction("turn")', :disabled='!isSomethingSelected')
          span.pl-5 Rotate shape only by 90/ Reverse
          span.float-right.shortcut.f-12.px-3 {{ controlKey }}+R
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
            span.pl-5 Left Align
          b-dropdown-item(href='#', @click='align("center")')
            span.pl-5 Center
          b-dropdown-item(href='#', @click='align("right")')
            span.pl-5 Right Align
          b-dropdown-item(href='#', @click='align("top")')
            span.pl-5 Top Align
          b-dropdown-item(href='#', @click='align("middle")')
            span.pl-5 Middle
          b-dropdown-item(href='#', @click='align("bottom")')
            span.pl-5 Bottom Align
        b-dropdown#distribute-dropright.sub-menu(
          dropright='',
          text='Distribute',
          block,
          @mouseover.native='showSubmenu("distribute-dropright")',
          @mouseleave.native='hide("distribute-dropright")',
          :disabled='!isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='distribute("horizontal")')
            span.pl-5 Horizontal
          b-dropdown-item(href='#', @click='distribute("vertical")')
            span.pl-5 Vertical
        b-dropdown-divider
        //- b-dropdown#navigation-dropright.sub-menu(
        //-   dropright='',
        //-   text='Navigation',
        //-   block,
        //-   @mouseover.native='showSubmenu("navigation-dropright")',
        //-   @mouseleave.native='hide("navigation-dropright")',
        //-   :disabled='!isSomethingSelected'
        //- )
        //-   b-dropdown-item(href='#', @click='doAction("home")')
        //-     span.pl-5 Home
        //-   b-dropdown-item(href='#', @click='doAction("exitGroup")')
        //-     span.pl-5 Exit Group
        //-   b-dropdown-item(href='#', @click='doAction("enterGroup")')
        //-     span.pl-5 Enter Group
        //-   b-dropdown-item(href='#', @click='doAction("expand")')
        //-     span.pl-5 Expand
        //-   b-dropdown-item(href='#', @click='doAction("collapse")')
        //-     span.pl-5 Collapse
        //-   b-dropdown-item(href='#', @click='')
        //-     span.pl-5 Collapsable
        b-dropdown#insert-dropright.sub-menu(
          dropright='',
          text='Insert',
          block,
          @mouseover.native='showSubmenu("insert-dropright")',
          @mouseleave.native='hide("insert-dropright")'
        )
          b-dropdown-item(href='#', @click='doAction("insertRectangle")')
            span.pl-5 Rectangle
          b-dropdown-item(href='#', @click='doAction("insertEllipse")')
            span.pl-5 Ellipse
          b-dropdown-item(href='#', @click='doAction("insertRhombus")')
            span.pl-5 Rhombus
          b-dropdown-item(href='#', @click='doAction("insertText")')
            span.pl-5 Text
          b-dropdown-item(href='#', @click='doAction("link")')
            span.pl-5 Link...
          b-dropdown-item(href='#', @click='doAction("image")')
            span.pl-5 Image...
        b-dropdown#layout-dropright(
          dropright='',
          text='Layout',
          block,
          @mouseover.native='showSubmenu("layout-dropright")',
          @mouseleave.native='hide("layout-dropright")'
        )
          b-dropdown-item(href='#', @click='horizontalFlow("horizontal")')
            span.pl-5 Horizontal Flow
          b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
            span.pl-5 Vertical Flow
          b-dropdown-item(href='#', @click='fireEvent("horizontalTree")')
            span.pl-5 Horizontal Tree
          b-dropdown-item(href='#', @click='fireEvent("verticalTree")')
            span.pl-5 Vertical Tree
          b-dropdown-item(href='#', @click='fireEvent("radialTree")')
            span.pl-5 Radial Tree
          b-dropdown-item(href='#', @click='fireEvent("OrganicLayout")')
            span.pl-5 Organic
          b-dropdown-item(href='#', @click='circle')
            span.pl-5 Circle
        b-dropdown-divider
        b-dropdown-item(
          href='#',
          @click='doAction("group")',
          :disabled='!editorUi.actions.get("group").isEnabled()'
        )
          span.pl-5 Group
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+G
        b-dropdown-item(
          href='#',
          @click='doAction("ungroup")',
          :disabled='!editorUi.actions.get("ungroup").isEnabled()'
        )
          span.pl-5 Ungroup
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+U
        b-dropdown-item(
          href='#',
          @click='doAction("removeFromGroup")',
          :disabled='!editorUi.actions.get("removeFromGroup").isEnabled()'
        )
          span.pl-5 Remove from Group
        b-dropdown-divider
        b-dropdown-item(
          href='#',
          @click='doAction("clearWaypoints")',
          :disabled='!isSomethingSelected'
        )
          span.pl-5 Clear waypoints
          span.float-right.shortcut.f-12.icon-color.py-0.px-3 Alt+Shift+C
        b-dropdown-item.pb-1(
          href='#',
          @click='doAction("autosize")',
          :disabled='!isSomethingSelected'
        )
          span.pl-5 Autosize
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+Y
      b-nav-item-dropdown#menu-padding.extra.pl-35(text='Extras')
        b-dropdown-item(href='#', @click='doAction("copyConnect")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.copyOnConnect')
          span.pl-5 Copy on Connect
        b-dropdown-item(href='#', @click='doAction("collapseExpand")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(
            v-show='checkboxes.collapseExpand'
          )
          span.pl-5 Collapse/Expand
        b-dropdown-divider
        b-dropdown-item.pb-1(href='#', @click='doAction("editDiagram")')
          span.pl-5 Edit Diagram...
</template>

<style lang="scss">
@import '../styles/menubar.scss';
</style>
