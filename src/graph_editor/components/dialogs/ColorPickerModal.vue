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
import { Chrome } from 'vue-color';
const { ChangePageSetup } = require('../../lib/jgraph/EditorUi');

export default defineComponent({
  name: 'BackgroundImageModal',
  components: {
    'chrome-picker': Chrome,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const show = ref<boolean>(false);

    const imageUrl = ref('');

    const imageHeight = ref(null);

    const imageWidth = ref(null);

    const colors = ref({
      hex: '#194d33',
      hex8: '#194D33A8',
      hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
      hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
      rgba: { r: 25, g: 77, b: 51, a: 1 },
      a: 1,
    });

    function close() {
      show.value = false;
    }

    function openColorPicker() {
      show.value = true;
    }

    function reset() {
      imageUrl.value = '';
      imageHeight.value = 0;
      imageWidth.value = 0;
    }

    function apply() {
      props.editorUi.editor.graph.setGridEnabled(true);
      const change = new ChangePageSetup(props.editorUi, colors.value.hex);
      change.ignoreImage = true;
      props.editorUi.editor.graph.model.execute(change);
      close();
    }
    onMounted(() => {
      props.editorUi.addListener('openColorPicker', openColorPicker);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openColorPicker);
    });

    return {
      apply,
      close,
      colors,
      imageHeight,
      imageUrl,
      imageWidth,
      reset,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal(:visible='show', no-close-on-backdrop='', @close='close', @hide='close', no-fade)
  template(v-slot:modal-header)
    h4 Select Color
    i.fa.fa-times(aria-hidden='true', @click='close')
  .row.justify-content-center
    chrome-picker(v-model='colors')
  template(v-slot:modal-footer)
    button.btn.btn-grey(@click='close') Cancel
    button.btn.btn-primary(@click='apply') Apply
</template>

<style lang="scss" scoped>
.image-url {
  width: 370px;
}
.text-box {
  width: 100px;
}
.text-box-label {
  margin-bottom: 0;
}
.image-cordinate {
  align-items: center;
}
</style>
