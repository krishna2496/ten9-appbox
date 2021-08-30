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
import { defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'CustomZoom',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const zoomInput = ref<HTMLInputElement>(null);

    const zoomValue = ref<number>(null);

    const scaleValue = 100;

    function closeModal() {
      show.value = false;
    }

    function zoom() {
      if (!isNaN(zoomValue.value) && zoomValue.value > 0) {
        const { graph } = props.editorUi.editor;
        graph.zoomTo(zoomValue.value / scaleValue);
      }
      closeModal();
    }

    function customZoom() {
      show.value = true;
      zoomValue.value = props.editorUi.getPageScale() * scaleValue;
    }

    function focusOnInput() {
      zoomInput.value?.select();
      zoomInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('customZoom', customZoom);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(customZoom);
    });

    return {
      closeModal,
      focusOnInput,
      zoomInput,
      zoomValue,
      show,
      zoom,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  ref='zoomInput',
  no-fade,
  @hide='closeModal',
  @shown='focusOnInput'
)
  template(v-slot:modal-header)
    h6 Custom Zoom
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2
    label.mt-1 Percentage (%)
    input.ml-2.txt-input(
      ref='zoomInput',
      type='number',
      v-model='zoomValue',
      @keyup.enter.stop.prevent='zoom'
    )
  template(#modal-footer='')
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='zoom')
      | Apply
</template>
