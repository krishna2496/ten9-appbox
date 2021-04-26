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
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import resize from 'vue-resize-directive';
const dragElement = require('./Drag.ts');
const { mxEventSource, mxEventObject, mxCell, mxResources } = require('../../lib/jgraph/mxClient');

interface simpleInt {
  geometry: string;
  id: string;
  style: string;
  value: string;
  visible: boolean;
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
    const selectedLayer = ref<string>('1');
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
    const { graph } = props.editorUi.editor;
    const graphModel = graph.model;

    // Close layer window
    function close() {
      show.value = false;
    }

    // Get index of layer from it's id
    function getIndexFromId(id: string) {
      const index = layers.value.findIndex((layer) => layer['id'].toString() === id);
      return index;
    }

    // Change Layer window co ordinates with last open
    function changeLayerWindowCoordinates() {
      layerWindow.value.style.top = layerWindowCoordinates.value.top + 'px';
      layerWindow.value.style.left = layerWindowCoordinates.value.left + 'px';
      layerWindow.value.style.height = layerWindowCoordinates.value.height + 'px';
      layerWindow.value.style.width = layerWindowCoordinates.value.width + 'px';

      const topDeviation = 5;
      const height = 165;
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
      selectedLayer.value = id;
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
      if (graph.isEnabled()) {
        graph.setDefaultParent(defaultParent[index]);
        graph.view.setCurrentRoot(null);
      }
    }

    // Open layer window
    function openLayerWindow() {
      show.value = true;
      const timeOut = 10;
      layers.value = graphModel.root.children;
      if (!layers.value[0]['value']) {
        // Set default name if there is empty layer
        layers.value[0]['value'] = 'Background';
      }
      setTimeout(() => {
        layerWindow.value = document.getElementById('layer-window-id');
        if (layerWindowCoordinates.value.top !== '') {
          // Change default window coordinates to last open
          changeLayerWindowCoordinates();
        } else {
          // Set default window coordinates to default
          layerWindow.value.style.top = '120px';
          layerWindow.value.style.left = '690px';
        }
        layerWindow.value.style.opacity = '1';
      }, timeOut);
    }

    // Enable/disable move selection button on graph selection changes
    function changeSelectionStage(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      if (event.getProperty('selection')) {
        // Enable move selection button if any shape is selected.
        isEnableBind.value = true;
      } else {
        // Disable move selection button if no shape is selected
        isEnableBind.value = false;
        isShow.value = false;
      }
    }

    onMounted(() => {
      // Open layer window
      props.editorUi.addListener('openLayerWindow', openLayerWindow);

      const ele: unknown = document.getElementsByClassName('card');
      // Add drag property on layer window.
      dragElement.default(ele[1], 1);

      // Enable/Disable move selection button on window open if any shape selected.
      graph.addListener('changeSelectionStage', changeSelectionStage);

      document.addEventListener('click', (event) => {
        if (event.target['classList'][1] !== 'fa-share-square-o') {
          isShow.value = false;
        }
      });
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openLayerWindow);
    });

    // Add new layer to layer window
    function addLayer() {
      if (graph.isEnabled()) {
        graphModel.beginUpdate();
        try {
          const cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), graphModel.root);
          cell['children'] = [];
          graph.setDefaultParent(cell);
        } finally {
          graphModel.endUpdate();
        }
      }
      changeSelectedLayer(layers.value[layers.value.length - 1].id);
    }

    // Delete selected layer from layers listing
    function deleteLayer() {
      const i = getIndexFromId(selectedLayer.value);
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
          } else {
            graph.setDefaultParent(null);
          }
        } finally {
          graphModel.endUpdate();
        }
        changeSelectedLayer(layers.value[layers.value.length - 1].id);
      }
    }

    // Create new duplicate of selected layer
    function duplicateLayer() {
      const index = getIndexFromId(selectedLayer.value);
      if (graph.isEnabled()) {
        let newCell = null;
        graphModel.beginUpdate();
        try {
          newCell = graph.cloneCell(layers.value[index]);
          newCell = graph.addCell(newCell, graphModel.root);
          graph.setDefaultParent(newCell);
        } finally {
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

    // Set layer window's coordinates on window close for next open
    function setLayerWindowCoordinates() {
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

    // Get graph selection to link with selected layer
    function moveSelection() {
      setLayerWindowCoordinates();
      layers.value.forEach((layer) => {
        if (
          graph.getSelectionCount() == 1 &&
          graphModel.isAncestor(layer, graph.getSelectionCell())
        ) {
          dropDownId.value = layer.id;
        }
      });
      if (isShow.value === true) {
        isShow.value = !isShow.value;
      }
      isShow.value = !isShow.value;
    }

    // Select layer for move selection
    function selectLayerForMoveSelection(id: string) {
      dropDownId.value = id;
      const index = getIndexFromId(id);
      graph.moveCells(graph.getSelectionCells(), 0, 0, false, layers.value[index]);
      moveSelection();
    }

    // Lock/unlock selected layer
    function lockLayer(id: string, locked: boolean) {
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
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
          graph.removeSelectionCells(graph.getModel().getDescendants(defaultParent[index]));
        }
      }
    }

    // Check/uncheck layer
    function checkLayer(id: string, checked: boolean) {
      const index = getIndexFromId(id);
      const temp = layers.value[index];
      layers.value.splice(index, 1);
      layers.value.splice(index, 0, temp);
      const defaultParent = layers.value;
      graphModel.setVisible(defaultParent[index], checked);
    }

    // Drag layers
    function dragLayer(newIndex: number) {
      const temp = layers.value[newIndex];
      graph.addCell(temp, graphModel.root, newIndex);
    }

    return {
      addLayer,
      changeLayerWindowCoordinates,
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
.layer-window
  div
    b-button(v-if='!show', @click='show = true', variant='primary') Show Layer Window
    b-card#layer-window-id.layer-window-card(
      no-body='',
      style='min-width: 20rem',
      header-tag='header',
      footer-tag='footer',
      v-show='show',
      v-resize,
      :class='{ "layer-window-maximize": isMin === false, "layer-window-minimize": isMin === true }'
    )
      template(#header='')
        span.mr-15.mb-0.float-left.layer Layers
        .layer-window-headerBtn
          span.cursor-pointer.layer-window-btn(
            aria-hidden='true',
            @click='isMin = !isMin',
            :title='!isMin ? "Minimize" : "Maximize"'
          )
            i.fa.fa-window-maximize.mr-1(v-if='isMin')
            i.fa.fa-window-minimize.mr-1(v-else)
          span.cursor-pointer.layer-window-btn(
            aria-hidden='true',
            @click='show = false; setLayerWindowCoordinates()',
            title='Close'
          )
            i.fa.fa-times.fa-lg.mr-1
      b-card-body.layer-window-card-body-main(v-if='!isMin')
        nested-layers(
          v-model='layers',
          :selectedLayer='selectedLayer',
          @edit-layer='editLayer',
          @change-selected-layer='changeSelectedLayer',
          @lock-layer='lockLayer',
          @check-layer='checkLayer',
          @drag-layer='dragLayer'
        )
      template(#footer='', v-if='!isMin')
        span.mr-15.cursor-pointer(aria-hidden='true', @click='deleteLayer', title='Delete Layer')
          i.fa.fa-trash.fa-lg.layer-window-footerBtn
        span#layer-window-moveSelectionBtn.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='isEnableBind ? moveSelection() : null',
          :title='isEnableBind ? "Move Selection to..." : "Disabled"',
          :class='{ isEnableBind: !isEnableBind, mxDisabled: !isEnableBind }'
        )
          i.fa.fa-share-square-o.fa-lg.layer-window-footerBtn
        span.mr-15.cursor-pointer(aria-hidden='true', @click='addLayer', title='Add Layer')
          i.fa.fa-plus.fa-lg.layer-window-footerBtn
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='duplicateLayer',
          title='Duplicate Layer'
        )
          i.fa.fa-clone.fa-md.layer-window-footerBtn

    b-card.layer-window-dropdown(
      v-if='isShow',
      :style='{ top: dropdownCoordinates.top + "px", left: dropdownCoordinates.left + "px" }'
    )
      b-card-body.layer-window-dropdownBody 
        b-row.layer-window-dropdownRow(
          :key='key',
          v-for='(layer, key) in layers',
          @click='selectLayerForMoveSelection(layer.id)'
        )
          span.layer-window-dropdownTick
            i.fa.fa-check(v-if='layer.id === dropDownId')
          span.dropdownLayerName {{ layer.value }}
</template>
