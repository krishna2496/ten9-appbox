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
import LuckyExcel from 'luckyexcel';

interface simpleInt {
  name: string;
  color: string;
  index: number;
}

interface typeOfSheetsJsonCreator {
  creator: number;
}

interface typeOfSheetsJson {
  name: typeOfSheetsJsonCreator;
}

type typeOfSheets = simpleInt[];
interface jsonSheet {
  sheets: typeOfSheets;
  info: typeOfSheetsJson;
}

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
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const jsonFile = reader.result as string;
          const fileView = JSON.parse(jsonFile);

          // @ts-ignore
          // eslint-disable-next-line no-undef
          luckysheet.create({
            container: 'luckysheet', //luckysheet is the container id
            showinfobar: false,
            data: fileView,
          });

          resolve(fileView);
        });
        reader.readAsText(files);
      });
    }

    function readExcelFile(files: File) {
      LuckyExcel.transformExcelToLucky(files, (exportJson: jsonSheet) => {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert(
            'Failed to read the content of the excel file, currently does not support xls files!',
          );
          return;
        }
        // @ts-ignore
        // eslint-disable-next-line no-undef
        luckysheet.destroy();

        // @ts-ignore
        // eslint-disable-next-line no-undef
        luckysheet.create({
          container: 'luckysheet', //luckysheet is the container id
          showinfobar: false,
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
        });
      });
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

          // Read native files is (.sheet)
          if (suffix == 'sheet') {
            readLuckySheetNativeFiles(fileValue);
            return;
          }
          // Read excel file if selection is (.xlsx)
          readExcelFile(fileValue);
        } else if (_props.editorType == _props.editorList.Graph) {
          // Read .draw, drawio,xml file
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
  button(@click='chooseFile', :disabled='_props.editorType == _props.editorList.None')
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
