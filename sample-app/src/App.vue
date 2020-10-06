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
    <graph-editor />
  </div>
</template>

<script>
import GraphEditor from 'vue-graph-editor';

export default {
  name: 'App',
  components: {
    GraphEditor,
  },
};
</script>

<style lang="scss">
// TEN9: TODO: Add ../node_modules to sass-loader includePaths.
// This currently isn't working for some reason with webpack.config.js
// That might have something to do with this being a "file:" reference
// in package.json.
@import '../node_modules/vue-graph-editor/dist/vue-graph-editor.min.css';

#app {
  position: relative;
  height: 1000px;
  width: 1400px;
  margin: 100px auto;
  border: 1px solid black;
}
</style>
