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
import { mxEventSource } from '../../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';

interface ImagePropertyFunction {
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
  setup(props, ctx) {
    const show = ref<boolean>(false);

    const imageLink = ref(null);
    // TODO: Use type here
    const cell = ref(null);

    function closeModal() {
      show.value = false;
      imageLink.value = '';
    }

    function insertImage() {
      ctx.emit('insert-image', imageLink.value);
      closeModal();
    }

    function openInsertImage() {
      show.value = true;
    }

    function editImage(_sender: typeof mxEventSource, event: ImagePropertyFunction) {
      show.value = true;
      imageLink.value = event.getProperty('image');
      cell.value = props.editorUi.getSelectedCell();
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
    h6 Insert Image
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
