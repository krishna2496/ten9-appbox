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
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'OpenFile',
  props: {
    acceptExtensions: {
      required: false,
      type: String,
      default: '',
    },
  },

  setup(_props, ctx) {
    const fileInput = ref<HTMLInputElement>(null);

    function openFile() {
      ctx.emit('file-opened', fileInput.value.files[0]);
    }

    function chooseFile() {
      fileInput.value.click();
    }

    return {
      chooseFile,
      fileInput,
      openFile,
    };
  },
});
</script>

<template lang="pug">
.btn-left
  b-button(@click='chooseFile', variant='info')
    | Open File
  input(
    ref='fileInput',
    type='file',
    value='Open File',
    style='display: none',
    :accept='acceptExtensions',
    @change='openFile'
  )
</template>
