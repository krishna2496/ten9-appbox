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
    <div class="ge-container">
      <graph-editor />
    </div>
  </div>
</template>

<script>
import Init from './init';
// Comment back in to test NPM
// import GraphEditor from 'vue-graph-editor';
import GraphEditor from '../../src/components/GraphEditor.vue';

export default {
  name: 'App',
  components: {
    GraphEditor,
  },
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
