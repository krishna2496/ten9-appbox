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

  setup(_props, ctx) {
    const file = ref(null);

    function chooseFile() {
      file.value.click();
    }

    function loadFile() {
      if (file.value.files.length > 0) {
        let [selectedFile] = file.value.files;
        let reader = new FileReader();
        reader.onload = (e) => {
          const fileData = e.target.result;
          ctx.emit('file-loaded', fileData);
        };
        reader.readAsText(selectedFile);
      }
    }

    return {
      chooseFile,
      file,
      loadFile,
    };
  },
});
</script>

<template lang="pug">
.btn-left
  button(@click='chooseFile')
    | Open File
  input(
    ref='file',
    type='file',
    value='Open File',
    style='display:none;',
    accept='.draw, .drawio, .xml',
    @change='loadFile'
  )
</template>
