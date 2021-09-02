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
import { Graph } from '../../lib/jgraph/Graph.js';
import { defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'EditTooltipModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const tooltipValue = ref<string>(null);

    const tooltipInput = ref<HTMLInputElement>(null);

    const { graph } = props.editorUi.editor;

    const cell = ref(null);

    function closeModal() {
      show.value = false;
      cell.value = null;
      tooltipValue.value = null;
    }

    function setTooltip() {
      graph.setTooltipForCell(cell.value, tooltipValue.value);
      closeModal();
    }

    function editTooltip() {
      show.value = true;
      cell.value = graph.getSelectionCell();

      let tmp = null;
      const diagramLanguages: string = Graph.diagramLanguage;
      if (
        Graph.translateDiagram &&
        Graph.diagramLanguage != null &&
        cell.value.hasAttribute('tooltip_' + diagramLanguages)
      ) {
        tmp = cell.value.getAttribute('tooltip_' + diagramLanguages);
      }

      if (tmp == null) {
        tmp = cell.value.getAttribute('tooltip');
      }

      if (tmp != null) {
        tooltipValue.value = tmp;
      }
    }

    function focusOnInput() {
      tooltipInput.value?.select();
      tooltipInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('editTooltip', editTooltip);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(editTooltip);
    });

    return {
      closeModal,
      focusOnInput,
      setTooltip,
      show,
      tooltipInput,
      tooltipValue,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  ref='editTooltip',
  no-fade,
  @hide='closeModal',
  @shown='focusOnInput'
)
  template(v-slot:modal-header)
    h6 Edit Tooltip
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2.pr-4
    b-form-textarea(
      ref='tooltipInput',
      v-model='tooltipValue',
      placeholder='',
      rows='3',
      max-rows='6'
    )
  template(#modal-footer='')
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='setTooltip')
      | Apply
</template>
