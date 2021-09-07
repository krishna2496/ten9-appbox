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
import { mxConstants } from '../../lib/jgraph/mxClient.js';
import { defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'RotationModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const rotationValue = ref<number>(null);

    const rotationInput = ref<HTMLInputElement>(null);

    const { graph } = props.editorUi.editor;

    function closeModal() {
      show.value = false;
    }

    function setRotationValue() {
      if (rotationValue.value != 0 && rotationValue.value != null) {
        graph.setCellStyles(mxConstants.STYLE_ROTATION, rotationValue.value);
      }
      closeModal();
    }

    function openRotation() {
      const state = graph.getView().getState(graph.getSelectionCell());
      rotationValue.value = state.style[mxConstants.STYLE_ROTATION] || 0;
      show.value = true;
    }

    function focusOnInput() {
      rotationInput.value?.select();
      rotationInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('openRotation', openRotation);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(openRotation);
    });

    return {
      closeModal,
      focusOnInput,
      rotationInput,
      rotationValue,
      setRotationValue,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  no-fade,
  @hide='closeModal',
  @shown='focusOnInput'
)
  template(v-slot:modal-header)
    h6 Rotation
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2
    label.mt-1 Rotation (0-360):
    input.txt-input.ml-2(
      ref='rotationInput',
      type='number',
      v-model='rotationValue',
      @keyup.enter.stop.prevent='setRotationValue'
    )
  template(#modal-footer='')
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='setRotationValue')
      | Apply
</template>
