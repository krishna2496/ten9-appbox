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

<script lang="ts">
import WindowHeader from './Header.vue';
import { mxConstants, mxEvent, mxRectangle } from '../../lib/jgraph/mxClient.js';
import { Graph } from '../../lib/jgraph/Graph.js';
import { defineComponent, onMounted, onUnmounted, nextTick, ref } from '@vue/composition-api';
import resize from 'vue-resize-directive';
// TODO: Figure out why we can't import here
const { dragElement, bringWindowToFront } = require('./utils.ts');

interface GraphProperty {
  gridEnabled: boolean;
  pageScale: number;
  pageFormat: mxRectangle;
  background: string;
  pageVisible: boolean;
}

export default defineComponent({
  name: 'OutlineWindow',
  directives: {
    resize,
  },
  components: {
    WindowHeader,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const outline = ref(null);

    const isMin = ref<boolean>(false);

    function close() {
      show.value = false;
      const outlineWindow = props.editorUi.actions.get('hideOutlineWindows');
      outlineWindow.funct();
    }

    function resizeWindow() {
      outline.value.update();
    }

    function openOutlineWindow() {
      show.value = true;
      const div = document.getElementById('window');
      const { graph } = props.editorUi.editor;
      outline.value = props.editorUi.createOutline(div);
      const outlineCreateGraph: typeof Graph = outline.value.createGraph;
      outline.value.createGraph = function createGraphOverride() {
        const g: GraphProperty = outlineCreateGraph.apply(this, arguments);
        g.gridEnabled = false;
        g.pageScale = graph.pageScale;
        g.pageFormat = graph.pageFormat;
        g.background =
          graph.background == null || graph.background == mxConstants.NONE
            ? graph.defaultPageBackgroundColor
            : graph.background;
        g.pageVisible = graph.pageVisible;

        return g;
      };
      outline.value.init(div);
      bringWindowToFront(2);
      nextTick(() => {
        // we need to update the outline when DOM is initialize with outline
        outline.value.update();
      });
      if (outline.value.outline.dialect == mxConstants.DIALECT_SVG) {
        const zoomInAction = props.editorUi.actions.get('zoomIn');
        const zoomOutAction = props.editorUi.actions.get('zoomOut');

        mxEvent.addMouseWheelListener((evt: EventHandlerNonNull, up: boolean) => {
          let outlineWheel = false;
          let source = mxEvent.getSource(evt);

          while (source != null) {
            if (source == outline.value.outline.view.canvas.ownerSVGElement) {
              outlineWheel = true;
              break;
            }

            source = source.parentNode;
          }

          if (outlineWheel) {
            if (up) {
              zoomInAction.funct();
            } else {
              zoomOutAction.funct();
            }
          }
        });
      }
    }

    function changeMinStatus() {
      isMin.value = !isMin.value;
    }

    onMounted(() => {
      props.editorUi.addListener('openOutlineWindow', openOutlineWindow);
      props.editorUi.addListener('hideOutline', close);

      const ele: unknown = document.getElementsByClassName('card');
      dragElement(ele[2], 2);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openOutlineWindow);
    });

    return {
      changeMinStatus,
      close,
      isMin,
      outline,
      resizeWindow,
      show,
    };
  },
});
</script>

<template lang="pug">
b-card.mb-2(
  tag='article',
  style='max-width: 20rem',
  v-resize='resizeWindow',
  v-show='show',
  :class='isMin ? "minimize window-card" : "outline window-card"'
)
  template.row(#header='')
    window-header(
      title='Outline',
      @close-window='close',
      :isMin='isMin',
      @change-min-status='changeMinStatus'
    )
  #window
</template>
