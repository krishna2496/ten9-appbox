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

    function close() {
      show.value = false;
    }

    function getIndexFromId(id: string) {
      const index = layers.value.findIndex((layer) => layer['id'].toString() === id);
      return index;
    }

    function changeLayerWindowCoordinates() {
      layerWindow.value.style.top = layerWindowCoordinates.value.top + 'px';
      layerWindow.value.style.left = layerWindowCoordinates.value.left + 'px';
      layerWindow.value.style.height = layerWindowCoordinates.value.height + 'px';
      layerWindow.value.style.width = layerWindowCoordinates.value.width + 'px';

      const topDeviation = 22;
      const leftDeviation = 30;

      dropdownCoordinates.value.top = (
        parseInt(layerWindow.value.style.top) - topDeviation
      ).toString();
      dropdownCoordinates.value.left = (
        parseInt(layerWindow.value.style.left) + leftDeviation
      ).toString();
    }

    function changeSelectedLayer(id: string) {
      selectedLayer.value = id;
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
      if (props.editorUi.editor.graph.isEnabled()) {
        props.editorUi.editor.graph.setDefaultParent(defaultParent[index]);
        props.editorUi.editor.graph.view.setCurrentRoot(null);
      }
    }

    function openLayerWindow() {
      show.value = true;
      const timeOut = 10;
      layers.value = props.editorUi.editor.graph.model.root.children;
      if (!layers.value[0]['value']) {
        layers.value[0]['value'] = 'Background';
      }
      setTimeout(() => {
        layerWindow.value = document.getElementById('layerWindow');
        if (layerWindowCoordinates.value.top !== '') {
          changeLayerWindowCoordinates();
        } else {
          layerWindow.value.style.top = '120px';
          layerWindow.value.style.left = '590px';
        }
        layerWindow.value.style.opacity = '1';
      }, timeOut);
    }

    function changeSelectionStage(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      if (event.getProperty('selection')) {
        isEnableBind.value = true;
      } else {
        isEnableBind.value = false;
        isShow.value = false;
      }
    }

    onMounted(() => {
      props.editorUi.addListener('openLayerWindow', openLayerWindow);
      const ele: unknown = document.getElementsByClassName('card');
      dragElement.default(ele[1], 1);
      props.editorUi.editor.graph.addListener('changeSelectionStage', changeSelectionStage);
      document.addEventListener('click', (event) => {
        if (event.target['classList'][1] !== 'fa-share-square-o') {
          isShow.value = false;
        }
      });
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openLayerWindow);
    });

    function addLayer() {
      if (props.editorUi.editor.graph.isEnabled()) {
        props.editorUi.editor.graph.model.beginUpdate();
        try {
          const cell = props.editorUi.editor.graph.addCell(
            new mxCell(mxResources.get('untitledLayer')),
            props.editorUi.editor.graph.model.root,
          );
          cell['children'] = [];
          props.editorUi.editor.graph.setDefaultParent(cell);
        } finally {
          props.editorUi.editor.graph.model.endUpdate();
        }
      }
      changeSelectedLayer(layers.value[layers.value.length - 1].id);
    }

    function deleteLayer() {
      const i = getIndexFromId(selectedLayer.value);
      const defaultParent = layers.value;

      if (props.editorUi.editor.graph.isEnabled()) {
        props.editorUi.editor.graph.model.beginUpdate();
        try {
          const index = props.editorUi.editor.graph.model.root.getIndex(defaultParent[i]);
          props.editorUi.editor.graph.removeCells([defaultParent[i]], false);

          // Creates default layer if no layer exists
          if (
            props.editorUi.editor.graph.model.getChildCount(
              props.editorUi.editor.graph.model.root,
            ) == 0
          ) {
            props.editorUi.editor.graph.model.add(
              props.editorUi.editor.graph.model.root,
              new mxCell('Background'),
            );
            props.editorUi.editor.graph.setDefaultParent();
          } else if (
            index > 0 &&
            index <=
              props.editorUi.editor.graph.model.getChildCount(
                props.editorUi.editor.graph.model.root,
              )
          ) {
            props.editorUi.editor.graph.setDefaultParent(
              props.editorUi.editor.graph.model.getChildAt(
                props.editorUi.editor.graph.model.root,
                index - 1,
              ),
            );
          } else {
            props.editorUi.editor.graph.setDefaultParent(null);
          }
        } finally {
          props.editorUi.editor.graph.model.endUpdate();
        }
        changeSelectedLayer(layers.value[layers.value.length - 1].id);
      }
    }

    function duplicateLayer() {
      const index = getIndexFromId(selectedLayer.value);
      if (props.editorUi.editor.graph.isEnabled()) {
        let newCell = null;
        props.editorUi.editor.graph.model.beginUpdate();
        try {
          newCell = props.editorUi.editor.graph.cloneCell(layers.value[index]);
          newCell = props.editorUi.editor.graph.addCell(
            newCell,
            props.editorUi.editor.graph.model.root,
          );
          props.editorUi.editor.graph.setDefaultParent(newCell);
        } finally {
          changeSelectedLayer(newCell.id);
          props.editorUi.editor.graph.model.endUpdate();
        }

        if (newCell != null && !props.editorUi.editor.graph.isCellLocked(newCell)) {
          props.editorUi.editor.graph.selectAll(newCell);
        }
      }
    }

    function editLayer(id: string) {
      const index = getIndexFromId(id);
      props.editorUi.fireEvent(
        new mxEventObject('openLayerRenameDialog', 'layer', layers.value[index]),
      );
    }

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

    function moveSelection() {
      setLayerWindowCoordinates();
      layers.value.forEach((layer) => {
        if (
          props.editorUi.editor.graph.getSelectionCount() == 1 &&
          props.editorUi.editor.graph.model.isAncestor(
            layer,
            props.editorUi.editor.graph.getSelectionCell(),
          )
        ) {
          dropDownId.value = layer.id;
        }
      });
      if (isShow.value === true) {
        isShow.value = !isShow.value;
      }
      isShow.value = !isShow.value;
    }

    function selectLayerForMoveSelection(id: string) {
      dropDownId.value = id;
      const index = getIndexFromId(id);
      props.editorUi.editor.graph.moveCells(
        props.editorUi.editor.graph.getSelectionCells(),
        0,
        0,
        false,
        layers.value[index],
      );
      console.log('layers array after', layers.value);
      moveSelection();
    }

    function lockLayer(id: string, locked: boolean) {
      const index = getIndexFromId(id);
      const defaultParent = layers.value;
      if (props.editorUi.editor.graph.isEnabled()) {
        let value = null;
        if (locked) {
          value = '1';
        }
        props.editorUi.editor.graph.getModel().beginUpdate();
        try {
          props.editorUi.editor.graph.setCellStyles('locked', value, [defaultParent[index]]);
        } finally {
          props.editorUi.editor.graph.getModel().endUpdate();
        }

        if (value == '1') {
          props.editorUi.editor.graph.removeSelectionCells(
            props.editorUi.editor.graph.getModel().getDescendants(defaultParent[index]),
          );
        }
      }
    }

    function checkLayer(id: string, checked: boolean) {
      const index = getIndexFromId(id);
      const temp = layers.value[index];
      layers.value.splice(index, 1);
      layers.value.splice(index, 0, temp);
      const defaultParent = layers.value;
      props.editorUi.editor.graph.model.setVisible(defaultParent[index], checked);
    }

    function dragLayer(newIndex: number) {
      const temp = layers.value[newIndex];
      props.editorUi.editor.graph.addCell(temp, props.editorUi.editor.graph.model.root, newIndex);
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
    b-card#layerWindow.layercard(
      no-body='',
      style='min-width: 20rem',
      header-tag='header',
      footer-tag='footer',
      v-show='show',
      v-resize,
      :class='{ minHeight111: isMin === false, minHeight222: isMin === true }'
    )
      template(#header='')
        span.mr-15.mb-0.float-left.layer Layers
        .headerBtn
          span.cursor-pointer.btn(
            aria-hidden='true',
            @click='isMin = !isMin',
            :title='!isMin ? "Minimize" : "Maximize"'
          )
            i.fa.fa-window-maximize.mr-1(v-if='isMin')
            i.fa.fa-window-minimize.mr-1(v-else)
          span.cursor-pointer.btn(
            aria-hidden='true',
            @click='show = false; setLayerWindowCoordinates()',
            title='Close'
          )
            i.fa.fa-times.fa-lg.mr-1
      b-card-body.card-body-main(v-if='!isMin')
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
          i.fa.fa-trash.fa-lg.footerBtn
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='isEnableBind ? moveSelection() : null',
          :title='isEnableBind ? "Move Selection to..." : "Disabled"',
          :class='{ isEnableBind: !isEnableBind, mxDisabled: !isEnableBind }'
        )
          i.fa.fa-share-square-o.fa-lg.footerBtn
        span.mr-15.cursor-pointer(aria-hidden='true', @click='addLayer', title='Add Layer')
          i.fa.fa-plus.fa-lg.footerBtn
        span.mr-15.cursor-pointer(
          aria-hidden='true',
          @click='duplicateLayer',
          title='Duplicate Layer'
        )
          i.fa.fa-clone.fa-md.footerBtn

    b-card.dropdown(
      v-if='isShow',
      :style='{ top: dropdownCoordinates.top + "px", left: dropdownCoordinates.left + "px" }'
    )
      b-card-body.dropdownBody 
        b-row.dropdownRow(
          :key='key',
          v-for='(layer, key) in layers',
          @click='selectLayerForMoveSelection(layer.id)'
        )
          span.dropdownTick
            i.fa.fa-check(v-if='layer.id === dropDownId')
          span.dropdownLayerName {{ layer.value }}
</template>

<style lang="scss" scoped>
.layercard {
  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  height: auto;
  opacity: 0;
  resize: both;
}

.layer {
  margin-right: 202px;
  width: 85%;
  margin-left: 10px;
  font-weight: 600;
}

.card-header {
  display: inline-flex;
  padding: 0;
  height: 40px;
  cursor: move;
}

.minHeight222 {
  min-height: 40px;
  max-height: 40px;
}

.minHeight111 {
  height: 165px;
  min-height: 165px;
}

.card-body-main {
  padding: 0;
  background-color: #dcdcdc !important;
  overflow-y: scroll;
}

ul {
  list-style: none;
}

.footerBtn {
  margin-left: 13px;
  color: gray;
}

.footerBtn:hover {
  color: black;
}

.fa-trash.footerBtn {
  margin-left: 8px;
}

.isEnableBind {
  color: lightgray;
}

.dropdownRow {
  padding: 5px;
}

.dropdownRow:hover {
  background-color: lightgray;
  cursor: pointer;
}

.dropdownTick {
  min-width: 30px;
  padding: 0 5px;
}

.dropdown {
  margin: 0;
  height: fit-content;
  position: relative;
}

.card-body {
  padding: 0 !important;
}

.card {
  padding: 0;
  width: 180px;
}

.txt-input {
  border: 1px solid #ddd;
  padding: 5px 10px;
}

.close {
  cursor: pointer;
}

.bgLightPink {
  background: lightpink;
}

.card-header span img,
.card-footer span img,
.card-body span img {
  width: 20px;
  cursor: pointer;
}

.headerBtn {
  width: 15%;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0;
  height: 70%;
  margin: auto 0;
  margin-right: 3%;
  background-color: transparent !important;
  border-color: transparent !important;
}

.card-footer {
  padding: 7px 0;
  background-color: #fafafa;
}
</style>
