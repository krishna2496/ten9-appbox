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

<template>
  <div id="app">
    <div class="row-btn">
      <save-file v-on:fileSave="save"/>
      <open-file v-on:fileContent="importXml($event)"/>
    </div>
    <div class="ge-container">
      <graph-editor v-on:fileSaved="save" ref="editor"/>
    </div>
  </div>
</template>

<script>
// Comment back in to test NPM
// import GraphEditor from 'vue-graph-editor';
import GraphEditor from '../../src/components/GraphEditor.vue';
import SaveFile from './components/SaveFile.vue'
import OpenFile from './components/OpenFile.vue';

export default {
  name: 'App',
  components: {
    GraphEditor,
    SaveFile,
    OpenFile
  },
  methods:{
    save()
    {
      let data = this.$refs.editor.saveFile();
      let fileName = 'drawgraph.xml';
      let fileType = '.xml';

      let blob = new Blob([data], { type: fileType });

      let a = document.createElement('a');
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500); 
    },
    importXml(val)
    {
      this.$refs.editor.loadData(val);
    }
  }
};
</script>

<style lang="scss">
// Comment back in to test NPM
/* @import '../node_modules/vue-graph-editor/dist/vue-graph-editor.min.css'; */
@import '../../src/styles/grapheditor.css';

.ge-container {
  position: relative;
  height: 1000px;
  width: 1400px;
  margin: 100px auto;
  border: 1px solid black;
}
</style>
