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
  name: 'PageScaleModel',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const pageScaleValue = ref(null);

    const scaleValue = 100;

    function closeModal() {
      show.value = false;
    }

    function setPageScale() {
      props.editorUi.setPageScale(pageScaleValue.value / scaleValue);
      closeModal();
    }

    function openPageScale() {
      show.value = true;
    }

    onMounted(() => {
      props.editorUi.addListener('openPageScale', openPageScale);
      pageScaleValue.value = props.editorUi.editor.graph.pageScale * scaleValue;
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPageScale);
    });

    return {
      closeModal,
      pageScaleValue,
      setPageScale,
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
  template(#modal-header='')
  .mw-100
    label Page Scale (%):
    input(type='text', v-model='pageScaleValue')
  template(#modal-footer='')
    button.btn.btn-default(type='button', @click='closeModal')
      | Close
    button.btn.btn-primary(type='button', @click='setPageScale')
      | Ok
</template>
