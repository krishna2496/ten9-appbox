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
