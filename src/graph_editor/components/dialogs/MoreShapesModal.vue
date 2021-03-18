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

    const entries = ref<string>(null);

    const imageUrl = ref<string>('images/sidebar-general.png');

    const libs = ref([]);

    const defaultSelected = ref<string>('');

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

    function selectShape(ind: number, index: number) {
      if (defaultSelected.value !== '') {
        const previousSelected: HTMLLabelElement = document.getElementById(
          `title${defaultSelected.value}`,
        ) as HTMLLabelElement;
        previousSelected.className = 'heading';
      }

      const label: HTMLLabelElement = document.getElementById(
        `title${ind}${index}`,
      ) as HTMLLabelElement;

      label.className = 'heading bg-light-blue';

      defaultSelected.value = ind.toString() + '' + index.toString();
    }

    function showImage(url: string, ind: number, index: number) {
      imageUrl.value = url;
      selectShape(ind, index);
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
      defaultSelected,
      entries,
      imageUrl,
      isShapeExists,
      libs,
      loadShapes,
      selectShape,
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
      template(v-for='(entry, ind) in entries')
        label.row.bg-lightgray {{ entry.title }}
        template(v-for='(shape, index) in entry.entries')
          .row
            .heading(@click='showImage(shape.image, ind, index)', :id='`title${ind}${index}`')
              input(
                type='checkbox',
                @change='addRemoveShape(shape.id)',
                :checked='isShapeExists(shape.id)'
              )
              label.ml-2.mb-0 {{ shape.title }}
    .col-md-8.shape-modal-content
      img.full-width(:src='imageUrl')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='loadShapes')
      | Apply
</template>
