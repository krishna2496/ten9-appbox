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
import { EventBus } from '../eventbus';
import { defineComponent, nextTick, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'OpenFile',
  props: {
    editorType: {
      required: false,
      type: String,
      default: null,
    },
    editorList: {
      required: false,
      type: Object,
      default: null,
    },
    supportedExtension: {
      required: false,
      type: String,
      default: null,
    },
  },

  setup(_props, ctx) {
    const file = ref(null);
    const fileAcceptType = ref('');
    function chooseFile() {
      fileAcceptType.value = _props.supportedExtension;
      nextTick(() => {
        file.value.click();
      });
    }

    function loadDrawIoFile(selectedFile: File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        ctx.emit('file-loaded', fileData);
      };
      reader.readAsText(selectedFile);
    }

    function loadFile() {
      if (file.value.files.length > 0) {
        const { files } = file.value;
        const [fileValue] = files;
        const [selectedFile] = file.value.files;
        if (_props.editorType == _props.editorList.Spreadsheet) {
          EventBus.$emit('load-spread-sheet-file', fileValue);
        } else if (_props.editorType == _props.editorList.Graph) {
          // Read .draw, drawio,xml file
          loadDrawIoFile(selectedFile);
        } else {
          const { name } = fileValue;
          const suffixArr = name.split('.'),
            suffix = suffixArr[suffixArr.length - 1];
          if (suffix == 'xlsx' || suffix == 'sheet') {
            ctx.emit('set-editor-type', _props.editorList.Spreadsheet);
            nextTick(() => {
              EventBus.$emit('load-spread-sheet-file', fileValue);
            });
          } else {
            ctx.emit('set-editor-type', _props.editorList.Graph);
            nextTick(() => {
              loadDrawIoFile(selectedFile);
            });
          }
        }
      }
    }

    return {
      chooseFile,
      file,
      fileAcceptType,
      loadDrawIoFile,
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
    style='display: none',
    :accept='fileAcceptType',
    @change='loadFile'
  )
</template>
