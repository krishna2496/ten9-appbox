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
import luckysheet from '../lib/luckysheet';
import { defineComponent, onMounted, nextTick } from '@vue/composition-api';
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
  name: 'SpreadsheetEditor',
  setup(_props, ctx) {
    const luckysheetDefaultOptions = {
      container: 'luckysheet',
      lang: 'en',
      showinfobar: false,
      hook: {
        updated: () => {
          ctx.emit('content-changed', true);
        },
      },
    };

    onMounted(() => {
      nextTick(() => {
        luckysheet.create({
          ...luckysheetDefaultOptions,
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
          ],
        });
      });
    });

    function loadExcelFile(file: File) {
      LuckyExcel.transformExcelToLucky(file, (exportJson: jsonSheet) => {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          console.error(
            'Failed to read the content of the excel file, currently does not support xls files!',
          );
          return;
        }
        luckysheet.destroy();

        luckysheet.create({
          ...luckysheetDefaultOptions,
          data: exportJson.sheets,
        });
      });
    }

    function loadContent(content: string) {
      try {
        if (!content) return;
        const fileData = JSON.parse(content);
        luckysheet.destroy();
        luckysheet.create({
          ...luckysheetDefaultOptions,
          data: fileData,
        });
      } catch (e) {
        if (e instanceof SyntaxError) {
          // Create a file and load excel file
          const file = new File([content], 'file.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          loadExcelFile(file);
        } else {
          throw e;
        }
      }
    }

    function loadSpreadsheetNativeFile(file: File) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const content = reader.result as string;
        loadContent(content);
      });
      reader.readAsText(file);
    }

    function loadContentFromFile(file: File) {
      if (file.name.indexOf('.') < 0) {
        console.error(`No file extension found in file name (${file.name})`);
      }

      const ext = `.${file.name.split('.').pop()}`;

      // Read native files is (.sheet)
      if (ext === '.sheet') {
        loadSpreadsheetNativeFile(file);
      } else if (ext === '.xlsx') {
        loadExcelFile(file);
      } else {
        console.error(`Unsupported extension: ${ext}`);
      }
    }

    function getContent() {
      const allSheetData = luckysheet.getluckysheetfile();
      return JSON.stringify(allSheetData);
    }

    function getContentType() {
      return 'application/json';
    }

    const resize = () => {
      luckysheet.resize();
    };

    return {
      getContent,
      getContentType,
      loadContent,
      loadContentFromFile,
      resize,
    };
  },
});
</script>

<template lang="pug">
div
  #luckysheet
</template>
<style scoped>
#luckysheet {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
