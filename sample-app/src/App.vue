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

<script>
// eslint-disable-next-line no-unused-vars
import Init from './init';
// Comment back in to test NPM
// import GraphEditor from 'vue-graph-editor';
import GraphEditor from '../../src/components/GraphEditor.vue';
import OpenFile from './components/OpenFile.vue';

export default {
  name: 'App',
  components: {
    GraphEditor,
    OpenFile,
  },
  data() {
    return {
      logs: [],
    };
  },
  methods: {
    saveFile() {
      const xmlData = this.$refs.editor.getXmlData();
      this.saveXmlFile(xmlData);
    },
    saveXmlFile(xmlData) {
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
    },
    loadFileData(val) {
      this.$refs.editor.loadXmlData(val);
    },
    addLog(val, title) {
      val.title = title;
      val.lastModified = this.getDate(val.lastModified);

      this.logs.push(val);
      // add image to graph
      const url =
        'https://static.scientificamerican.com/sciam/cache/file/4E0744CD-793A-4EF8-B550B54F7F2C4406_source.jpg';
      this.$refs.editor.insertImage(url);
    },
    getDate(timestamp) {
      const monthIcrement = 1;
      let todate = new Date(timestamp).getDate();
      let tomonth = new Date(timestamp).getMonth() + monthIcrement;
      let toyear = new Date(timestamp).getFullYear();
      return tomonth + '/' + todate + '/' + toyear;
    },
  },
};
</script>

<template>
  <div id="app">
    <div class="row">
      <div class="col-md-2">
        <b-list-group id="scroll" class="custom-list-group">
          <template v-for="(log, index) in logs">
            <table :key="index" class="custom-table">
              <tr>
                <td colspan="2" class="custom-header-background">
                  <b class="text-center custom-header"> {{ log.title }} </b>
                </td>
              </tr>
              <tr>
                <td class="table-details">
                  <b>File Name</b>
                </td>
                <td class="table-details">
                  {{ log.filename }}
                </td>
              </tr>
              <tr>
                <td class="table-details">
                  <b>size</b>
                </td>
                <td class="table-details">
                  {{ log.size }}
                </td>
              </tr>
              <tr>
                <td class="table-details">
                  <b>type</b>
                </td>
                <td class="table-details">
                  {{ log.type }}
                </td>
              </tr>
              <tr>
                <td class="table-details">
                  <b>Modified</b>
                </td>
                <td class="table-details">
                  {{ log.lastModified }}
                </td>
              </tr>
            </table>
          </template>
        </b-list-group>
      </div>
      <div class="col-md-8">
        <div class="row-btn">
          <button @click="saveFile">
            Save File
          </button>
          <open-file @file-loaded="loadFileData($event)" />
        </div>
        <div class="ge-container">
          <graph-editor
            ref="editor"
            @file-saved="saveXmlFile($event)"
            @file-dropped="addLog($event, 'File Dropped')"
            @file-pasted="addLog($event, 'File Pasted')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
// Comment back in to test NPM
/* @import '../node_modules/vue-graph-editor/dist/vue-graph-editor.min.css'; */
@import '../../src/styles/grapheditor.css';

.ge-container {
  position: relative;
  height: 1000px;
  width: 1400px;
  margin: 20px auto;
  border: 1px solid black;
}
</style>
