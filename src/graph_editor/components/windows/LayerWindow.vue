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
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import NestedLayers from './NestedLayer.vue';
import resize from 'vue-resize-directive';
const { mxEventSource, mxEventObject } = require('../../lib/jgraph/mxClient');

const dragElement = require('./Drag.ts');

// interface LayerProperty {
//   id: string;
//   name: string;
//   lock: boolean;
//   checked: boolean;
//   selected: boolean;
// }

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
  setup(props, context) {
    const show = ref<boolean>(false);
    const isEnableBind = ref<boolean>(false);
    const layers = ref<LayerProperty>();
    const isShow = ref<boolean>(false);
    // const dropDownId = ref<number>(layers.value[layers.value.length - 1].id);
    const dropdownCoordinates = ref<dropdownCoordinates>({ top: '97', left: '622' });

    const selectedLayer = ref<string>('1');
    const layerWindow = ref<coordinateProperty>();
    const layerWindowCoordinates = ref<{
      left: string;
      top: string;
      height: string;
      width: string;
    }>({ left: '', top: '', height: '', width: '' });

    // const defaultLayer = ref({
    //   id: 0,
    //   name: 'Untitled Layer',
    //   lock: false,
    //   checked: true,
    //   selected: false,
    // });

    function close() {
      show.value = false;
    }

    function changeLayerWindowCoordinates() {
      layerWindow.value.style.top = layerWindowCoordinates.value.top + 'px';
      layerWindow.value.style.left = layerWindowCoordinates.value.left + 'px';
      layerWindow.value.style.height = layerWindowCoordinates.value.height + 'px';
      layerWindow.value.style.width = layerWindowCoordinates.value.width + 'px';
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

    const isMin = ref<boolean | undefined>(false);

    const editLayerName = ref<string>('');
    const editLayerId = ref<string>('');

    function changeSelectedLayer(id: string) {
      selectedLayer.value = id;
    }

    function addLayer() {
      // const layer = defaultLayer.value;
      // layer.id = Math.random();
      // const tempRef = {
      //   ...layer,
      // };
      // layers.value.unshift(tempRef);
      // changeSelectedLayer(layer.id);
    }

    function deleteLayer() {
      // layers.value = layers.value.filter((o: LayerProperty) => {
      //   // if (o.layers) return (o.layers = o.layers.filter(f)).length;
      //   return o.id != selectedLayer.value;
      // });
      // if (layers.value.length === 0) {
      //   layers.value.unshift({
      //     id: Math.random(),
      //     name: 'Background',
      //     lock: false,
      //     checked: true,
      //     selected: false,
      //   });
      // }
      // changeSelectedLayer(layers.value[layers.value.length - 1].id);
    }

    function duplicateLayer() {
      // const temp = layers.value.find((layer) => layer.id === selectedLayer.value);
      // const duplicate = { ...temp };
      // duplicate.id = Math.random();
      // layers.value.push(duplicate);
    }

    function editLayer(id: string, name: string) {
      editLayerName.value = name;
      editLayerId.value = id;
      context.root.$bvModal.show('renameLayer');
    }

    function editLayerFinal() {
      // const edit = layers.value.find((layer) => layer['id'].toString() === editLayerId.value);
      // edit['value'] = editLayerName.value;
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

      const topDeviation = 22;
      const leftDeviation = 30;

      dropdownCoordinates.value.top = (parseInt(layerWindowStyleTop[0]) - topDeviation).toString();
      dropdownCoordinates.value.left = (
        parseInt(layerWindowStyleLeft[0]) + leftDeviation
      ).toString();

      changeLayerWindowCoordinates();
    }

    function moveSelection() {
      // const timeOut = 150;
      // if (isShow.value === true) {
      //   setTimeout(() => {
      //     isShow.value = !isShow.value;
      //   }, timeOut);
      // }
      // isShow.value = !isShow.value;
      // setLayerWindowCoordinates();
      // props.editorUi.editor.graph.moveCells(
      //   props.editorUi.editor.graph.getSelectionCells(),
      //   0,
      //   0,
      //   false,
      //   null,
      // );
    }

    // function selectLayerForMoveSelection(id: string) {
    //   const timeOut = 300;
    //   dropDownId.value = id;
    //   setTimeout(() => {
    //     moveSelection();
    //   }, timeOut);
    // }

    function getIndexFromId(id: string) {
      const index = layers.value.findIndex((layer) => layer['id'].toString() === id);
      return index;
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
      const defaultParent = layers.value;
      props.editorUi.editor.graph.model.setVisible(defaultParent[index], checked);
      defaultParent[index].style = checked.toString();
    }

    return {
      addLayer,
      changeLayerWindowCoordinates,
      changeSelectedLayer,
      checkLayer,
      close,
      deleteLayer,
      dropdownCoordinates,
      // dropDownId,
      duplicateLayer,
      editLayerFinal,
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
      show,
      // selectLayerForMoveSelection,
      setLayerWindowCoordinates,
      // updateLayers,
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
          span.cursor-pointer.btn(aria-hidden='true', @click='show = false', title='Close')
            i.fa.fa-times.fa-lg.mr-1
      b-card-body.card-body-main(v-if='!isMin')
        nested-layers(
          v-model='layers',
          :selectedLayer='selectedLayer',
          @editLayer='editLayer',
          @changeSelectedLayer='changeSelectedLayer',
          @lockLayer='lockLayer',
          @checkLayer='checkLayer'
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

    //- b-card.dropdown(
    //-   v-if='isShow',
    //-   :style='{ top: dropdownCoordinates.top + "px", left: dropdownCoordinates.left + "px" }'
    //- )
    //-   b-card-body.dropdownBody 
    //-     b-row.dropdownRow(
    //-       :key='key',
    //-       v-for='(layer, key) in layers',
    //-       @click='selectLayerForMoveSelection(layer.id)'
    //-     )
    //-       span.dropdownTick
    //-         i.fa.fa-check(v-if='layer.id === dropDownId')
    //-       span.dropdownLayerName {{ layer.name }}

    //- b-modal#renameLayer(
    //-   ref='modal',
    //-   title='Edit Layer Name',
    //-   ok-title='Rename',
    //-   @ok='editLayerFinal'
    //- )
    //-   b-form
    //-     b-row
    //-       b-col(cols='2')
    //-         label(for='edit111') Name :
    //-       b-col(cols='10')
    //-         b-form-input#edit111(v-model='editLayerName')
</template>

<style lang="scss" scoped>
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

.layercard {
  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  height: auto;
  opacity: 0;
  resize: both;
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

  /* height: auto; */
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
}

.card-body {
  padding: 0 !important;
}

.card {
  padding: 0;
  width: 180px;
}

/* --------------------------- */

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
