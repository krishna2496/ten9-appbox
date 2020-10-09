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
  <div class="geEditor" ref="container" />
</template>

<script>
import { mxClient, mxResources } from '@/lib/jgraph/mxClient';
import EditorUi from '@/lib/jgraph/EditorUi';
import { Editor } from '@/lib/jgraph/Editor';
import { ExportXml, importXmlFile } from '@/lib/utils';
import Graph from '@/lib/jgraph/Graph';

const defaultStyleXml = require('@/styles/default.xml');
const resourcesFile = require('@/locale/grapheditor.txt');

export default {
  name: 'GraphEditor',
  data() {
    return {
      editorUi: null,
    };
  },
  props: ['isFileSave', 'importFile'],
  mounted() {
    mxResources.loadDefaultBundle = false;
    mxResources.parse(resourcesFile);

    const parser = new DOMParser();
    const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

    const themes = {};
    themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
    this.editorUi = new EditorUi(new Editor(false, themes), this.$refs.container);
    mxClient.setContainer(this.editorUi.container);
  },
  methods: {
    saveFile() {
      new ExportXml(this.editorUi);
    },
    exportXml(data) {
      new importXmlFile(this.editorUi, data);
    },
  },
  watch: {
    isFileSave(val) {
      if (val) {
        this.saveFile();
        this.$emit('fileSaved');
      }
    },
    importFile(val) {
      if (val != '') {
        this.exportXml(val);
      }
    },
  },
};
</script>

<style lang="scss">
@import '../styles/grapheditor.css';
</style>
