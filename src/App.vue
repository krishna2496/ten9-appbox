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
import GraphEditor from './graph_editor/components/GraphEditor.vue';
import SpreadsheetEditor from './spreadsheet_editor/components/SpreadsheetEditor.vue';
import OpenFile from './components/OpenFile.vue';
import { mxCell } from './graph_editor/lib/jgraph/mxClient';
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import { debounce } from 'lodash';

interface EventFileInfo {
  file?: File;
  size?: number;
  lastModified?: number;
  what?: string;
  imageData?: string;
}

interface FileLogEvent extends EventFileInfo {
  title: string;
}

const DEFAULT_SHAPE_LIBRARIES = 'general;basic;arrows2;clipart;flowchart';
const DEFAULT_SCRATCHPAD_DATA = '<mxlibrary>[]</mxlibrary>';
const DEFAULT_THEME = 'kennedy';

enum EditorList {
  None = 'NONE',
  Graph = 'GRAPH',
  Spreadsheet = 'SPREADSHEET',
}

export default defineComponent({
  name: 'App',
  components: {
    GraphEditor,
    OpenFile,
    SpreadsheetEditor,
  },

  setup() {
    const logs = ref([]);

    const editor = ref(null);

    const previewMode = ref(false);

    const shapeLibraries = ref('');

    const scratchpadData = ref('');

    const theme = ref('');

    const recentColors = ref('');

    const editorType = ref(EditorList.None);

    const spreadsheet = ref(null);

    const supportedExtension = ref('.xlsx,.sheet,.draw, .drawio, .xml');

    function getShapeLibrariesFromStorage() {
      return window.localStorage.getItem('shapeLibraries');
    }

    function getScratchpadData() {
      return window.localStorage.getItem('scratchpadData');
    }

    function getThemeData() {
      return window.localStorage.getItem('theme');
    }

    function saveShapeLibrariesToStorage(libraries: string) {
      window.localStorage.setItem('shapeLibraries', libraries);
    }

    function saveScratchpadDataToStorage(xml: string) {
      window.localStorage.setItem('scratchpadData', xml);
    }

    function getRecentColorFromStorage() {
      return window.localStorage.getItem('recentColors');
    }

    function saveRecentColorsToStorage(colors: string) {
      window.localStorage.setItem('recentColors', colors);
    }

    function getEditorType() {
      return editorType.value;
    }

    function updateAppHeight() {
      const container = document.getElementById('container');
      const rect = container.getBoundingClientRect();
      const contentPadding = 20;
      const bottomMargin = 5;
      const newHeight = window.innerHeight - rect.top - contentPadding - bottomMargin;
      container.style.height = `${newHeight}px`;

      nextTick(() => {
        if (getEditorType() === EditorList.Spreadsheet) {
          const isLuckySheetLoaded = document.querySelector<HTMLElement>('.luckysheet');
          if (isLuckySheetLoaded) {
            spreadsheet.value.resizeEditor();
          }
        } else if (getEditorType() === EditorList.Graph) {
          editor.value.editorUiRef.refresh();
        }
      });
    }

    const debounceTime = 100;
    const onResize = debounce(() => {
      updateAppHeight();
    }, debounceTime);

    function addLog(fileLogEvent: FileLogEvent) {
      if (fileLogEvent.file) {
        logs.value.push(fileLogEvent.file);
      } else {
        logs.value.push(fileLogEvent);
      }

      nextTick(() => {
        const logsList = document.getElementById('logs-list');
        if (logsList) {
          logsList.scrollTop = logsList.scrollHeight;
        }
      });
    }

    function insertDummyImage(dataUri: string) {
      // add a dummy image to graph to emulate what will happen in production app
      editor.value.insertImage(dataUri).then((result: typeof mxCell) => {
        const waitingTime = 3000;
        setTimeout(() => {
          const newUrl = 'https://www.gettyimages.in/gi-resources/images/500px/983794168.jpg';
          editor.value.updateCellImage(result, newUrl);
        }, waitingTime);
      });
    }

    function refreshLink(url: string): Promise<string> {
      return new Promise((resolve) => {
        const newUrl = new URL(url);
        newUrl.hash += 'a';
        resolve(newUrl.toString());
      });
    }

    function loadFileData(xmlData: string) {
      editor.value.loadXmlData(xmlData);
      editor.value.fitCurrentPageWindow();
    }

    function onFileDropped(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'File Dropped',
        ...event,
      };

      addLog(fileLogEvent);
      const fileType = fileLogEvent.file.type.split('/');
      if (fileType[0] === 'image') {
        insertDummyImage(fileLogEvent.imageData);
      } else {
        const url = 'https://www.google.com';
        editor.value.insertFile(fileLogEvent.file, url);
      }
    }

    function onImagePasted(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'Image Pasted',
        ...event,
      };
      addLog(fileLogEvent);
      insertDummyImage(fileLogEvent.imageData);
    }

    function saveXmlFile(xmlData: string) {
      const filename = 'diagram';
      const ext = 'draw';

      const blob = new Blob([xmlData], { type: 'application/xml' });

      const a = document.createElement('a');
      a.download = `${filename}.${ext}`;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = `${ext}:${a.download}:${a.href}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 0);
    }

    function saveFile() {
      // if (editor.value.graph.isEditing()) {
      //   editor.valule.graph.stopEditing();
      // }
      if (EditorList.Graph == editorType.value) {
        const xmlData = editor.value.getXmlData();
        saveXmlFile(xmlData);
      } else {
        spreadsheet.value.saveFile();
      }
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        saveFile();
      }
    }

    function onGraphChanged(what: string) {
      const xmlData = editor.value.getXmlData();
      const fileLogEvent: FileLogEvent = {
        title: 'Graph Changed',
        size: xmlData.length,
        lastModified: Date.now(),
        what: what,
      };
      addLog(fileLogEvent);
    }

    function onThemeChanged(themeName: string) {
      window.localStorage.setItem('theme', themeName);
    }

    function getImageData(file: Blob): Promise<string> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const src = reader.result as string;
          resolve(src);
        });
        reader.readAsDataURL(file);
      });
    }

    function onGraphMounted() {
      updateAppHeight();
      window.addEventListener('resize', onResize);
      document.addEventListener('keydown', onKeydown);

      shapeLibraries.value = getShapeLibrariesFromStorage();
      if (!shapeLibraries.value) {
        shapeLibraries.value = DEFAULT_SHAPE_LIBRARIES;
        saveShapeLibrariesToStorage(shapeLibraries.value);
      }

      scratchpadData.value = getScratchpadData();
      if (!scratchpadData.value) {
        scratchpadData.value = DEFAULT_SCRATCHPAD_DATA;
        saveScratchpadDataToStorage(scratchpadData.value);
      }

      theme.value = getThemeData();
      if (!theme.value) {
        theme.value = DEFAULT_THEME;
        onThemeChanged(theme.value);
      }

      recentColors.value = getRecentColorFromStorage();
      if (!recentColors.value) {
        recentColors.value = '';
        saveRecentColorsToStorage(recentColors.value);
      }

      const drag: HTMLElement = document.querySelector('.geEditor');

      drag.addEventListener('dragenter', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });

      drag.addEventListener('dragleave', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });

      drag.addEventListener('dragover', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      drag.addEventListener('drop', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Don't allow drops in Preview Mode
        if (previewMode.value) {
          return;
        }

        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const file = e.dataTransfer.items[i].getAsFile();
          // If the dropped item was not an editor file, process as attachment
          if (e.dataTransfer.items[i].kind === 'file') {
            editor.value.canLoadFile(file).then((canLoad: boolean) => {
              if (canLoad) {
                file.text().then((fileData) => {
                  loadFileData(fileData);
                });
              } else {
                const fileInfo: EventFileInfo = {
                  file,
                  size: file.size,
                  lastModified: file.lastModified,
                };
                getImageData(file).then((imageData: string) => {
                  alert('in');
                  fileInfo.imageData = imageData;
                  onFileDropped(fileInfo);
                });
              }
            });
          }
        }
      });

      // Add our own ctrl+v event listener
      drag.onpaste = (e) => {
        // Don't allow pasting files in Preview Mode
        if (previewMode.value) {
          return;
        }

        if (e.clipboardData.types.indexOf('text/plain') >= 0) {
          return;
        }

        // check if default clipboard have files or not
        if (e.clipboardData.files.length > 0) {
          for (let i = 0; i < e.clipboardData.files.length; i++) {
            const file = e.clipboardData.files[i];
            const fileInfo: EventFileInfo = {
              file,
              size: file.size,
              lastModified: file.lastModified,
            };
            getImageData(file).then((imageData: string) => {
              fileInfo.imageData = imageData;
              onImagePasted(fileInfo);
            });
          }
        } else {
          // if default clipboard doesn't have file then if act as normal paste
          const action = editor.value.editorUiRef.actions.get('paste');
          action.funct();
        }
      };

      editor.value.pagesToFit.add(editor.value.editorUiRef.getCurrentPage().getId());
    }

    onMounted(() => {
      if (getEditorType() === EditorList.Graph) {
        onGraphMounted();
      }
    });

    function setEditorType(et: EditorList) {
      editorType.value = et;
      nextTick(() => {
        switch (getEditorType()) {
          case EditorList.Graph:
            onGraphMounted();
            supportedExtension.value = editor.value.supportedExtension();
            break;

          case EditorList.Spreadsheet:
            supportedExtension.value = spreadsheet.value.supportedExtension();
            break;
        }
      });
    }
    function newFile(et: EditorList) {
      if (getEditorType() === et) {
        // TODO: Reset editor
      } else {
        setEditorType(et);
      }
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize);
    });

    function getDateString(value: number): string {
      return new Date(value).toLocaleString();
    }

    function onPreviewModeChanged() {
      previewMode.value = !previewMode.value;
    }

    function onShapeLibrariesChanged(libraries: string) {
      saveShapeLibrariesToStorage(libraries);
      shapeLibraries.value = libraries;

      const fileLogEvent: FileLogEvent = {
        title: 'Shape Libraries Changed',
        size: libraries.length,
        lastModified: Date.now(),
      };
      addLog(fileLogEvent);
    }

    function onScratchpadDataChanged(xml: string) {
      saveScratchpadDataToStorage(xml);
      scratchpadData.value = xml;

      const fileLogEvent: FileLogEvent = {
        title: 'Scratchpad Data Changed',
        size: xml.length,
        lastModified: Date.now(),
      };
      addLog(fileLogEvent);
    }

    watch(
      () => editorType.value,
      (val: EditorList) => {
        if (val === EditorList.Graph) {
          nextTick(() => {
            onGraphMounted();
          });
        } else {
          updateAppHeight();
          window.addEventListener('resize', onResize);
        }
      },
    );

    watch(
      () => theme.value,
      (val: string) => {
        if (val == 'min') {
          document.getElementById('page').classList.remove('col-md-10');
          document.getElementById('page').classList.add('col-md-12');
        }
      },
    );

    return {
      addLog,
      editor,
      editorType,
      EditorList,
      insertDummyImage,
      getDateString,
      getEditorType,
      getRecentColorFromStorage,
      loadFileData,
      logs,
      newFile,
      onGraphChanged,
      onGraphMounted,
      onPreviewModeChanged,
      onScratchpadDataChanged,
      onShapeLibrariesChanged,
      onThemeChanged,
      previewMode,
      recentColors,
      refreshLink,
      saveFile,
      saveRecentColorsToStorage,
      scratchpadData,
      setEditorType,
      shapeLibraries,
      spreadsheet,
      supportedExtension,
      theme,
    };
  },
});
</script>

<template lang="pug">
#app
  .row
    .col-md-2(v-if='theme != "min"')
      b-list-group#logs-list.custom-list-group
        template(v-for='(log, index) in logs')
          table.custom-table(:key='index')
            tr
              td.custom-header-background(colspan='2')
                b.text-center.custom-header {{ log.title }}
            tr(v-if='log.name')
              td.table-details
                b Filename
              td.table-details
                | {{ log.name }}
            tr(v-if='log.what')
              td.table-details
                b What
              td.table-details
                | {{ log.what }}
            tr(v-if='log.size')
              td.table-details
                b Size
              td.table-details
                | {{ log.size }}
            tr(v-if='log.type')
              td.table-details
                b Type
              td.table-details
                | {{ log.type }}
            tr(v-if='log.lastModified')
              td.table-details
                b Modified
              td.table-details
                | {{ getDateString(log.lastModified) }}
    #page.col-md-10
      .row-btn(v-if='theme != "min"')
        button.ml-1(@click='newFile(EditorList.Graph)')
          | New Diagram
        button.ml-2(@click='newFile(EditorList.Spreadsheet)')
          | New Spreadsheet
        button.ml-3(@click='saveFile', :disabled='getEditorType() === EditorList.None')
          | Save File
        open-file.ml-4(
          @file-loaded='loadFileData',
          @set-editor-type='setEditorType',
          :editorType='editorType',
          :editorList='EditorList',
          :supportedExtension='supportedExtension'
        )
        input#preview.mt-1.ml-5(
          type='checkbox',
          name='preview',
          value='preview',
          @change='onPreviewModeChanged'
        )
        label.ml-1(for='preview') Preview Mode
      .row-btn(v-else)
        input#preview.mt-1.ml-5(
          type='checkbox',
          name='preview',
          value='preview',
          @change='onPreviewModeChanged'
        )
        label.ml-1(for='preview') Preview Mode
      #container.ge-container
        graph-editor(
          v-if='getEditorType() === EditorList.Graph',
          ref='editor',
          :enabled='!previewMode',
          :shapeLibraries='shapeLibraries',
          :scratchpadData='scratchpadData',
          :theme='theme',
          :refreshLinkHandler='refreshLink',
          :recentColors='recentColors',
          @shape-libraries-changed='onShapeLibrariesChanged',
          @graph-changed='onGraphChanged',
          @scratchpad-data-changed='onScratchpadDataChanged',
          @theme-changed='onThemeChanged',
          @save-recent-colors='saveRecentColorsToStorage'
        )
        spreadsheet-editor(v-if='getEditorType() === EditorList.Spreadsheet', ref='spreadsheet')
        .col-md-12(
          v-if='getEditorType() !== EditorList.Graph && getEditorType() !== EditorList.Spreadsheet'
        )
          h1 Pick a mode
</template>

<style lang="scss">
@import './styles/app.scss';
</style>
