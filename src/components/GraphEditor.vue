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
  <div ref="container" class="geEditor" @keydown.ctrl.83.prevent.stop="saveFile" />
</template>

<script>
import { mxEvent, mxResources } from '@/lib/jgraph/mxClient';
import EditorUi from '@/lib/jgraph/EditorUi';
import { Editor } from '@/lib/jgraph/Editor';
import { getXml, importXml } from '@/lib/utils';
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
  mounted() {
    const drag = document.querySelector('.geEditor');
    mxEvent.addListener(drag, 'dragenter', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    mxEvent.addListener(drag, 'dragleave', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    mxEvent.addListener(drag, 'dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    mxEvent.addListener(drag, 'drop', (e) => {
      e.stopPropagation();
      e.preventDefault();

      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        let file = e.dataTransfer.items[i].getAsFile();
        let fileInfo = {
          filename: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        this.$emit('file-dropped', fileInfo);
      }
    });

    mxResources.loadDefaultBundle = false;
    mxResources.parse(resourcesFile);

    const parser = new DOMParser();
    const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

    const themes = {};
    themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
    this.editorUi = new EditorUi(new Editor(false, themes), this.$refs.container);
  },
  methods: {
    getXmlData() {
      return getXml(this.editorUi);
    },
    loadXmlData(data) {
      importXml(this.editorUi, data);
    },
    saveFile() {
      let xmlData = this.getXmlData();
      this.$emit('file-save', xmlData);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/grapheditor.css';
</style>
