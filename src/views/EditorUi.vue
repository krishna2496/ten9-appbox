<template>
  <div class="editor-ui" ref="container" />
</template>

<script>
import EditorUi from '@/lib/jgraph/EditorUi.js';

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
    this.editorUi = new EditorUi(null, this.$refs.container);

    this.graph = this.editorUi.editor.graph;

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = this.graph.getDefaultParent();

    // Adds cells to the model in a single step
    this.graph.getModel().beginUpdate();
    try {
      let v1 = this.graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
      let v2 = this.graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);

      this.graph.insertEdge(parent, null, '', v1, v2);
    } finally {
      // Updates the display
      this.graph.getModel().endUpdate();
    }
  },
};
</script>

<style lang="scss">
.editor-ui {
  width: 100%;
  height: 100%;
}
</style>
