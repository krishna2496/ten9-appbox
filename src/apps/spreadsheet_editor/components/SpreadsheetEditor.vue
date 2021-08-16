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
import { getAppInfo } from '../index';
import luckysheet from '../lib/luckysheet';
import imageCtrl from '../lib/luckysheet/controllers/imageCtrl';
import sheetmanage from '../lib/luckysheet/controllers/sheetmanage';
import Store from '../lib/luckysheet/store/index';
import {
  canLoadFile as canLoadFileHelper,
  CommonAppProps,
  CommonAppPropsOptions,
} from '@appsSupport/app_api';
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
    const sheetsToRefresh = new Set();

    function updateImage(imageId: string, imageSrc: string) {
      const index = sheetmanage.getSheetIndex(Store.currentSheetIndex);

      imageCtrl.images[imageId].src = imageSrc;
      Store.luckysheetfile[index].images = imageCtrl.images;
      document.querySelector(`#${imageId} img`).setAttribute('src', imageSrc);
    }

    function onUpdated() {
      ctx.emit('content-changed', true);
    }

    async function refreshCellLinks(imageId: string, dataSrc: string) {
      const { url: newImageSrc } = await props.refreshLinkHandler(dataSrc);

      if (newImageSrc && dataSrc !== newImageSrc) {
        updateImage(imageId, newImageSrc);
        // Luckysheet doesn't fire an updated hook on image update so we'll call it ourselves
        onUpdated();
      }
    }

    function onWorksheetActivateAfter(sheetIndex: number) {
      if (sheetsToRefresh.has(sheetIndex)) {
        const index = sheetmanage.getSheetIndex(sheetIndex);
        if (Store.luckysheetfile[index].images) {
          const allImages = Store.luckysheetfile[index].images;

          for (const [key] of Object.entries(allImages)) {
            refreshCellLinks(key, allImages[key].src);
          }
        }
        sheetsToRefresh.delete(sheetIndex);
      }
    }

    function onWorkbookCreateAfter() {
      sheetsToRefresh.clear();

      for (const [key] of Object.entries(Store.luckysheetfile)) {
        sheetsToRefresh.add(Store.luckysheetfile[key].index);
      }

      // The initial worksheet is not activated so we'll call the hook ourselves
      onWorksheetActivateAfter(Store.currentSheetIndex);
    }

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
        updated: onUpdated,
        workbookCreateAfter: onWorkbookCreateAfter,
        sheetActivate: onWorksheetActivateAfter,
      },
    };

    function loadExcelFile(file: File) {
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
        throw Error(`No file extension found in file name (${file.name})`);
      }

      const ext = `.${file.name.split('.').pop()}`;

      // Read native files is (.sheet)
      if (ext === '.sheet') {
        loadSpreadsheetNativeFile(file);
      } else if (ext === '.xlsx') {
        loadExcelFile(file);
      } else {
        throw Error(`Unsupported extension: ${ext}`);
      }
    }

    onMounted(() => {
      nextTick(() => {
        loadContent(props.content as string);
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

    async function canLoadFile(file: File): Promise<boolean> {
      return await canLoadFileHelper(getAppInfo(), file);
    }

    function loadImage(url: string): Promise<string> {
      const last = Store.luckysheet_select_save[Store.luckysheet_select_save.length - 1];
      const rowIndex = last.row_focus || 0;
      const colIndex = last.column_focus || 0;
      const left = colIndex == 0 ? 0 : Store.visibledatacolumn[colIndex - 1];
      const top = rowIndex == 0 ? 0 : Store.visibledatarow[rowIndex - 1];

      return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
          const { width } = image,
            { height } = image;

          const img = {
            src: url,
            left: left,
            top: top,
            originWidth: width,
            originHeight: height,
          };
          const imageId = imageCtrl.addImgItem(img);

          resolve(imageId);
        });

        image.onerror = () => {
          if (!url.startsWith('data:')) {
            ctx.emit('paste-text', url);
          }
        };
        image.src = url;
      });
    }

    async function insertImage(dataUri: string) {
      return await loadImage(dataUri);
    }

    watch(
      () => props.isEditing,
      (val) => {
        // cancelActiveImgItem
        if (!val && imageCtrl.images) {
          imageCtrl.cancelActiveImgItem();
        }
        luckysheet.setReadOnlyMode(!val);
      },
    );

    return {
      canLoadFile,
      getContent,
      getContentType,
      insertImage,
      loadContent,
      loadContentFromFile,
      loadExcelFile,
      resize,
      updateImage,
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
