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
import { EventBus } from '../../eventbus';
import { defineComponent, ref, onMounted, nextTick } from '@vue/composition-api';
import LuckyExcel from 'luckyexcel';
import luckysheet from '../lib/index';

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
  name: 'SpreadsheetEditor',
  setup() {
    const selected = ref('');
    const isMaskShow = ref(false);

    onMounted(() => {
      nextTick(() => {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        luckysheet.create({
          container: 'spreadsheet-editor',
          title: 'Spreadsheet',
          lang: 'en',
          data: [
            {
              name: 'Sheet1',
              color: '',
              index: 1,
              status: 0,
              order: 1,
              celldata: [],
              config: {},
            },
            {
              name: 'Sheet2',
              color: '',
              index: 1,
              status: 0,
              order: 1,
              celldata: [],
              config: {},
            },
            {
              name: 'Sheet3',
              color: '',
              index: 2,
              status: 0,
              order: 2,
              celldata: [],
              config: {},
            },
          ],
        });
      });
    });

    const readSpreadsheetNativeFile = (files: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const jsonFile = reader.result as string;
          const fileView = JSON.parse(jsonFile);

          // @ts-ignore
          // eslint-disable-next-line no-undef
          luckysheet.create({
            container: 'spreadsheet-editor', //spreadsheet-editor is the container id
            showinfobar: false,
            data: fileView,
          });

          resolve(fileView);
        });
        reader.readAsText(files);
      });
    };

    const readExcel = (files: File) => {
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
          container: 'spreadsheet-editor', //spreadsheet-editor is the container id
          showinfobar: false,
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
        });
      });
    };

    EventBus.$on('load-spread-sheet-file', (fileValue: File) => {
      const { name } = fileValue;
      const suffixArr = name.split('.'),
        suffix = suffixArr[suffixArr.length - 1];

      if (suffix != 'xlsx' && suffix != 'sheet') {
        alert('Currently only supports the import of xlsx and Luckysheet (.sheet) native files');
        return;
      }

      // Read native files is (.sheet)
      if (suffix == 'sheet') {
        readSpreadsheetNativeFile(fileValue);
        return;
      }
      // Read excel file if selection is (.xlsx)
      readExcel(fileValue);
    });

    const supportedExtension = () => {
      return '.xlsx,.sheet';
    };

    const saveFile = () => {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const allSheetData = luckysheet.getluckysheetfile();
      const exportName = 'spredsheet';
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allSheetData));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', exportName + '.sheet');
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    return {
      selected,
      isMaskShow,
      readExcel,
      readSpreadsheetNativeFile,
      saveFile,
      supportedExtension,
    };
  },
});
</script>

<template lang="pug">
div
  #spreadsheet-editor
</template>
<style scoped>
#spreadsheet-editor {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
