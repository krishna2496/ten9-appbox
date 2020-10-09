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
      <graph-editor :isFileSave="isSave" v-on:fileSaved="save" :importFile="xmlData"/>
    </div>
  </div>
</template>

<script>
import Init from './init';
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
  data(){
    return{
       isSave:false,
       xmlData:''
    } 
  },
  methods:{
    save()
    {
     this.isSave = !this.isSave
    },
    importXml(val)
    {
      this.xmlData = val;
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
