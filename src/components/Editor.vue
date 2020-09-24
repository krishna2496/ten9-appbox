<template>
  <div ref="container"></div>
</template>

<script>
import { mxGraph, mxPoint } from 'mxgraph/javascript/mxClient';

export default {
  name: 'Editor',
  data() {
    return {
      graph: null,
    };
  },

  mounted() {
    // Creates the graph inside the given container
    // this.graph = new mxGraph(this.$refs.container);
    this.graph = this.createGraph();
    this.resetGraph();

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

  methods: {
    createGraph() {
      // var graph = new Graph(null, model, null, null, themes);
      var graph = new mxGraph(this.$refs.container);

      // Create a unique offset object for each graph instance.
      graph.currentTranslate = new mxPoint(0, 0);

      graph.transparentBackground = false;

      // // Opens all links in a new window while editing
      // if (!this.chromeless) {
      //   graph.isBlankLink = function(href) {
      //     return !this.isExternalProtocol(href);
      //   };
      // }

      return graph;
    },

    resetGraph() {
      this.graph.gridEnabled = true;
      this.graph.graphHandler.guidesEnabled = true;
      this.graph.setTooltips(true);
      this.graph.setConnectable(true);
      this.graph.foldingEnabled = true;
      this.graph.scrollbars = this.graph.defaultScrollbars;
      this.graph.pageVisible = this.graph.defaultPageVisible;
      this.graph.pageBreaksVisible = this.graph.pageVisible;
      this.graph.preferPageSize = this.graph.pageBreaksVisible;
      this.graph.background = null;
      this.graph.pageScale = mxGraph.prototype.pageScale;
      this.graph.pageFormat = mxGraph.prototype.pageFormat;
      this.graph.currentScale = 1;
      this.graph.currentTranslate.x = 0;
      this.graph.currentTranslate.y = 0;
      this.updateGraphComponents();
      this.graph.view.setScale(1);
    },

    updateGraphComponents() {
      var graph = this.graph;

      if (graph.container != null) {
        graph.view.validateBackground();
        graph.container.style.overflow = graph.scrollbars ? 'auto' : this.defaultGraphOverflow;

        // TODO: Hookup fired events
        // this.fireEvent(new mxEventObject('updateGraphComponents'));
      }
    },
  },
};
</script>
