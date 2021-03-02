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
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
const { mxEventObject } = require('../../lib/jgraph/mxClient.js');
export default defineComponent({
  name: 'MoreShapesModel',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const pageScaleValue = ref(null);

    const entries = ref(null);

    const imageUrl = ref('images/sidebar-general.png');

    const libs = ref([]);

    function closeModal() {
      show.value = false;
    }

    function addRemoveShape(shape: string) {
      if (libs.value.includes(shape)) {
        const index = libs.value.indexOf(shape);
        const indexPosition = -1;
        if (index > indexPosition) {
          libs.value.splice(index, 1);
        }
      } else {
        libs.value.push(shape);
      }
    }

    function isShapeExists(shape: string) {
      if (libs.value.includes(shape)) {
        return true;
      } else {
        return false;
      }
    }

    function loadShapes() {
      props.editorUi.sidebar.showEntries(libs.value.join(';'), false, true);
      // TEN9: fire shape-libraries-changed event
      props.editorUi.fireEvent(new mxEventObject('shape-libraries-changed'));
      closeModal();
    }

    function openmoreShapes() {
      show.value = true;
      entries.value = props.editorUi.sidebar.entries;
      const shapes = window.localStorage.getItem('shapeLibraries');
      libs.value = shapes.split(';');
    }

    function showImage(url: string) {
      imageUrl.value = url;
    }

    onMounted(() => {
      props.editorUi.addListener('moreShapes', openmoreShapes);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openmoreShapes);
    });

    return {
      addRemoveShape,
      closeModal,
      entries,
      imageUrl,
      isShapeExists,
      libs,
      loadShapes,
      pageScaleValue,
      showImage,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  ref='moreShapes',
  no-fade,
  size='lg',
  @hide='closeModal'
)
  template(v-slot:modal-header)
    h4 Shapes
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-2.shapes
    .col-md-4.shape-modal-content.right-border
      template(v-for='(entry, index) in entries')
        label.row.bg-lightgray {{ entry.title }}
        template(v-for='shape in entry.entries')
          .row
            input(
              type='checkbox',
              @change='addRemoveShape(shape.id)',
              :checked='isShapeExists(shape.id)'
            )
            label.ml-2(@click='showImage(shape.image)') {{ shape.title }}
    .col-md-8.shape-modal-content
      img(:src='imageUrl')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='loadShapes')
      | Apply
</template>
