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
    <editor-ui />
  </div>
</template>

<script>
// import EditorUi from '@/components/EditorUi.vue';
import VueGraphEditor from 'vue-graph-editor';

export default {
  name: 'App',
  components: {
    EditorUi,
  },
};
</script>

<style lang="scss">
@import './styles/common.css';
@import './styles/grapheditor.css';
</style>
