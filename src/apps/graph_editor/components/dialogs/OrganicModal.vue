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
import { mxFastOrganicLayout } from '../../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'OrganicModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const defaultSpacingValue = 50;

    const spacingValue = ref<number>(defaultSpacingValue);

    const spacingInput = ref<HTMLInputElement>(null);

    const { graph } = props.editorUi.editor;

    function closeModal() {
      show.value = false;
    }

    function setSpacing() {
      if (spacingValue.value != 0 && spacingValue.value != null) {
        const layout = new mxFastOrganicLayout(graph);
        layout.forceConstant = spacingValue.value;
        let tmp = graph.getSelectionCell();

        if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
          tmp = graph.getDefaultParent();
        }

        layout.execute(tmp);

        if (graph.getModel().isVertex(tmp)) {
          graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
        }
      }
      closeModal();
    }

    function OrganicLayout() {
      show.value = true;
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key == 'Enter') {
        setSpacing();
      }
    }

    function focusOnInput() {
      spacingInput.value?.select();
      spacingInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('OrganicLayout', OrganicLayout);
      document.addEventListener('keydown', onKeydown);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(OrganicLayout);
      document.removeEventListener('keydown', onKeydown);
    });

    return {
      closeModal,
      focusOnInput,
      onKeydown,
      spacingInput,
      spacingValue,
      setSpacing,
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
    h6 Set Spacing
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2
    label.mt-1 Spacing
    input.txt-input.ml-2(ref='spacingInput', type='number', v-model='spacingValue')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setSpacing')
      | Apply
</template>
