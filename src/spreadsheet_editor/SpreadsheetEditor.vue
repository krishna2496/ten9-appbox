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
import { defineComponent, ref, onMounted, nextTick } from '@vue/composition-api';

export default defineComponent({
  name: 'SpreadsheetEditor',
  setup() {
    const selected = ref('');
    const isMaskShow = ref(false);
    // const file = ref({});
    // const bgConfig = {};

    onMounted(() => {
      nextTick(() => {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        luckysheet.create({
          container: 'luckysheet',
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

    // Process the merged cell config data
    // function handleMergeData(origin) {
    //   let result = [];
    //   if (origin instanceof Object) {
    //     var r = 'r',
    //       c = 'c',
    //       cs = 'cs',
    //       rs = 'rs';
    //     for (var key in origin) {
    //       var startR = origin[key][r];
    //       var endR = origin[key][r];
    //       var startC = origin[key][c];
    //       var endC = origin[key][c];

    //       // If only one line is occupied 1 If two lines are occupied 2
    //       if (origin[key][cs] > 0) {
    //         endC = startC + (origin[key][cs] - 1);
    //       }
    //       if (origin[key][rs] > 0) {
    //         endR = startR + (origin[key][rs] - 1);
    //       }
    //       // s is the start coordinate of the merged cell e is the end coordinate
    //       var obj = { s: { r: startR, c: startC }, e: { r: endR, c: endC } };
    //       result.push(obj);
    //     }
    //   }
    //   return result;
    // }

    // function uploadExcel(evt) {
    //   const files = evt.target.files;
    //   if (files == null || files.length == 0) {
    //     alert('No files wait for import');
    //     return;
    //   }
    //   let name = files[0].name;
    //   let suffixArr = name.split('.'),
    //     suffix = suffixArr[suffixArr.length - 1];

    //   if (suffix != 'xlsx' && suffix != 'sheet') {
    //     alert('Currently only supports the import of xlsx and Luckysheet (.sheet) native files');
    //     return;
    //   }

    //   if (suffix == 'sheet') {
    //     readLuckySheetNativeFiles(files[0]);
    //     return;
    //   }

    //   readExcelFile(files[0]);
    // }

    // // Read xlsx files and load it in container
    // function readExcelFile(files) {
    //   LuckyExcel.transformExcelToLucky(files, function (exportJson, luckysheetfile) {
    //     if (exportJson.sheets == null || exportJson.sheets.length == 0) {
    //       alert(
    //         'Failed to read the content of the excel file, currently does not support xls files!',
    //       );
    //       return;
    //     }
    //     console.log(exportJson.sheets);
    //     window.luckysheet.destroy();

    //     window.luckysheet.create({
    //       container: 'luckysheet', //luckysheet is the container id
    //       showinfobar: false,
    //       data: exportJson.sheets,
    //       title: exportJson.info.name,
    //       userInfo: exportJson.info.name.creator,
    //     });
    //   });
    // }

    // // Read luckysheet native files and load it in container
    // function readLuckySheetNativeFiles(files) {
    //   var reader = new FileReader();
    //   reader.onload = (function (theFile) {
    //     return function (e) {
    //       try {
    //         let json = JSON.parse(e.target.result);
    //         luckysheet.create({
    //           container: 'luckysheet', //luckysheet is the container id
    //           showinfobar: false,
    //           data: json,
    //         });
    //       } catch (ex) {
    //         alert('Something went wrong');
    //       }
    //     };
    //   })(files);
    //   reader.readAsText(files);
    // }

    // function selectExcel(evt) {
    //   const value = selected.value;
    //   const name = evt.target.options[evt.target.selectedIndex].innerText;

    //   if (value == '') {
    //     return;
    //   }
    //   isMaskShow.value = true;

    //   LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson, luckysheetfile) => {
    //     if (exportJson.sheets == null || exportJson.sheets.length == 0) {
    //       alert(
    //         'Failed to read the content of the excel file, currently does not support xls files!',
    //       );
    //       return;
    //     }

    //     isMaskShow.value = false;
    //     window.luckysheet.destroy();

    //     window.luckysheet.create({
    //       container: 'luckysheet', //luckysheet is the container id
    //       showinfobar: false,
    //       data: exportJson.sheets,
    //       title: exportJson.info.name,
    //       userInfo: exportJson.info.name.creator,
    //     });
    //   });
    // }
    // function downloadExcel() {
    //   const value = selected.value;

    //   if (value.length == 0) {
    //     alert('Please select a demo file');
    //     return;
    //   }

    //   var elemIF = document.getElementById('Lucky-download-frame');
    //   if (elemIF == null) {
    //     elemIF = document.createElement('iframe');
    //     elemIF.style.display = 'none';
    //     elemIF.id = 'Lucky-download-frame';
    //     document.body.appendChild(elemIF);
    //   }
    //   elemIF.src = value;
    // }

    // function fileSave() {
    //   let allSheetData = luckysheet.getluckysheetfile();
    //   let exportName = 'luckysheet';
    //   var dataStr =
    //     'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allSheetData));
    //   var downloadAnchorNode = document.createElement('a');
    //   downloadAnchorNode.setAttribute('href', dataStr);
    //   downloadAnchorNode.setAttribute('download', exportName + '.sheet');
    //   document.body.appendChild(downloadAnchorNode); // required for firefox
    //   downloadAnchorNode.click();
    //   downloadAnchorNode.remove();
    // }

    return {
      selected,
      isMaskShow,
      // uploadExcel,
      // selectExcel,
      // downloadExcel,
      // fileSave,
      // handleMergeData,
      // readLuckySheetNativeFiles,
      // readExcelFile,
    };
  },
});
</script>

<template lang="pug">
div
  #luckysheet(
    style='margin: 0px; padding: 0px; position: absolute; width: 100%; left: 0px; top: 0px; bottom: 0px'
  )
  div(
    v-show='isMaskShow',
    style='position: absolute; z-index: 1000000; left: 0px; top: 0px; bottom: 0px; right: 0px; background: rgba(255, 255, 255, 0.8); text-align: center; font-size: 40px; align-items: center; justify-content: center; display: flex'
  )
    | Downloading
</template>
