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

    const name = ref<string>('');
    // TODO: Use type here
    const page = ref(null);

    const pageRenameInput = ref<HTMLInputElement>(null);

    function closeModal() {
      show.value = false;
    }

    function setPageName() {
      if (name.value != null && name.value.length > 0) {
        props.editorUi.pageRename(page.value, name.value);
      }
      closeModal();
    }

    function onOpenPageRename(_sender: typeof mxEventSource, event: CustomEvent) {
      show.value = true;
      page.value = event.getProperty('page');
      name.value = page.value.getName();
    }

    function focusOnInput() {
      pageRenameInput.value?.select();
      pageRenameInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('openPageRename', onOpenPageRename);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(onOpenPageRename);
    });

    return {
      closeModal,
      focusOnInput,
      page,
      name,
      pageRenameInput,
      setPageName,
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
    h6 Rename Page
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100.mt-2
    label Name
    input.txt-input.ml-2(
      ref='pageRenameInput',
      type='text',
      v-model='name',
      autofocus,
      @keyup.enter.stop.prevent='setPageName'
    )
  template(#modal-footer='')
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='setPageName')
      | OK
</template>
