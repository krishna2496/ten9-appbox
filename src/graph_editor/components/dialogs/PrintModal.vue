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
import PageSize from '../../lib/PageSize.js';

export default defineComponent({
  name: 'PrintModel',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const pageScaleValue = ref(null);

    const pageScaleInput = ref('');

    function closeModal() {
      show.value = false;
    }

    function setPageScale() {
      if (pageScaleValue.value != 0 && pageScaleValue.value != '') {
        // props.editorUi.setPageScale(pageScaleValue.value / scaleValue);
      }
      closeModal();
    }

    function openPrintModal() {
      show.value = true;
    }

    onMounted(() => {
      props.editorUi.addListener('openPrintModal', openPrintModal);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPrintModal);
    });

    return {
      closeModal,
      pageScaleInput,
      PageSize,
      setPageScale,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, @hide='closeModal')
  template(v-slot:modal-header)
    h4 Print
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mb-3
    input(type='radio', name='adjust')
    label.ml-2 Adjust to
    input.ml-2.txt-input(type='text')
  .row.ml-3.mb-3
    input(type='radio', name='adjust')
    label.ml-2 Fit to
    input.ml-2.txt-input(type='text')
    label.ml-2 sheet(s) across
  .row.ml-5.mb-3
    label.ml-2 by
    input.ml-4.txt-input(type='text')
    label.ml-2 sheet(s) down
  .row
    hr
  .row.ml-3.mb-3
    h5 Paper Size
  .row.ml-3.mb-3
    select.form-control.w-90
      option(v-for='(page, index) in PageSize', :key='index') {{ page.title }}
  .row.ml-3.mb-3
    input(type='radio', name='page_type')
    label.ml-2 Portrait
    input.ml-4(type='radio', name='page_type')
    label.ml-2 Landscape
  .row.ml-3.mb-3
    label.ml-2 Page Scale
    input.txt-input.ml-2(type='text', v-modal='pageScaleInput')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setPageScale')
      | Apply
</template>
