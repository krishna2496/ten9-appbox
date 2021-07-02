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
import { CommonAppProps, CommonAppPropsOptions } from '@appsSupport/app_api';
import { defineComponent, onMounted, nextTick, watch } from '@vue/composition-api';
import { isString } from 'lodash';
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

interface SpreadsheetEditorProps extends CommonAppProps {}

export default defineComponent<SpreadsheetEditorProps>({
  name: 'SpreadsheetEditor',

  props: {
    ...CommonAppPropsOptions,
  },

  setup(props, ctx) {
    function getContentType() {
      return 'application/json';
    }

    function getContent() {
      const allSheetData = luckysheet.getluckysheetfile();
      return JSON.stringify(allSheetData);
    }

    const luckysheetDefaultData = [
      {
        name: 'Sheet1',
        color: '',
        index: 1,
        status: 0,
        order: 1,
        celldata: [] as unknown,
        config: {},
      },
    ];

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

    function loadExcelFile(file: File) {
      nextTick(() => {
        LuckyExcel.transformExcelToLucky(file, (exportJson: jsonSheet) => {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            throw Error(
              'Failed to read the content of the excel file, currently does not support xls files!',
            );
          }
          luckysheet.create({
            ...luckysheetDefaultOptions,
            data: exportJson.sheets,
          });
          luckysheet.setReadOnlyMode(!props.isEditing);
        });
      });
    }

    function loadContent(content: string) {
      try {
        let fileData;
        if (content) {
          fileData = JSON.parse(content);
        }
        luckysheet.create({
          ...luckysheetDefaultOptions,
          data: content ? fileData : luckysheetDefaultData,
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
      luckysheet.setReadOnlyMode(!props.isEditing);
    }

    // TODO: Support loading from file?
    // function loadSpreadsheetNativeFile(file: File) {
    //   const reader = new FileReader();
    //   reader.addEventListener('load', () => {
    //     const content = reader.result as string;
    //     loadContent(content);
    //   });
    //   reader.readAsText(file);
    // }

    // TODO: Support loading from file?
    // function loadContentFromFile(file: File) {
    //   if (file.name.indexOf('.') < 0) {
    //     throw Error(`No file extension found in file name (${file.name})`);
    //   }

    //   const ext = `.${file.name.split('.').pop()}`;

    //   // Read native files is (.sheet)
    //   if (ext === '.sheet') {
    //     loadSpreadsheetNativeFile(file);
    //   } else if (ext === '.xlsx') {
    //     loadExcelFile(file);
    //   } else {
    //     throw Error(`Unsupported extension: ${ext}`);
    //   }
    // }

    onMounted(() => {
      nextTick(() => {
        // TODO: Support loading from file?
        // if (props.file) {
        //   loadContentFromFile(props.file);
        // } else {
        loadContent(props.content as string);
        // }
      });
    });

    const resize = () => {
      try {
        luckysheet.resize();
      } catch (e) {
        // eat errors during resize
      }
    };

    /**
     * Content is not set immediately, we will watch it and set
     * the value when it is.
     */
    watch(
      () => props.content,
      (val) => {
        if (!isString(val)) return;
        if (getContent() !== val) {
          loadContent(val);
        }
      },
    );

    watch(
      () => props.isEditing,
      (val) => {
        luckysheet.setReadOnlyMode(!val);
      },
    );

    return {
      getContent,
      getContentType,
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
