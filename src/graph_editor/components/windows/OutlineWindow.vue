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
import { defineComponent, onMounted, onUnmounted, nextTick, ref } from '@vue/composition-api';
import { mxConstants, mxEvent } from '../../lib/jgraph/mxClient.js';
import dragElement from './Drag.js';
import resize from 'vue-resize-directive';
export default defineComponent({
  name: 'OutlineWindow',
  directives: {
    resize,
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

    function close() {
      show.value = false;
    }

    function resizeWindow() {
      outline.value.update();
    }

    function openOutlineWindow() {
      show.value = true;
      const div = document.getElementById('window');
      const { graph } = props.editorUi.editor;
      outline.value = props.editorUi.createOutline(div);
      const outlineCreateGraph: any = outline.value.createGraph;
      outline.value.createGraph = function createGraphOverride() {
        const g: any = outlineCreateGraph.apply(this, arguments);
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

    onMounted(() => {
      props.editorUi.addListener('openOutlineWindow', openOutlineWindow);
      // eslint-disable-next-line prefer-destructuring
      const ele: unknown = document.getElementsByClassName('card')[2];
      dragElement(ele, 2);
    });

    onUnmounted(() => {
      console.log('unmount');
    });

    return {
      close,
      outline,
      resizeWindow,
      show,
    };
  },
});
</script>

<template lang="pug">
.outline-window(v-show='show', v-resize='resizeWindow')
  b-card.mb-2(tag='article', style='max-width: 20rem')
    template.row(#header='')
      h6.mb-1.col-sm-11 Outline
      span.float-right.col.sm-1.close(@click='close') X
    #window
</template>

<style scoped>
.card-header {
  display: inline-flex;
}
.card {
  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  resize: both;
  height: 250px;
  width: 250px;
  max-width: none !important;
}
.close {
  cursor: pointer;
}
#window {
  background: lightgray;
  width: 100%;
  height: 100%;
  border: 1px solid whitesmoke;
  overflow: hidden;
}
</style>
