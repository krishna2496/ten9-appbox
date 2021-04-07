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
export default defineComponent({
  name: 'LayerWindow',
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

    function openLayerWindow() {
      show.value = true;
    }

    onMounted(() => {
      props.editorUi.addListener('openLayerWindow', openLayerWindow);

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
            const handle = document.getElementsByClassName('card-header')[1];
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
        const ele = document.getElementsByClassName('card')[1];
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
.layer-window(v-show='show')
  b-card.mb-2(tag='article', style='max-width: 20rem')
    template.row(#header='')
      h6.mb-1.col-sm-11 Layers
      span.float-right.col.sm-1.close(@click='close') X
    .card-body
    template(#footer)
      .d-inline-flex
        .geSprite.geSprite-delete
        .geSprite.geSprite-insert.ml-3
        .geSprite.geSprite-dots.ml-3
        .geSprite.geSprite-duplicate.ml-3
        .geSprite.geSprite-plus.ml-3
</template>

<style scoped>
.card-header {
  display: inline-flex;
}
.card {
  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.txt-input {
  border: 1px solid #ddd;
  padding: 5px 10px;
}
.close {
  cursor: pointer;
}
.bgLightPink {
  background: lightpink;
}
</style>
