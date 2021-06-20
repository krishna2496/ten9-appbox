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
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';

interface CustomEvent {
  getProperty: FunctionStringCallback;
}

export default defineComponent({
  name: 'LayerRenameModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const name = ref<string>('');

    const layer = ref(null);

    const layerRenameInput = ref<HTMLInputElement>(null);

    function closeModal() {
      show.value = false;
      name.value = '';
      layer.value = null;
    }

    function setLayerName() {
      if (name.value != null && name.value.length > 0) {
        props.editorUi.setLayerName(layer.value, name.value);
      }
      closeModal();
    }

    function onLayerRenameDialog(_sender: typeof mxEventSource, event: CustomEvent) {
      show.value = true;
      layer.value = event.getProperty('layer');
      name.value = props.editorUi.convertValueToString(layer.value);
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key == 'Enter') {
        setLayerName();
      }
    }

    function focusOnInput() {
      layerRenameInput.value?.select();
      layerRenameInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('openLayerRenameDialog', onLayerRenameDialog);
      document.addEventListener('keydown', onKeydown);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(onLayerRenameDialog);
    });

    return {
      closeModal,
      focusOnInput,
      layer,
      layerRenameInput,
      onKeydown,
      name,
      setLayerName,
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
    h6 Rename Layer
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100.mt-2
    label Name
    input.txt-input.ml-2(ref='layerRenameInput', type='text', v-model='name', autofocus)
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setLayerName')
      | Ok
</template>