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
  name: 'CustomZoom',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const pageScaleValue = ref<number>(null);

    const scaleValue = 100;

    function closeModal() {
      show.value = false;
    }

    function zoom() {
      if (!isNaN(pageScaleValue.value) && pageScaleValue.value > 0) {
        const { graph } = props.editorUi.editor;
        graph.zoomTo(pageScaleValue.value / scaleValue);
      }
      closeModal();
    }

    function customZoom() {
      show.value = true;
      pageScaleValue.value = props.editorUi.getPageScale() * scaleValue;
    }

    onMounted(() => {
      props.editorUi.addListener('customZoom', customZoom);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(customZoom);
    });

    return {
      closeModal,
      pageScaleValue,
      zoom,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  ref='pageScale',
  no-fade,
  @hide='closeModal'
)
  template(v-slot:modal-header)
    h6 Custom Zoom
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2
    label.mt-1 Percentage (%)
    input.ml-2.txt-input(type='number', v-model='pageScaleValue', autofocus)
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='zoom')
      | Apply
</template>
