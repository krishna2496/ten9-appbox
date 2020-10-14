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
    addLog(val) {
      this.logs.push(val);
    },
  },
};
</script>

<template>
  <div id="app">
    <div class="row">
      <div class="col-md-2">
        <b-list-group>
          <template v-for="(log, index) in logs">
            <b-list-group-item :key="index">
              filename :- {{ log.filename }} <br />
              size :- {{ log.size }} <br />
              type :- {{ log.type }} <br />
              lastModified :- {{ log.lastModified }}
            </b-list-group-item>
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
            @file-save="saveXmlFile($event)"
            @file-dropped="addLog($event)"
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
