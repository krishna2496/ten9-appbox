<!--
* ten9, Inc
* Copyright (c) 2015 - 2021 ten9, Inc
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
import NestedLayers from './NestedLayer.vue';
import WindowHeader from './Header.vue';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';
import resize from 'vue-resize-directive';
// TODO: Figure out why we can't import here
const { dragElement, bringWindowToFront } = require('./utils.ts');
const { mxEventSource, mxEventObject, mxCell, mxResources } = require('../../lib/jgraph/mxClient');
const graphUtils = require('../../lib/jgraph/graph_utils.js');

interface simpleInt {
  geometry: string;
  id: string;
  style: string;
  value: string;
  visible: boolean;
  children: simpleInt;
}
type LayerProperty = simpleInt[];
interface boxCoordinate {
  left: string;
  top: string;
  height: string;
  width: string;
  opacity: string;
}
interface coordinateProperty {
  style: boxCoordinate;
}
interface dropdownCoordinates {
  top: string;
  left: string;
}

export default defineComponent({
  name: 'LayerWindow',
  directives: {
    resize,
  },
  components: {
    NestedLayers,
    WindowHeader,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);
    const isEnableBind = ref<boolean>(false);
    const layers = ref<LayerProperty>();
    const isShow = ref<boolean>(false);
    const dropdownCoordinates = ref<dropdownCoordinates>({ top: '97', left: '622' });
    const selectedLayer = ref<string>('');
    const layerWindow = ref<coordinateProperty>();
    const layerWindowCoordinates = ref<{
      left: string;
      top: string;
      height: string;
      width: string;
    }>({ left: '', top: '', height: '', width: '' });
    const isMin = ref<boolean | undefined>(false);
    const editLayerName = ref<string>('');
    const editLayerId = ref<string>('');
    const dropDownId = ref<string>(selectedLayer.value);
    const isEnableBindMove = ref<boolean>(false);
    const isDeleteEnabled = ref<boolean>(false);

    // Get index of layer from it's id
    function getIndexFromId(id: string) {
      const index = layers.value.findIndex((layer) => layer['id'].toString() === id);
      return index;
    }

    function isMoveSelectionEnable(id: string) {
      const isGraphSelected = ref<boolean>(true);
      if (id) {
        const index = getIndexFromId(id);
        if (id === selectedLayer.value && layers.value[index]['style']) {
          isGraphSelected.value = false;
        }

        if (id === selectedLayer.value) {
          if (layers.value[index]['style'] || layers.value.length === 1) {
            isDeleteEnabled.value = true;
          } else {
            isDeleteEnabled.value = false;
          }
        }
      }

      if (isEnableBind.value && isGraphSelected.value) {
        isEnableBindMove.value = true;
      } else {
        isEnableBindMove.value = false;
        isShow.value = false;
      }
    }

    // Change Layer window co ordinates with last open
    function changeLayerWindowCoordinates() {
      const containerCoordinates = graphUtils.getDocumentContainerRect();
      // if layer - bottom is out of container
      const bottomCoordinate =
        parseInt(layerWindowCoordinates.value.top) + parseInt(layerWindowCoordinates.value.height);

      if (bottomCoordinate > containerCoordinates.height) {
        // if layer - height  >  container- height
        if (parseInt(layerWindowCoordinates.value.height) > containerCoordinates.height) {
          layerWindowCoordinates.value.height = containerCoordinates.height.toString();
          layerWindowCoordinates.value.top = '0';
        } else {
          const deviation = bottomCoordinate - containerCoordinates.height;
          layerWindowCoordinates.value.top = Math.floor(
            parseInt(layerWindowCoordinates.value.top) - deviation,
          ).toString();
        }
      }

      // if layer - right is out of container
      const rightCoordinate =
        parseInt(layerWindowCoordinates.value.left) + parseInt(layerWindowCoordinates.value.width);
      if (rightCoordinate > containerCoordinates.width) {
        // if layer - width  >  container- width
        if (parseInt(layerWindowCoordinates.value.width) > containerCoordinates.width) {
          layerWindowCoordinates.value.width = containerCoordinates.width.toString();
          layerWindowCoordinates.value.left = '0';
        } else {
          const deviationRight = 0;
          const deviation = rightCoordinate - containerCoordinates.width + deviationRight;
          layerWindowCoordinates.value.left = Math.floor(
            parseInt(layerWindowCoordinates.value.left) - deviation,
          ).toString();
        }
      }

      layerWindow.value.style.top = layerWindowCoordinates.value.top + 'px';
      layerWindow.value.style.left = layerWindowCoordinates.value.left + 'px';
      layerWindow.value.style.height = layerWindowCoordinates.value.height + 'px';
      layerWindow.value.style.width = layerWindowCoordinates.value.width + 'px';

      const topDeviation = 5;
      const height = 260;
      const leftDeviation = 30;

      if (layerWindowCoordinates.value.height) {
        dropdownCoordinates.value.top = (
          parseInt(layerWindowCoordinates.value.top) +
          parseInt(layerWindowCoordinates.value.height) -
          topDeviation
        ).toString();
      } else {
        dropdownCoordinates.value.top = (
          parseInt(layerWindowCoordinates.value.top) +
          height -
          topDeviation
        ).toString();
      }

      dropdownCoordinates.value.left = (
        parseInt(layerWindowCoordinates.value.left) + leftDeviation
      ).toString();
    }

    // Change selected layer on layer selection
    function changeSelectedLayer(id: string) {
      const { graph } = props.editorUi.editor;
      selectedLayer.value = id;
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
      if (graph.isEnabled()) {
        graph.setDefaultParent(defaultParent[index]);
        graph.view.setCurrentRoot(null);
      }
      isMoveSelectionEnable(id);
    }

    function changeCellSelection(id: string) {
      const { graph } = props.editorUi.editor;
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
      graph.setSelectionCells(null);
      if (!defaultParent[index]['style']) {
        graph.setSelectionCells(defaultParent[index].children);
      } else {
        for (let i = layers.value.length - 1; i >= 0; i--) {
          graph.removeSelectionCells(layers.value[i].children);
        }
      }
    }

    // Open layer window
    function openLayerWindow() {
      const { graph } = props.editorUi.editor;
      const graphModel = graph.model;
      show.value = true;
      layers.value = graphModel.root.children;

      if (!layers.value[0]['value']) {
        // Set default name if there is empty layer
        layers.value[0]['value'] = 'Background';
      }

      // layers.value.length == 1 && changeSelectedLayer(layers.value[layers.value.length - 1].id);
      const { id: id } = graph.getDefaultParent();
      changeSelectedLayer(id);

      nextTick(() => {
        layerWindow.value = document.getElementById('layer-window-id');
        if (layerWindowCoordinates.value.top !== '') {
          // Change default window coordinates to last open
          changeLayerWindowCoordinates();
        } else {
          const containerRect = graphUtils.getDocumentContainerRect();
          const topPadding = 10;
          const rightPadding = 40;
          const layerWindowWidth = 240;
          const formatWidth = 240;

          layerWindow.value.style.top = `${
            +props.editorUi.menubarHeight + +props.editorUi.toolbarHeight + topPadding
          }px`;

          layerWindow.value.style.left = `${
            +containerRect.left +
            +containerRect.width -
            layerWindowWidth -
            rightPadding -
            formatWidth
          }px`;
        }
        layerWindow.value.style.opacity = '1';
      });

      bringWindowToFront(2);
    }

    // Enable/disable move selection button on graph selection changes
    function changeSelectionStage(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      if (event.getProperty('selection')) {
        // Enable move selection button if any shape is selected.
        isEnableBind.value = true;
        const { graph } = props.editorUi.editor;
        const graphModel = graph.model;
        if (layers && layers.value) {
          for (let i = layers.value.length - 1; i >= 0; i--) {
            const layerCell = graphModel.getChildAt(graphModel.root, i);
            const selectedCells = graph.getSelectionCells();
            if (selectedCells.length === 0) {
              break;
            }
            let allCellsInSameLayer = true;
            for (
              let cellIndex = 0;
              allCellsInSameLayer && cellIndex < selectedCells.length;
              cellIndex++
            ) {
              allCellsInSameLayer = graphModel.isAncestor(layerCell, selectedCells[cellIndex]);
            }
            if (allCellsInSameLayer) {
              changeSelectedLayer(layers.value[i].id);
              break;
            }
          }
        }
      } else {
        // Disable move selection button if no shape is selected
        isEnableBind.value = false;
        isShow.value = false;
      }
      isMoveSelectionEnable('');
    }

    // Set layer window's coordinates on window close for next open
    function setLayerWindowCoordinates() {
      if (!layerWindow.value) {
        return;
      }
      const layerWindowStyle = layerWindow.value.style;
      const layerWindowStyleTop = layerWindowStyle.top.split('px');
      const layerWindowStyleLeft = layerWindowStyle.left.split('px');
      const layerWindowStyleHeight = layerWindowStyle.height.split('px');
      const layerWindowStyleWidth = layerWindowStyle.width.split('px');

      [layerWindowCoordinates.value.top] = layerWindowStyleTop;
      [layerWindowCoordinates.value.left] = layerWindowStyleLeft;
      [layerWindowCoordinates.value.height] = layerWindowStyleHeight;
      [layerWindowCoordinates.value.width] = layerWindowStyleWidth;

      changeLayerWindowCoordinates();
    }
    onMounted(() => {
      const { graph } = props.editorUi.editor;

      // Open layer window
      props.editorUi.addListener('openLayerWindow', openLayerWindow);
      props.editorUi.addListener('setLayerWindowCoordinates', setLayerWindowCoordinates);
      const ele: unknown = document.getElementsByClassName('card');

      // Add drag property on layer window.
      dragElement(ele[2], 2);

      // Enable/Disable move selection button on window open if any shape selected.
      graph.addListener('changeSelectionStage', changeSelectionStage);

      document.addEventListener('click', (event) => {
        if (event.target['classList'][1] !== 'fa-share-from-square') {
          isShow.value = false;
        }
      });
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(openLayerWindow);
    });

    // Add new layer to layer window
    function addLayer() {
      const { graph } = props.editorUi.editor;
      const graphModel = graph.model;
      if (graph.isEnabled()) {
        graphModel.beginUpdate();
        try {
          const cell = graph.addCell(
            new mxCell(mxResources.get('untitledLayer')),
            graphModel.root,
            layers.value.length,
          );
          cell['children'] = [];
          graph.setDefaultParent(cell);
        } finally {
          graphModel.endUpdate();
        }
      }
      changeCellSelection(layers.value[layers.value.length - 1].id);
      changeSelectedLayer(layers.value[layers.value.length - 1].id);
    }

    // Delete selected layer from layers listing
    function deleteLayer() {
      // TODO: Fix this.. we shouldn't find elements this way since we could have a trash can in other places
      const deleteButton = document.querySelector('.fa-trash-can').parentElement;
      if (!deleteButton.classList.contains('mxDisabled')) {
        const { graph } = props.editorUi.editor;
        const graphModel = graph.model;
        let i = getIndexFromId(selectedLayer.value);
        const defaultParent = layers.value;

        if (graph.isEnabled()) {
          graphModel.beginUpdate();
          try {
            const index = graphModel.root.getIndex(defaultParent[i]);
            graph.removeCells([defaultParent[i]], false);

            // Creates default layer if no layer exists
            if (graphModel.getChildCount(graphModel.root) == 0) {
              graphModel.add(graphModel.root, new mxCell('Background'));
              graph.setDefaultParent();
            } else if (index > 0 && index <= graphModel.getChildCount(graphModel.root)) {
              graph.setDefaultParent(graphModel.getChildAt(graphModel.root, index - 1));
              i = index - 1;
            } else {
              graph.setDefaultParent(null);
            }
          } finally {
            graphModel.endUpdate();
          }
          changeCellSelection(layers.value[i].id);
          changeSelectedLayer(layers.value[i].id);
        }
      }
    }

    // Create new duplicate of selected layer
    function duplicateLayer() {
      const { graph } = props.editorUi.editor;
      const graphModel = graph.model;
      const index = getIndexFromId(selectedLayer.value);
      if (graph.isEnabled()) {
        let newCell = null;
        graphModel.beginUpdate();
        try {
          newCell = graph.cloneCell(layers.value[index]);
          newCell.value = `${newCell.value} copy`;
          newCell = graph.addCell(newCell, graphModel.root, index + 1);
          graph.setDefaultParent(newCell);
        } finally {
          changeCellSelection(newCell.id);
          changeSelectedLayer(newCell.id);
          graphModel.endUpdate();
        }

        if (newCell != null && !graph.isCellLocked(newCell)) {
          graph.selectAll(newCell);
        }
      }
    }

    // Edit selected layer name
    function editLayer(id: string) {
      const index = getIndexFromId(id);
      props.editorUi.fireEvent(
        new mxEventObject('openLayerRenameDialog', 'layer', layers.value[index]),
      );
    }

    // Get graph selection to link with selected layer
    function moveSelection() {
      const { graph } = props.editorUi.editor;
      const graphModel = graph.model;
      setLayerWindowCoordinates();
      dropDownId.value = '';
      for (let i = layers.value.length - 1; i >= 0; i--) {
        const child = graphModel.getChildAt(graphModel.root, i);
        if (
          graph.getSelectionCount() == 1 &&
          graphModel.isAncestor(child, graph.getSelectionCell())
        ) {
          dropDownId.value = layers.value[i].id;
        }
      }

      if (isShow.value === true) {
        isShow.value = !isShow.value;
      }
      isShow.value = !isShow.value;
    }

    // Select layer for move selection
    function selectLayerForMoveSelection(id: string) {
      const { graph } = props.editorUi.editor;
      dropDownId.value = id;
      const index = getIndexFromId(id);
      graph.moveCells(graph.getSelectionCells(), 0, 0, false, layers.value[index]);
      moveSelection();
    }

    // Lock/unlock selected layer
    function lockLayer(id: string, locked: boolean) {
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
      const { graph } = props.editorUi.editor;
      if (graph.isEnabled()) {
        let value = null;
        if (locked) {
          value = '1';
        }
        graph.getModel().beginUpdate();
        try {
          graph.setCellStyles('locked', value, [defaultParent[index]]);
        } finally {
          graph.getModel().endUpdate();
        }

        if (value == '1') {
          if (id == selectedLayer.value) {
            isEnableBind.value = false;
          }
          graph.removeSelectionCells(graph.getModel().getDescendants(defaultParent[index]));
        }
      }
      if (id == selectedLayer.value) {
        changeCellSelection(id);
      }
      isMoveSelectionEnable(id);
    }

    // Check/uncheck layer
    function checkLayer(id: string, checked: boolean) {
      const graphModel = props.editorUi.editor.graph.model;
      const index = getIndexFromId(id);
      const temp = layers.value[index];
      layers.value.splice(index, 1);
      layers.value.splice(index, 0, temp);
      const defaultParent = layers.value;
      graphModel.setVisible(defaultParent[index], checked);
    }

    // Drag layers
    function dragLayer(draggedElement: simpleInt, newIndex: number) {
      const { graph } = props.editorUi.editor;
      const graphModel = graph.model;

      graph.getModel().beginUpdate();
      try {
        graph.addCell(draggedElement, graphModel.root, newIndex);
      } finally {
        graph.getModel().endUpdate();
      }
    }

    function changeMinStatus() {
      isMin.value = !isMin.value;
    }

    // Display short name of layer in move selection dropdown
    function breakWord(word: string) {
      const maxChar = 16;
      if (word.length > maxChar) {
        const tmp = word.slice(0, maxChar) + '...';
        return tmp;
      } else {
        return word;
      }
    }

    // Close layer window
    function close() {
      show.value = false;
      setLayerWindowCoordinates();
      props.editorUi.fireEvent(
        new mxEventObject('changeMenuStatus', 'type', 'layers', 'value', false),
      );
    }

    return {
      addLayer,
      breakWord,
      changeCellSelection,
      changeSelectionStage,
      changeLayerWindowCoordinates,
      changeMinStatus,
      changeSelectedLayer,
      checkLayer,
      close,
      deleteLayer,
      dragLayer,
      dropdownCoordinates,
      dropDownId,
      duplicateLayer,
      editLayer,
      editLayerId,
      editLayerName,
      getIndexFromId,
      isEnableBind,
      isDeleteEnabled,
      isEnableBindMove,
      isMin,
      isShow,
      layers,
      lockLayer,
      moveSelection,
      selectedLayer,
      selectLayerForMoveSelection,
      setLayerWindowCoordinates,
      show,
    };
  },
  data: function () {
    return {};
  },
});
</script>

<template lang="pug">
.layer-window(v-show='show')
  div
    b-button(v-if='!show', @click='show = true', variant='primary') Show Layer Window
    b-card#layer-window-id.layer-window-card(
      no-body='',
      header-tag='div',
      footer-tag='footer',
      v-show='show',
      :class='{ "show-window": show, "layer-window-maximize": isMin === false, "layer-window-minimize": isMin === true }'
    )
      template.row(#header='')
        window-header(
          title='Layers',
          @close-window='close',
          :isMin='isMin',
          @change-min-status='changeMinStatus'
        )
      b-card-body.layer-window-card-body-main(v-if='!isMin')
        nested-layers(
          v-if='show',
          v-model='layers',
          :selectedLayer='selectedLayer',
          @edit-layer='editLayer',
          @change-selected-layer='changeSelectedLayer',
          @change-cell-selection='changeCellSelection',
          @lock-layer='lockLayer',
          @check-layer='checkLayer',
          @drag-layer='dragLayer'
        )
      template(#footer='', v-if='!isMin')
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='deleteLayer',
          title='Delete layer',
          :class='{ mxDisabled: isDeleteEnabled }'
        )
          i.fal.fa-trash-can.fa-lg.layer-window-footerBtn
        span#layer-window-moveSelectionBtn.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='isEnableBindMove ? moveSelection() : null',
          title='Move to...',
          :class='{ isEnableBindMove: !isEnableBindMove, mxDisabled: !isEnableBindMove }'
        )
          i.fa.fa-share-from-square.fa-lg.layer-window-footerBtn
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          title='Create a new group',
          :class='{ mxDisabled: true }'
        )
          i.fal.fa-folder-open.fa-lg.layer-window-footerBtn
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='addLayer',
          title='Create a new layer'
        )
          i.fa.fa-plus.fa-lg.layer-window-footerBtn
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='duplicateLayer',
          title='Duplicate...'
        )
          i.fa.fa-clone.fa-md.layer-window-footerBtn

    b-card.layer-window-dropdown(
      v-if='isShow',
      :class='{ moveSelectionIndex: isShow }',
      :style='{ top: dropdownCoordinates.top + "px", left: dropdownCoordinates.left + "px" }'
    )
      b-row.layer-window-dropdownRow(
        :key='key',
        v-for='(layer, key) in layers.slice().reverse()',
        @click='!layer.style ? selectLayerForMoveSelection(layer.id) : null',
        :class='{ dropDownRowDisable: layer.style }'
      )
        span.layer-window-dropdownTick
          i.fa.fa-check(v-if='layer.id === dropDownId')
        span.layer-window-dropdown-layer-name {{ breakWord(layer.value) }}
        span(v-if='layer.style') (Locked)
</template>
