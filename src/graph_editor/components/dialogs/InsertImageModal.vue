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
import { mxConstants, mxEventObject, mxEventSource } from '../../lib/jgraph/mxClient.js';

interface ImageData {
  getProperty: FunctionStringCallback;
}

export default defineComponent({
  name: 'InsertImageModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const imageLink = ref(null);

    const cell = ref(null);

    function closeModal() {
      show.value = false;
      imageLink.value = '';
    }

    function loadImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
          resolve(image);
        });

        image.onerror = () => {
          alert('File not found');
        };
        image.src = url;
      });
    }

    function insertImage() {
      let cells = [];

      loadImage(imageLink.value).then((result: HTMLImageElement) => {
        const { editor } = props.editorUi;
        const { graph } = editor;
        const { width, height } = result;
        let select = null;

        graph.getModel().beginUpdate();

        try {
          // Inserts new cell if no cell is selected
          if (cell.value == null) {
            const pt = graph.getFreeInsertPoint();
            cells = [
              graph.insertVertex(
                graph.getDefaultParent(),
                null,
                '',
                pt.x,
                pt.y,
                width,
                height,
                'shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;',
              ),
            ];
            select = cells;
            graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
          } else {
            cells = cell.value;
          }
          graph.setCellStyles(
            mxConstants.STYLE_IMAGE,
            imageLink.value.length > 0 ? imageLink.value : null,
            cells,
          );

          // Sets shape only if not already shape with image (label or image)
          const style = graph.getCurrentCellStyle(cells[0]);

          if (
            style[mxConstants.STYLE_SHAPE] != 'image' &&
            style[mxConstants.STYLE_SHAPE] != 'label'
          ) {
            graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
          } else if (imageLink.value.length === 0) {
            graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
          }
        } finally {
          graph.getModel().endUpdate();
        }

        if (select != null) {
          graph.setSelectionCells(select);
          graph.scrollCellToVisible(select[0]);
        }
        closeModal();
      });
    }

    function openInsertImage() {
      show.value = true;
    }

    function editImage(_sender: typeof mxEventSource, event: ImageData) {
      show.value = true;
      imageLink.value = event.getProperty('image');
      cell.value = props.editorUi.editor.graph.getSelectionCells();
    }

    onMounted(() => {
      props.editorUi.addListener('openInsertImage', openInsertImage);
      props.editorUi.addListener('editImage', editImage);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openInsertImage);
    });

    return {
      closeModal,
      editImage,
      imageLink,
      insertImage,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, @hide='closeModal')
  template(v-slot:modal-header)
    h4 Insert Image
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3
    label Image URL:
  .row.ml-3
    input.txt-input.w-90(type='text', v-model='imageLink')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='insertImage')
      | Ok
</template>
