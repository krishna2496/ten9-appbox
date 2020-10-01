<template>
  <div class="geEditor" ref="container" />
</template>

<script>
import { mxResources } from 'mxgraph/javascript/mxClient';
import EditorUi from '@/lib/jgraph/EditorUi';
import { Editor } from '@/lib/jgraph/Editor';
import Graph from '@/lib/jgraph/Graph';

const defaultStyleXml = require('@/styles/default.xml');
const resourcesFile = require('@/locale/grapheditor.txt');

export default {
  name: 'EditorUi',
  data() {
    return {
      editorUi: null,
      editor: null,
      graph: null,
    };
  },
  mounted() {
    mxResources.loadDefaultBundle = false;
    mxResources.parse(resourcesFile);

    const parser = new DOMParser();
    const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

    var themes = {};
    themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;

    this.editor = new Editor(false, themes);
    this.editorUi = new EditorUi(this.editor, this.$refs.container);
    this.graph = this.editorUi.editor.graph;
  },
};
</script>
