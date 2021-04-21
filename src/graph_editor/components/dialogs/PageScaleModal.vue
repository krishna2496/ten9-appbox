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

    const pageScaleValue = ref<number>(null);

    const scaleValue = 100;

    const pageScaleInput = ref<HTMLInputElement>(null);

    function closeModal() {
      show.value = false;
    }

    function setPageScale() {
      if (pageScaleValue.value != 0 && pageScaleValue.value != null) {
        props.editorUi.setPageScale(pageScaleValue.value / scaleValue);
      }
      closeModal();
    }

    function openPageScale() {
      show.value = true;
      pageScaleValue.value = props.editorUi.editor.graph.pageScale * scaleValue;
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key == 'Enter') {
        setPageScale();
      }
    }

    function focusOnInput() {
      pageScaleInput.value?.select();
      pageScaleInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('openPageScale', openPageScale);
      document.addEventListener('keydown', onKeydown);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPageScale);
    });

    return {
      closeModal,
      focusOnInput,
      onKeydown,
      pageScaleInput,
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
  @hide='closeModal',
  @shown='focusOnInput'
)
  template(v-slot:modal-header)
    h6 Set Page Scale
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2
    label.mt-1 Percentage (%)
    input.txt-input.ml-2(ref='pageScaleInput', type='number', v-model='pageScaleValue')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setPageScale')
      | Apply
</template>
