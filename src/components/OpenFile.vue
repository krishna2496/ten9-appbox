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
  },

  setup(_props, ctx) {
    const file = ref(null);
    const fileAcceptType = ref('');
    function chooseFile() {
      if (_props.editorType == _props.editorList.Spreadsheet) {
        fileAcceptType.value = '.xlsx,.sheet';
      } else if (_props.editorType == _props.editorList.Graph) {
        fileAcceptType.value = '.draw, .drawio, .xml';
      }
      nextTick(() => {
        file.value.click();
      });
    }

    // Read luckysheet native files and load it in container
    function readLuckySheetNativeFiles(files: File) {
      const reader = new FileReader();
      reader.onload = (() => {
        return (e: any) => {
          try {
            const json = JSON.parse(e.target.result);

            // @ts-ignore
            // eslint-disable-next-line no-undef
            luckysheet.create({
              container: 'luckysheet', //luckysheet is the container id
              showinfobar: false,
              data: json,
            });
          } catch (ex) {
            alert('Something went wrong');
          }
        };
      })();
      reader.readAsText(files);
    }

    function loadFile() {
      if (file.value.files.length > 0) {
        if (_props.editorType == _props.editorList.Spreadsheet) {
          const { files } = file.value;
          const [fileValue] = files;
          const { name } = fileValue;
          const suffixArr = name.split('.'),
            suffix = suffixArr[suffixArr.length - 1];

          if (suffix != 'xlsx' && suffix != 'sheet') {
            alert(
              'Currently only supports the import of xlsx and Luckysheet (.sheet) native files',
            );
            return;
          }

          if (suffix == 'sheet') {
            readLuckySheetNativeFiles(fileValue);
            return;
          }
          // readExcelFile(files[0]);
        } else if (_props.editorType == _props.editorList.Graph) {
          const [selectedFile] = file.value.files;
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileData = e.target.result;
            ctx.emit('file-loaded', fileData);
          };
          reader.readAsText(selectedFile);
        }
      }
    }

    return {
      chooseFile,
      file,
      fileAcceptType,
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
