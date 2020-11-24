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
import OpenFile from './components/OpenFile.vue';

import { defineComponent, ref, onMounted, onBeforeUnmount } from '@vue/composition-api';
import { debounce } from 'lodash';

interface EventFileInfo {
  filename?: string;
  size?: number;
  type?: string;
  lastModified?: number;
}

interface FileLogEvent extends EventFileInfo {
  title: string;
}

export default defineComponent({
  name: 'App',
  components: {
    GraphEditor,
    OpenFile,
  },

  $refs: {
    GraphEditor: HTMLDivElement,
  },

  setup(_props, ctx) {
    const logs = ref([]);

    const editor = ref(null);

    const previewMode = ref(false);

    function updateAppHeight() {
      const container = document.getElementById('container');
      const rect = container.getBoundingClientRect();
      const contentPadding = 20;
      const bottomMargin = 5;
      const newHeight = window.innerHeight - rect.top - contentPadding - bottomMargin;
      container.style.height = `${newHeight}px`;

      if (previewMode.value) {
        ctx['refs'].editor.setGraphEnabled(!previewMode.value);
      }
    }

    const debounceTime = 100;
    const onResize = debounce(() => {
      updateAppHeight();
    }, debounceTime);

    function addLog(fileLogEvent: FileLogEvent) {
      logs.value.push(fileLogEvent);
    }

    function insertDummyImage() {
      // add a dummy image to graph to emulate what will happen in production app
      const url =
        'https://static.scientificamerican.com/sciam/cache/file/4E0744CD-793A-4EF8-B550B54F7F2C4406_source.jpg';
      editor.value.insertImage(url);
    }

    function onFileDropped(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'File Dropped',
        ...event,
      };
      addLog(fileLogEvent);
      insertDummyImage();
    }

    function onImagePasted(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'Image Pasted',
        ...event,
      };
      addLog(fileLogEvent);
      insertDummyImage();
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
      const xmlData = editor.value.getXmlData();
      saveXmlFile(xmlData);
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        saveFile();
      }
    }

    onMounted(() => {
      updateAppHeight();
      window.addEventListener('resize', onResize);
      document.addEventListener('keydown', onKeydown);

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

      drag.addEventListener('drop', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Don't allow drops in Preview Mode
        if (previewMode.value) {
          return;
        }

        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const file = e.dataTransfer.items[i].getAsFile();
          const fileInfo: EventFileInfo = {
            filename: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          };
          onFileDropped(fileInfo);
        }
      });

      // Add our own ctrl+v event listener
      drag.onpaste = (e) => {
        // Don't allow pasting files in Preview Mode
        if (!previewMode.value) {
          return;
        }

        // check if default clipboard have files or not
        if (e.clipboardData.files.length > 0) {
          for (let i = 0; i < e.clipboardData.files.length; i++) {
            const file = e.clipboardData.files[i];
            const fileInfo = {
              filename: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            };
            onImagePasted(fileInfo);
          }
        } else {
          // if default clipboard doesn't have file then if act as normal paste
          const action = editor.value.editorUi.actions.get('paste');
          action.funct();
        }
      };
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize);
    });

    function onGraphChanged() {
      const xmlData = editor.value.getXmlData();
      const fileLogEvent: FileLogEvent = {
        title: 'Graph Changed',
        size: xmlData.length,
        lastModified: Date.now(),
      };
      addLog(fileLogEvent);
    }

    function loadFileData(xmlData: string) {
      editor.value.loadXmlData(xmlData);
    }

    function getDateString(value: number): string {
      return new Date(value).toLocaleString();
    }

    function onPreviewModeChanged() {
      previewMode.value = !previewMode.value;
    }

    return {
      addLog,
      editor,
      insertDummyImage,
      getDateString,
      loadFileData,
      logs,
      onGraphChanged,
      onPreviewModeChanged,
      previewMode,
      saveFile,
    };
  },
});
</script>

<template lang="pug">
#app
  .row
    .col-md-2
      b-list-group#scroll.custom-list-group
        template(v-for='(log, index) in logs')
          table.custom-table(:key='index')
            tr
              td.custom-header-background(colspan='2')
                b.text-center.custom-header {{ log.title }}
            tr(v-if='log.filename')
              td.table-details
                b Filename
              td.table-details
                | {{ log.filename }}
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
    .col-md-10
      .row-btn
        button(@click='saveFile')
          | Save File
        open-file(@file-loaded='loadFileData')
        input#preview.mt-1(
          type='checkbox',
          name='preview',
          value='preview',
          @change='onPreviewModeChanged'
        )
        label.ml-1(for='preview') Preview Mode
      #container.ge-container
        graph-editor(ref='editor', @graph-changed='onGraphChanged', :preview-mode='previewMode')
</template>

<style lang="scss">
@import './styles/app.scss';
</style>
