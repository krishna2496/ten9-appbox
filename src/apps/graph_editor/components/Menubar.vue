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

    function closedMenu() {
      const container = document.getElementById('container');
      container.click();
    }

    function disabledHover() {
      fireEvent('closePopupMenu');
      const div = document.getElementsByClassName('dropdown-item');
      for (let i = 0; i < div.length; i++) {
        const parent = div[i].parentElement;
        if (div[i].classList[1] === 'disabled') {
          parent.style.backgroundColor = 'white';
        } else {
          parent.style.backgroundColor = '';
        }
      }
    }

    onMounted(() => {
      hideAll();
      props.editorUi.addListener('changeMenuStatus', changeMenuStatus);
      props.editorUi.addListener('closedMenu', closedMenu);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(changeMenuStatus);
      props.editorUi.removeListener(closedMenu);
    });

    watch(
      () => graph.getSelectionCount(),
      (val) => {
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
      closedMenu,
      direction,
      disabledHover,
      distribute,
      doAction,
      fireEvent,
      graph,
      hide,
      horizontalFlow,
      isMultipleCellSelected,
      isSomethingSelected,
      mxClient,
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
      b-nav-item-dropdown#menu-padding(text='File', @show='disabledHover')
        b-dropdown-item(@click='doAction("print")')
          span.material-icons local_printshop
          span.pl-2 Print
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}P
      b-nav-item-dropdown#menu-padding(text='Edit', @show='disabledHover')
        b-dropdown-item(
          href='#',
          @click='doAction("undo")',
          :disabled='!editorUi.actions.get("undo").isEnabled()'
        )
          span.material-icons undo
          span.pl-2 Undo
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}Z
        b-dropdown-item(
          href='#',
          @click='doAction("redo")',
          :disabled='!editorUi.actions.get("redo").isEnabled()'
        )
          span.material-icons redo
          span.pl-2 Redo
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+Z
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("cut")', :disabled='!isSomethingSelected')
          span.material-icons content_cut
          span.pl-2 Cut
          span.float-right.shortcut.f-12.pt2-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}X
        b-dropdown-item(href='#', @click='doAction("copy")', :disabled='!isSomethingSelected')
          span.material-icons content_copy
          span.pl-2 Copy
          span.float-right.shortcut.f-12.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}C
        b-dropdown-item(href='#', @click='doAction("paste")')
          span.material-icons content_paste
          span.pl-2 Paste
          span.float-right.shortcut.f-12.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}V
        b-dropdown-item(href='#', @click='doAction("delete")', :disabled='!isSomethingSelected')
          span.material-icons delete
          span.pl-2 Delete
          span.float-right.shortcut.f-12.px-3.icon-color Delete
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("duplicate")', :disabled='!isSomethingSelected')
          span.pl-35 Duplicate
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}D
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("find")')
          span.pl-35 Find/Replace...
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}F
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("editData")')
          span.pl-35 Edit Data...
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}M
        b-dropdown-item(
          href='#',
          @click='doAction("editTooltip")',
          :disabled='!isSomethingSelected'
        )
          span.pl-35 Edit Tooltip...
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+T
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("editStyle")', :disabled='!isSomethingSelected')
          span.pl-35 Edit Style...
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}E
        b-dropdown-item(href='#', @click='doAction("edit")', :disabled='!isSomethingSelected')
          span.pl-35 Edit
          span.float-right.shortcut.f-12.py-0.px-3.icon-color F2/Enter
        b-dropdown-item(href='#', @click='doAction("editLink")', :disabled='!isSomethingSelected')
          span.pl-35 Edit link...
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+L
        b-dropdown-item(href='#', @click='doAction("openLink")', :disabled='!isSomethingSelected')
          span.pl-35 Open Link
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("selectVertices")')
          span.pl-35 Select Vertices
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+I
        b-dropdown-item(href='#', @click='doAction("selectEdges")')
          span.pl-35 Select Edges
          span.float-right.shortcut.f-12.py-0.px-3.icon-color Alt+Shift+E
        b-dropdown-item(href='#', @click='doAction("selectAll")')
          span.pl-35 Select All
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}A
        b-dropdown-item(href='#', @click='doAction("selectNone")')
          span.pl-35 Select None
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+A
        b-dropdown-divider.py-0
        b-dropdown-item.pb-1(
          href='#',
          @click='doAction("lockUnlock")',
          :disabled='!isSomethingSelected'
        )
          span.pl-35 Lock/Unlock
      b-nav-item-dropdown#menu-padding.xl-large-dropdown(text='View', @show='disabledHover')
        b-dropdown-item(href='#', @click='doAction("formatPanel")')
          span.material-icons(v-show='checkboxes.formatPanel') done
          span(:class='[checkboxes.formatPanel ? "pl-2" : "pl-35"]') Format Panel
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+P
        b-dropdown-item(href='#', @click='doAction("outline")')
          span.material-icons(v-show='checkboxes.outline') done
          span(:class='[checkboxes.outline ? "pl-2" : "pl-35"]') Outline
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+O
        b-dropdown-item(href='#', @click='doAction("layers")')
          span.material-icons(v-show='checkboxes.layers') done
          span(:class='[checkboxes.layers ? "pl-2" : "pl-35"]') Layers
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+L
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("colors")')
          span.material-icons(v-show='checkboxes.color') done
          span(:class='[checkboxes.color ? "pl-2" : "pl-35"]') Colors
        b-dropdown-item(href='#', @click='doAction("scratchpad")')
          span.material-icons(v-show='checkboxes.scratchpad') done
          span(:class='[checkboxes.scratchpad ? "pl-2" : "pl-35"]') Scratchpad
        b-dropdown-item(href='#', @click='fireEvent("moreShapes")')
          span.pl-35 Shapes...
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("pageView")')
          span.material-icons(v-show='checkboxes.pageView') done
          span(:class='[checkboxes.pageView ? "pl-2" : "pl-35"]') Page View
        b-dropdown-item(href='#', @click='doAction("pageScale")')
          span.pl-35 Page Scale...
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("scrollbars")')
          span.material-icons(v-show='checkboxes.scrollbars') done
          span(:class='[checkboxes.scrollbars ? "pl-2" : "pl-35"]') Scrollbars
        b-dropdown-item(href='#', @click='doAction("tooltips")')
          span.pl-35 Tooltip
        b-dropdown-item(href='#', @click='doAction("ruler")')
          span.material-icons(v-show='checkboxes.ruler') done
          span(:class='[checkboxes.ruler ? "pl-2" : "pl-35"]') Ruler
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("grid")')
          span.material-icons(v-show='checkboxes.grid') done
          span(:class='[checkboxes.grid ? "pl-2" : "pl-35"]') Grid
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+G
        b-dropdown-item(href='#', @click='doAction("guides")')
          span.material-icons(v-show='checkboxes.guides') done
          span(:class='[checkboxes.grid ? "pl-2" : "pl-35"]') Guides
        b-dropdown-item(href='#', @click='doAction("shadow")', :disabled='!isSomethingSelected')
          .pl-35 Shadow
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("connectionArrows")')
          span.material-icons(v-show='checkboxes.connectionArrow') done
          span(:class='[checkboxes.connectionArrow ? "pl-2" : "pl-35"]') Connection Arrow
          span.float-right.shortcut.f-12.py-0.px-3 Alt+Shift+A
        b-dropdown-item(href='#', @click='doAction("connectionPoints")')
          span.material-icons(v-show='checkboxes.connectionPoints') done
          span(:class='[checkboxes.connectionPoints ? "pl-2" : "pl-35"]') Connection Points
          span.float-right.shortcut.f-12.py-0.px-3 Alt+Shift+P
        b-dropdown-divider.py-0
        b-dropdown-item(href='#', @click='doAction("resetView")')
          span.pl-35 Reset View
          span.float-right.shortcut.f-12.py-0.px-3 Enter/Home
        b-dropdown-item(href='#', @click='doAction("zoomIn")')
          span.material-icons zoom_in
          span.pl-2 Zoom In
          span.float-right.shortcut.f-12.px-3 {{ controlKey }}+(Numpad)
        b-dropdown-item(href='#', @click='doAction("zoomOut")')
          span.material-icons zoom_out
          span.pl-2 Zoom Out
          span.float-right.shortcut.f-12.px-3 {{ controlKey }}-(Numpad)
        b-dropdown-divider.py-0
        b-dropdown-item.pb-1(href='#', @click='doAction("fullscreen")')
          span.pl-35 Fullscreen
      b-nav-item-dropdown#menu-padding.large-dropdown(text='Arrange', @show='disabledHover')
        b-dropdown-item(href='#', @click='doAction("toFront")', :disabled='!isSomethingSelected')
          span.material-icons flip_to_front
          span.pl-2 To Front
          span.float-right.shortcut.f-12.px-3.icon-color Alt+Shift+F
        b-dropdown-item(href='#', @click='doAction("toBack")', :disabled='!isSomethingSelected')
          span.material-icons flip_to_back
          span.pl-2 To Back
          span.float-right.shortcut.f-12.px-3.icon-color Alt+Shift+B
        b-dropdown-item(
          href='#',
          @click='doAction("bringForward")',
          :disabled='!isSomethingSelected'
        )
          span.pl-35.py-0 Bring Forward
        b-dropdown-item(
          href='#',
          @click='doAction("sendBackward")',
          :disabled='!isSomethingSelected'
        )
          span.pl-35.py-0 Send Backward
        b-dropdown-divider.py-0
        b-dropdown#direction-dropright.sub-menu(
          dropright='',
          text='Direction',
          block,
          @mouseover.native='showSubmenu("direction-dropright")',
          @mouseleave.native='hide("direction-dropright")',
          :disabled='!isSomethingSelected'
        )
          b-dropdown-item(href='#', @click='direction("horizontal")')
            span.pl-35 Flip Horizontal
          b-dropdown-item(href='#', @click='direction("vertical")')
            span.pl-35 Flip Vertical
          b-dropdown-divider.py-0
          b-dropdown-item(href='#', @click='fireEvent("openRotation")')
            span.pl-35 Rotation
        b-dropdown-item(href='#', @click='doAction("turn")', :disabled='!isSomethingSelected')
          span.material-icons rotate_right
          span.pl-2 Rotate shape only by 90/ Reverse
          span.float-right.shortcut.f-12.px-3 {{ controlKey }}+R
        b-dropdown-divider.py-0
        b-dropdown#align-dropright.sub-menu(
          dropright='',
          text='Align',
          block,
          @mouseover.native='showSubmenu("align-dropright")',
          @mouseleave.native='hide("align-dropright")',
          :disabled='!isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='align("left")')
            span.pl-35 Left Align
          b-dropdown-item(href='#', @click='align("center")')
            span.pl-35 Center
          b-dropdown-item(href='#', @click='align("right")')
            span.pl-35 Right Align
          b-dropdown-item(href='#', @click='align("top")')
            span.pl-35 Top Align
          b-dropdown-item(href='#', @click='align("middle")')
            span.pl-35 Middle
          b-dropdown-item(href='#', @click='align("bottom")')
            span.pl-35 Bottom Align
        b-dropdown#distribute-dropright.sub-menu(
          dropright='',
          text='Distribute',
          block,
          @mouseover.native='showSubmenu("distribute-dropright")',
          @mouseleave.native='hide("distribute-dropright")',
          :disabled='!isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='distribute("horizontal")')
            span.pl-35 Horizontal
          b-dropdown-item(href='#', @click='distribute("vertical")')
            span.pl-35 Vertical
        b-dropdown-divider.py-0
        //- b-dropdown#navigation-dropright.sub-menu(
        //-   dropright='',
        //-   text='Navigation',
        //-   block,
        //-   @mouseover.native='showSubmenu("navigation-dropright")',
        //-   @mouseleave.native='hide("navigation-dropright")',
        //-   :disabled='!isSomethingSelected'
        //- )
        //-   b-dropdown-item(href='#', @click='doAction("home")')
        //-     span.pl-35 Home
        //-   b-dropdown-item(href='#', @click='doAction("exitGroup")')
        //-     span.pl-35 Exit Group
        //-   b-dropdown-item(href='#', @click='doAction("enterGroup")')
        //-     span.pl-35 Enter Group
        //-   b-dropdown-item(href='#', @click='doAction("expand")')
        //-     span.pl-35 Expand
        //-   b-dropdown-item(href='#', @click='doAction("collapse")')
        //-     span.pl-35 Collapse
        //-   b-dropdown-item(href='#', @click='')
        //-     span.pl-35 Collapsable
        b-dropdown#insert-dropright.sub-menu(
          dropright='',
          text='Insert',
          block,
          @mouseover.native='showSubmenu("insert-dropright")',
          @mouseleave.native='hide("insert-dropright")'
        )
          b-dropdown-item(href='#', @click='doAction("insertRectangle")')
            span.pl-35 Rectangle
          b-dropdown-item(href='#', @click='doAction("insertEllipse")')
            span.pl-35 Ellipse
          b-dropdown-item(href='#', @click='doAction("insertRhombus")')
            span.pl-35 Rhombus
          b-dropdown-item(href='#', @click='doAction("insertText")')
            span.pl-35 Text
          b-dropdown-item(href='#', @click='doAction("link")')
            span.pl-35 Link...
          b-dropdown-item(href='#', @click='doAction("image")')
            span.pl-35 Image...
        b-dropdown#layout-dropright(
          dropright='',
          text='Layout',
          block,
          @mouseover.native='showSubmenu("layout-dropright")',
          @mouseleave.native='hide("layout-dropright")'
        )
          b-dropdown-item(href='#', @click='horizontalFlow("horizontal")')
            span.pl-35 Horizontal Flow
          b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
            span.pl-35 Vertical Flow
          b-dropdown-item(href='#', @click='fireEvent("horizontalTree")')
            span.pl-35 Horizontal Tree
          b-dropdown-item(href='#', @click='fireEvent("verticalTree")')
            span.pl-35 Vertical Tree
          b-dropdown-item(href='#', @click='fireEvent("radialTree")')
            span.pl-35 Radial Tree
          b-dropdown-item(href='#', @click='fireEvent("OrganicLayout")')
            span.pl-35 Organic
          b-dropdown-item(href='#', @click='circle')
            span.pl-35 Circle
        b-dropdown-divider.py-0
        b-dropdown-item(
          href='#',
          @click='doAction("group")',
          :disabled='!editorUi.actions.get("group").isEnabled()'
        )
          span.pl-35 Group
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}G
        b-dropdown-item(
          href='#',
          @click='doAction("ungroup")',
          :disabled='!editorUi.actions.get("ungroup").isEnabled()'
        )
          span.pl-35 Ungroup
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+U
        b-dropdown-item(
          href='#',
          @click='doAction("removeFromGroup")',
          :disabled='!editorUi.actions.get("removeFromGroup").isEnabled()'
        )
          span.pl-35 Remove from Group
        b-dropdown-divider.py-0
        b-dropdown-item(
          href='#',
          @click='doAction("clearWaypoints")',
          :disabled='!isSomethingSelected'
        )
          span.pl-35 Clear waypoints
          span.float-right.shortcut.f-12.icon-color.py-0.px-3 Alt+Shift+C
        b-dropdown-item.pb-1(
          href='#',
          @click='doAction("autosize")',
          :disabled='!isSomethingSelected'
        )
          span.pl-35 Autosize
          span.float-right.shortcut.f-12.py-0.px-3 {{ controlKey }}+Shift+Y
      b-nav-item-dropdown#menu-padding.extra(text='Extras', @show='disabledHover')
        b-dropdown-item(href='#', @click='doAction("copyConnect")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.copyOnConnect')
          span.pl-35 Copy on Connect
        b-dropdown-item(href='#', @click='doAction("collapseExpand")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(
            v-show='checkboxes.collapseExpand'
          )
          span.pl-35 Collapse/Expand
        b-dropdown-divider.py-0
        b-dropdown-item.mb-1(href='#', @click='doAction("editDiagram")')
          span.pl-35 Edit Diagram...
</template>

<style lang="scss">
@import '../styles/menubar.scss';
</style>
