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
import { mxEventSource } from '../../lib/jgraph/mxClient';
import { defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';
interface CustomEvent {
  getProperty: FunctionStringCallback;
}
export default defineComponent({
  name: 'PageRenameModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const style = ref<string>('');
    // TODO: Use type here
    const cell = ref(null);

    function closeModal() {
      show.value = false;
    }

    function setStyle() {
      if (style.value != null && style.value.length > 0) {
        props.editorUi.setCellStyle(style.value, cell.value);
        //props.editorUi.editor.graph.setCellStyle(mxUtils.trim(style.value), cell.value);
      }
      closeModal();
    }

    function onStyleChange(_sender: typeof mxEventSource, event: CustomEvent) {
      show.value = true;
      cell.value = event.getProperty('cell');
      //const modal = props.editorUi.editor.graph.model;
      style.value = props.editorUi.getCellStyle(cell.value[0]);
    }

    onMounted(() => {
      props.editorUi.addListener('openEditStyle', onStyleChange);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(onStyleChange);
    });

    return {
      cell,
      closeModal,
      setStyle,
      show,
      style,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, @hide='closeModal')
  template(v-slot:modal-header)
    h6 Edit Style
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
    .textarea-container
    label Enter Style:
    textarea.style(v-model='style') {{ style }}
  template(#modal-footer='')
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='setStyle')
      | OK
</template>
