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
import ScratchpadShape from './ScratchpadShape.vue';
import { mxCell, mxEventObject, mxEventSource } from '../../lib/jgraph/mxClient.js';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

interface InsertLinkObject {
  length: number;
  cell?: typeof mxCell;
  value?: string;
}

interface ScratchpadData {
  getProperty?(propName: string): InsertLinkObject;
}

interface imageData {
  data: string;
  w: number;
  h: number;
  aspect: string;
  title: string;
  xml?: string;
}

export default defineComponent({
  name: 'ScratchpadModal',
  components: {
    ScratchpadShape,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);
    // TODO: Use type here
    const shapes = ref([]);

    const shapesHtml = ref<string[]>([]);

    const textBoxIndex = ref<number[]>([]);

    const visible = new Set();

    function closeModal() {
      show.value = false;
      shapes.value = [];
      shapesHtml.value = [];
      textBoxIndex.value = [];
    }

    function saveScratchpad() {
      for (let i = 0; i < textBoxIndex.value.length; i++) {
        const textBox: HTMLInputElement = document.getElementById(`txt${i}`) as HTMLInputElement;
        if (shapes.value[i].title != undefined) {
          shapes.value[i].title = textBox.value;
        } else {
          shapes.value[i].title = textBox.value;
        }
      }
      const xml = props.editorUi.createLibraryDataFromImages(shapes.value);
      props.editorUi.fireEvent(new mxEventObject('scratchpadDataChanged', 'detail', xml));
      closeModal();
    }

    function scratchpadModal(_sender: typeof mxEventSource, event: ScratchpadData) {
      //this.graph.getSelectionCount()
      const images = event.getProperty('scratchpad');

      if (images != null) {
        for (let i = 0; i < images.length; i++) {
          const img: imageData = images[i];
          shapes.value.push(img);
          textBoxIndex.value.push(i);
        }
      }
      show.value = true;
    }

    function removeShape(index: number) {
      const tempShapes = shapes.value;
      tempShapes.splice(index, 1);
      shapes.value = [];

      nextTick(() => {
        shapes.value = tempShapes;
      });

      textBoxIndex.value.splice(index, 1);
    }

    onMounted(() => {
      props.editorUi.addListener('scratchpadModal', scratchpadModal);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(scratchpadModal);
    });

    return {
      closeModal,
      removeShape,
      saveScratchpad,
      shapes,
      shapesHtml,
      show,
      textBoxIndex,
      visible,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  ref='scratchpad',
  no-fade,
  size='lg',
  @hide='closeModal'
)
  template(v-slot:modal-header)
    h6 Scratchpad
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  //- .row.shape-modal-content
    //- .col-sm-4.col-md-2.mt-4(v-for='(div, index) in shapesHtml', v-html='div')
    //- br
  .row
    //-.scratchpad-data.col-md-3(v-for='(shape, index) in shapes', :key='"shape" + index')
    scratchpad-shape.scratchpad-data.col-md-3(
      v-for='(shape, index) in shapes',
      :key='"shape" + index',
      :editorUi='editorUi',
      :shape='shape',
      :index='index',
      @remove-shape='removeShape'
    )
  template(#modal-footer='')
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='saveScratchpad')
      | Apply
</template>
