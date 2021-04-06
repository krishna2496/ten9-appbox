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
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { mxConstants, mxEvent, mxEventObject } from '../../lib/jgraph/mxClient.js';
export default defineComponent({
  name: 'OutlineWindow',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    function close() {
      show.value = false;
    }

    function openOutlineWindow() {
      show.value = true;
      const div = document.getElementById('window');
      const { graph } = props.editorUi.editor;
      const outline: any = props.editorUi.createOutline(div);
      const outlineCreateGraph: any = outline.createGraph;
      outline.createGraph = function () {
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
      outline.init(div);
      outline.outline.view.validateBackgroundPage(true);
      debugger;
      //outline.outline.view.revalidate();
      if (outline.outline.dialect == mxConstants.DIALECT_SVG) {
        const zoomInAction = props.editorUi.actions.get('zoomIn');
        const zoomOutAction = props.editorUi.actions.get('zoomOut');

        mxEvent.addMouseWheelListener((evt: EventHandlerNonNull, up: boolean) => {
          let outlineWheel = false;
          let source = mxEvent.getSource(evt);

          while (source != null) {
            if (source == outline.outline.view.canvas.ownerSVGElement) {
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

      setTimeout(() => {
        function dragElement(elmnt: any) {
          let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

          function closeDragElement() {
            // stop moving when mouse button is r   eleased:
            document.onmouseup = null;
            document.onmousemove = null;
          }

          function elementDrag(e: any) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
          }

          function dragMouseDown(e: any) {
            // eslint-disable-next-line prefer-destructuring
            const handle = document.getElementsByClassName('card-header')[2];
            if (handle.contains(e.target)) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
            }
          }

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          if (document.getElementById(elmnt.id + 'header')) {
            // if present, the header is where you move the DIV from:
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
          } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
          }
        }
        // eslint-disable-next-line prefer-destructuring
        const ele: any = document.getElementsByClassName('card')[2];
        dragElement(ele);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 500);
    });

    onUnmounted(() => {
      console.log('unmount');
    });

    return {
      close,
      show,
    };
  },
});
</script>

<template lang="pug">
.find-window(v-show='show')
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
