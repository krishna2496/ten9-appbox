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
import { defineComponent, nextTick, onMounted, onUnmounted, ref } from '@vue/composition-api';
const { getImage } = require('./shape_images.ts');
const { mxEventObject } = require('../../lib/jgraph/mxClient.js');

const sidebarGeneralImage = getImage('general');

export default defineComponent({
  name: 'MoreShapesModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
    shapeLibraries: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const entries = ref<string>(null);

    const imageUrl = ref<string>(sidebarGeneralImage);

    const libs = ref<string[]>([]);

    const defaultSelected = ref<string>('');

    function closeModal() {
      show.value = false;

      // Reset image back to default
      nextTick(() => {
        imageUrl.value = sidebarGeneralImage;
      });
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
      props.editorUi.fireEvent(new mxEventObject('shape-libraries-changed'));
      closeModal();
    }

    function openMoreShapes() {
      show.value = true;
      entries.value = props.editorUi.sidebar.entries;
      const shapes = props.shapeLibraries;
      libs.value = shapes.split(';');
    }

    function selectShape(groupIndex: number, shapesIndex: number) {
      if (defaultSelected.value !== '') {
        const previousSelected: HTMLLabelElement = document.getElementById(
          `title${defaultSelected.value}`,
        ) as HTMLLabelElement;
        previousSelected.className = 'heading';
      }

      const label: HTMLLabelElement = document.getElementById(
        `title${groupIndex}${shapesIndex}`,
      ) as HTMLLabelElement;

      label.className = 'heading bg-light-blue';

      defaultSelected.value = `${groupIndex}${shapesIndex}`;
    }

    function showImage(shapesName: string, groupIndex: number, shapesIndex: number) {
      imageUrl.value = getImage(shapesName);
      selectShape(groupIndex, shapesIndex);
    }

    onMounted(() => {
      props.editorUi.addListener('moreShapes', openMoreShapes);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openMoreShapes);
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
    h6 Shapes
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-2.shapes
    .col-md-4.shape-modal-content.right-border
      template(v-for='(entry, groupIndex) in entries')
        label.row.bg-lightgray {{ entry.title }}
        template(v-for='(shape, shapesIndex) in entry.entries')
          .row
            .heading(
              @click='showImage(shape.id, groupIndex, shapesIndex)',
              :id='`title${groupIndex}${shapesIndex}`'
            )
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
