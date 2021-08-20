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
  mxClient,
  mxConstants,
  mxEventObject,
  mxEventSource,
  mxHierarchicalLayout,
} from '../lib/jgraph/mxClient.js';
import { Editor } from '../lib/jgraph/Editor.js';
import { BvEvent } from 'bootstrap-vue';
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api';
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
    isEditing: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { graph } = props.editorUi.editor;

    const redoDisabled = ref<boolean>(true);

    const undoDisabled = ref<boolean>(true);

    const isSomethingSelected = ref<boolean>(false);

    const isMultipleCellSelected = ref<boolean>(false);

    const controlKey = ref<string>(Editor.ctrlKey);

    const dropdown = ref(null);

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
      dropdown.value.hide(true);
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
      dropdown.value.hide(true);
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
      dropdown.value.hide(true);
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

    function fireEvent(type: string, closeDropDown = false, treeType = '') {
      if (treeType == '') {
        props.editorUi.fireEvent(new mxEventObject(type));
      } else {
        props.editorUi.fireEvent(new mxEventObject(type, 'type', treeType));
      }
      if (closeDropDown) {
        dropdown.value.hide(true);
      }
    }

    function changeMenuStatus(_sender: typeof mxEventSource, event: mxEventObject) {
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
      const container = mxClient.getDocumentContainer();
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

    function preventDefaultShow(bvEvent: BvEvent) {
      bvEvent.preventDefault();
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
      dropdown,
      fireEvent,
      graph,
      hide,
      horizontalFlow,
      isMultipleCellSelected,
      isSomethingSelected,
      mxClient,
      preventDefaultShow,
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
          span.material-icons.menu-icons.print-icon print
          span.item-name Print
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}P
      b-nav-item-dropdown#menu-padding(text='Edit', @show='disabledHover')
        b-dropdown-item(
          href='#',
          @click='doAction("undo")',
          :disabled='!editorUi.actions.get("undo").isEnabled()'
        )
          span.material-icons.menu-icons undo
          span.item-name Undo
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}Z
        b-dropdown-item(
          href='#',
          @click='doAction("redo")',
          :disabled='!editorUi.actions.get("redo").isEnabled()'
        )
          span.material-icons.menu-icons redo
          span.item-name Redo
          span.shortcut {{ controlKey }}+Shift+Z
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("cut")', :disabled='!isSomethingSelected')
          span.material-icons.menu-icons content_cut
          span.item-name Cut
          span.shortcut.pt2-0.px-3 {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}X
        b-dropdown-item(href='#', @click='doAction("copy")', :disabled='!isSomethingSelected')
          span.material-icons.menu-icons content_copy
          span.item-name Copy
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}C
        b-dropdown-item(href='#', @click='doAction("paste")')
          span.material-icons.menu-icons content_paste
          span.item-name Paste
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}V
        b-dropdown-item(href='#', @click='doAction("delete")', :disabled='!isSomethingSelected')
          span.item-name Delete
          span.shortcut Delete
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("duplicate")', :disabled='!isSomethingSelected')
          span.item-name Duplicate
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}D
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("find")')
          span.item-name Find/Replace...
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}F
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("editData")')
          span.item-name Edit Data...
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}M
        b-dropdown-item(
          href='#',
          @click='doAction("editTooltip")',
          :disabled='!isSomethingSelected'
        )
          span.item-name Edit Tooltip...
          span.shortcut Alt+Shift+T
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("editStyle")', :disabled='!isSomethingSelected')
          span.item-name Edit Style...
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}E
        b-dropdown-item(href='#', @click='doAction("edit")', :disabled='!isSomethingSelected')
          span.item-name Edit
          span.shortcut F2/Enter
        b-dropdown-item(href='#', @click='doAction("editLink")', :disabled='!isSomethingSelected')
          span.item-name Edit link...
          span.shortcut Alt+Shift+L
        b-dropdown-item(href='#', @click='doAction("openLink")', :disabled='!isSomethingSelected')
          span.item-name Open Link
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("selectVertices")')
          span.item-name Select Vertices
          span.shortcut Alt+Shift+I
        b-dropdown-item(href='#', @click='doAction("selectEdges")')
          span.item-name Select Edges
          span.shortcut Alt+Shift+E
        b-dropdown-item(href='#', @click='doAction("selectAll")')
          span.item-name Select All
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}A
        b-dropdown-item(href='#', @click='doAction("selectNone")')
          span.item-name Select None
          span.shortcut {{ controlKey }}+Shift+A
        b-dropdown-divider.no-hover
        b-dropdown-item.pb-1(
          href='#',
          @click='doAction("lockUnlock")',
          :disabled='!isSomethingSelected'
        )
          span.item-name Lock/Unlock
      b-nav-item-dropdown#menu-padding.xl-large-dropdown(text='View', @show='disabledHover')
        b-dropdown-item(href='#', @click='doAction("formatPanel")')
          span.material-icons.menu-icons(v-show='checkboxes.formatPanel') done
          span.item-name Format Panel
          span.shortcut {{ controlKey }}+Shift+P
        b-dropdown-item(href='#', @click='doAction("outline")')
          span.material-icons.menu-icons(v-show='checkboxes.outline') done
          span.item-name Outline
          span.shortcut {{ controlKey }}+Shift+O
        b-dropdown-item(href='#', @click='doAction("layers")')
          span.material-icons.menu-icons(v-show='checkboxes.layers') done
          span.item-name Layers
          span.shortcut {{ controlKey }}+Shift+L
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("colors")')
          span.material-icons.menu-icons(v-show='checkboxes.color') done
          span.item-name Colors
        b-dropdown-item(href='#', @click='doAction("scratchpad")')
          span.material-icons.menu-icons(v-show='checkboxes.scratchpad') done
          span.item-name Scratchpad
        b-dropdown-item(href='#', @click='fireEvent("moreShapes")')
          span.item-name Shapes...
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("pageView")')
          span.material-icons.menu-icons(v-show='checkboxes.pageView') done
          span.item-name Page View
        b-dropdown-item(href='#', @click='doAction("pageScale")')
          span.item-name Page Scale...
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("scrollbars")')
          span.material-icons.menu-icons(v-show='checkboxes.scrollbars') done
          span.item-name Scrollbars
        b-dropdown-item(href='#', @click='doAction("tooltips")')
          span.item-name Tooltip
        b-dropdown-item(href='#', @click='doAction("ruler")')
          span.material-icons.menu-icons(v-show='checkboxes.ruler') done
          span.item-name Ruler
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("grid")')
          span.material-icons.menu-icons(v-show='checkboxes.grid') done
          span.item-name Grid
          span.shortcut {{ controlKey }}+Shift+G
        b-dropdown-item(href='#', @click='doAction("guides")')
          span.material-icons.menu-icons(v-show='checkboxes.guides') done
          span.item-name Guides
        b-dropdown-item(href='#', @click='doAction("shadow")', :disabled='!isSomethingSelected')
          .item-name Shadow
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("connectionArrows")')
          span.material-icons.menu-icons(v-show='checkboxes.connectionArrow') done
          span.item-name Connection Arrow
          span.shortcut Alt+Shift+A
        b-dropdown-item(href='#', @click='doAction("connectionPoints")')
          span.material-icons.menu-icons(v-show='checkboxes.connectionPoints') done
          span.item-name Connection Points
          span.shortcut Alt+Shift+P
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("resetView")')
          span.item-name Reset View
          span.shortcut Enter/Home
        b-dropdown-item(href='#', @click='doAction("zoomIn")')
          span.material-icons.menu-icons zoom_in
          span.item-name Zoom In
          span.shortcut {{ controlKey }}+(Numpad)
        b-dropdown-item(href='#', @click='doAction("zoomOut")')
          span.material-icons.menu-icons zoom_out
          span.item-name Zoom Out
          span.shortcut {{ controlKey }}-(Numpad)
        b-dropdown-divider.no-hover
        b-dropdown-item.pb-1(href='#', @click='doAction("fullscreen")')
          span.item-name Fullscreen
      b-nav-item-dropdown#menu-padding.large-dropdown(
        text='Arrange',
        @show='disabledHover',
        ref='dropdown'
      )
        b-dropdown-item(href='#', @click='doAction("toFront")', :disabled='!isSomethingSelected')
          span.material-icons.menu-icons flip_to_front
          span.item-name To Front
          span.shortcut Alt+Shift+F
        b-dropdown-item(href='#', @click='doAction("toBack")', :disabled='!isSomethingSelected')
          span.material-icons.menu-icons flip_to_back
          span.item-name To Back
          span.shortcut Alt+Shift+B
        b-dropdown-item(
          href='#',
          @click='doAction("bringForward")',
          :disabled='!isSomethingSelected'
        )
          span.item-name.py-0 Bring Forward
        b-dropdown-item(
          href='#',
          @click='doAction("sendBackward")',
          :disabled='!isSomethingSelected'
        )
          span.item-name.py-0 Send Backward
        b-dropdown-divider.no-hover
        b-dropdown#direction-dropright.sub-menu(
          dropright='',
          text='Direction',
          block,
          @show='preventDefaultShow',
          @mouseover.native='showSubmenu("direction-dropright")',
          @mouseleave.native='hide("direction-dropright")',
          :disabled='!isSomethingSelected'
        )
          b-dropdown-item(href='#', @click='direction("horizontal")')
            span.item-name Flip Horizontal
          b-dropdown-item(href='#', @click='direction("vertical")')
            span.item-name Flip Vertical
          b-dropdown-divider.no-hover
          b-dropdown-item(href='#', @click='fireEvent("openRotation")')
            span.item-name Rotation
        b-dropdown-item(href='#', @click='doAction("turn")', :disabled='!isSomethingSelected')
          span.material-icons.menu-icons rotate_right
          span.item-name Rotate shape only by 90/ Reverse
          span.shortcut {{ controlKey }}+R
        b-dropdown-divider.no-hover
        b-dropdown#align-dropright.sub-menu(
          dropright='',
          text='Align',
          block,
          @show='preventDefaultShow',
          @mouseover.native='showSubmenu("align-dropright")',
          @mouseleave.native='hide("align-dropright")',
          :disabled='!isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='align("left")')
            span.item-name Left Align
          b-dropdown-item(href='#', @click='align("center")')
            span.item-name Center
          b-dropdown-item(href='#', @click='align("right")')
            span.item-name Right Align
          b-dropdown-item(href='#', @click='align("top")')
            span.item-name Top Align
          b-dropdown-item(href='#', @click='align("middle")')
            span.item-name Middle
          b-dropdown-item(href='#', @click='align("bottom")')
            span.item-name Bottom Align
        b-dropdown#distribute-dropright.sub-menu(
          dropright='',
          text='Distribute',
          block,
          @show='preventDefaultShow',
          @mouseover.native='showSubmenu("distribute-dropright")',
          @mouseleave.native='hide("distribute-dropright")',
          :disabled='!isMultipleCellSelected'
        )
          b-dropdown-item(href='#', @click='distribute("horizontal")')
            span.item-name Horizontal
          b-dropdown-item(href='#', @click='distribute("vertical")')
            span.item-name Vertical
        b-dropdown-divider.no-hover
        //- b-dropdown#navigation-dropright.sub-menu(
        //-   dropright='',
        //-   text='Navigation',
        //-   block,
        //-   @show='preventDefaultShow',
        //-   @mouseover.native='showSubmenu("navigation-dropright")',
        //-   @mouseleave.native='hide("navigation-dropright")',
        //-   :disabled='!isSomethingSelected'
        //- )
        //-   b-dropdown-item(href='#', @click='doAction("home")')
        //-     span.item-name Home
        //-   b-dropdown-item(href='#', @click='doAction("exitGroup")')
        //-     span.item-name Exit Group
        //-   b-dropdown-item(href='#', @click='doAction("enterGroup")')
        //-     span.item-name Enter Group
        //-   b-dropdown-item(href='#', @click='doAction("expand")')
        //-     span.item-name Expand
        //-   b-dropdown-item(href='#', @click='doAction("collapse")')
        //-     span.item-name Collapse
        //-   b-dropdown-item(href='#', @click='')
        //-     span.item-name Collapsable
        b-dropdown#insert-dropright.sub-menu(
          dropright='',
          text='Insert',
          block,
          @show='preventDefaultShow',
          @mouseover.native='showSubmenu("insert-dropright")',
          @mouseleave.native='hide("insert-dropright")',
          :disabled='!isEditing'
        )
          b-dropdown-item(href='#', @click='doAction("insertRectangle")')
            span.item-name Rectangle
          b-dropdown-item(href='#', @click='doAction("insertEllipse")')
            span.item-name Ellipse
          b-dropdown-item(href='#', @click='doAction("insertRhombus")')
            span.item-name Rhombus
          b-dropdown-divider.no-hover
          b-dropdown-item(href='#', @click='doAction("insertText")')
            span.item-name Text
          b-dropdown-item(href='#', @click='doAction("link")')
            span.item-name Link...
          b-dropdown-divider.no-hover
          b-dropdown-item(href='#', @click='doAction("image")')
            span.item-name Image...
        b-dropdown#layout-dropright.sub-menu(
          dropright='',
          text='Layout',
          block,
          @show='preventDefaultShow',
          @mouseover.native='showSubmenu("layout-dropright")',
          @mouseleave.native='hide("layout-dropright")',
          :disabled='!isEditing'
        )
          b-dropdown-item(href='#', @click='horizontalFlow("horizontal")')
            span.item-name Horizontal Flow
          b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
            span.item-name Vertical Flow
          b-dropdown-divider.no-hover
          b-dropdown-item(href='#', @click='fireEvent("openTreeLayout", false, "Horizontal Tree")')
            span.item-name Horizontal Tree
          b-dropdown-item(href='#', @click='fireEvent("openTreeLayout", false, "Vertical Tree")')
            span.item-name Vertical Tree
          b-dropdown-item(href='#', @click='fireEvent("openTreeLayout", false, "Radial Tree")')
            span.item-name Radial Tree
          b-dropdown-divider.no-hover
          b-dropdown-item(href='#', @click='fireEvent("openTreeLayout", false, "Organic")')
            span.item-name Organic
          b-dropdown-item(href='#', @click='circle')
            span.item-name Circle
        b-dropdown-divider.no-hover
        b-dropdown-item(
          href='#',
          @click='doAction("group")',
          :disabled='!editorUi.actions.get("group").isEnabled()'
        )
          span.item-name Group
          span.shortcut {{ controlKey }}{{ !mxClient.IS_MAC ? "+" : "" }}G
        b-dropdown-item(
          href='#',
          @click='doAction("ungroup")',
          :disabled='!editorUi.actions.get("ungroup").isEnabled()'
        )
          span.item-name Ungroup
          span.shortcut {{ controlKey }}+Shift+U
        b-dropdown-item(
          href='#',
          @click='doAction("removeFromGroup")',
          :disabled='!editorUi.actions.get("removeFromGroup").isEnabled()'
        )
          span.item-name Remove from Group
        b-dropdown-divider.no-hover
        b-dropdown-item(
          href='#',
          @click='doAction("clearWaypoints")',
          :disabled='!isSomethingSelected'
        )
          span.item-name Clear waypoints
          span.shortcut.py-0.px-3 Alt+Shift+C
        b-dropdown-item.pb-1(
          href='#',
          @click='doAction("autosize")',
          :disabled='!isSomethingSelected'
        )
          span.item-name Autosize
          span.shortcut {{ controlKey }}+Shift+Y
      b-nav-item-dropdown#menu-padding.extra(text='Extras', @show='disabledHover')
        b-dropdown-item(href='#', @click='doAction("copyConnect")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(v-show='checkboxes.copyOnConnect')
          span.item-name Copy on Connect
        b-dropdown-item(href='#', @click='doAction("collapseExpand")')
          i.fa-solid.fa-check.tp-2.float-left.pr-2.menu-checkbox(
            v-show='checkboxes.collapseExpand'
          )
          span.item-name Collapse/Expand
        b-dropdown-divider.no-hover
        b-dropdown-item(href='#', @click='doAction("editDiagram")')
          span.item-name Edit Diagram...
      //- b-nav-item-dropdown#menu-padding.extra(text='Insert', @show='disabledHover')
      //-   b-dropdown#image-dropright(
      //-     dropright='',
      //-     text='Image',
      //-     block,
      //-     @show='preventDefaultShow',
      //-     @mouseover.native='showSubmenu("image-dropright")',
      //-     @mouseleave.native='hide("image-dropright")'
      //-   )
      //-     b-dropdown-item(href='#', @click='horizontalFlow("horizontal")')
      //-       span.material-icons.menu-icons file_upload
      //-       span.item-name Upload from computer
      //-     b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
      //-       span.material-icons.menu-icons search
      //-       span.item-name Search For Web
      //-     b-dropdown-divider
      //-     b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
      //-       span.material-icons.menu-icons add_to_drive
      //-       span.item-name Drive
      //-     b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
      //-       span.material-icons.menu-icons filter_vintage
      //-       span.item-name Photos
      //-     b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
      //-       span.material-icons.menu-icons insert_link
      //-       span.item-name By Url
      //-     b-dropdown-item(href='#', @click='horizontalFlow("vertical")')
      //-       span.material-icons.menu-icons photo_camera
      //-       span.item-name Camera
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Text Box
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Shape
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Table
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons insert_chart_outlined
      //-     span.item-name.py-0 Chart
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Diagram
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Word Art
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Line
      //-   b-dropdown-divider
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons format_shapes
      //-     span.item-name.py-0 Spacial Character
      //-   b-dropdown-divider
      //-   b-dropdown-item(href='#')
      //-     span.material-icons.menu-icons link
      //-     span.item-name.py-0 Link
      //-     span.shortcut {{ controlKey }}+K
      //-   b-dropdown-item(href='#')
      //-     i.material-icons.menu-icons.ten9-font.ten9-icon-insert-comment
      //-     span.item-name.py-0 Comment
      //-     span.shortcut {{ controlKey }}+Alt+M
</template>
