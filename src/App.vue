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

import { defineComponent, ref } from '@vue/composition-api';

// interface LogEvent extends Event {
//   title?: string;
//   lastModifiedString?: Date;
// }

export default defineComponent({
  name: 'App',
  components: {
    GraphEditor,
    OpenFile,
  },

  setup() {
    const logs = ref([]);

    const editor = ref(null);

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

    function loadFileData(xmlData: string) {
      editor.value.loadXmlData(xmlData);
    }

    function addLog(event: Event, title: string) {
      console.log(`addLog: ${title}`);
      console.log(`addLog: Event: ${event}`);
      // let logEvent: LogEvent = event;
      // logEvent.title = title;
      // logEvent.lastModifiedString = new Date(event.lastModified).toLocaleString();
      // logs.value.push(event);
    }

    function insertDummyImage() {
      // add a dummy image to graph to emulate what will happen in production app
      const url =
        'https://static.scientificamerican.com/sciam/cache/file/4E0744CD-793A-4EF8-B550B54F7F2C4406_source.jpg';
      editor.value.insertImage(url);
    }

    function onFileDropped(event: DragEvent) {
      addLog(event, 'File Dropped');
      insertDummyImage();
    }

    function onImagePasted(event: ClipboardEvent) {
      addLog(event, 'Image Pasted');
      insertDummyImage();
    }

    return {
      addLog,
      editor,
      insertDummyImage,
      loadFileData,
      logs,
      onFileDropped,
      onImagePasted,
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
                b.text-center.custom-header  {{ log.title }}
            tr
              td.table-details
                b Filename
              td.table-details
                | {{ log.filename }}
            tr
              td.table-details
                b Size
              td.table-details
                | {{ log.size }}
            tr
              td.table-details
                b Type
              td.table-details
                | {{ log.type }}
            tr
              td.table-details
                b Modified
              td.table-details
                | {{ log.lastModified }}
    .col-md-8
      .row-btn
        button(@click='saveFile')
          | Save File
        open-file(@file-loaded='loadFileData($event)')
      .ge-container
        graph-editor(ref='editor' @file-saved='saveXmlFile($event)' @file-dropped='onFileDropped($event)' @image-pasted='onImagePasted($event)')
</template>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

.ge-container {
  position: relative;
  height: 1000px;
  width: 1400px;
  margin: 20px auto;
  border: 1px solid black;
}
</style>
