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
import { defineComponent, nextTick, ref, watch } from '@vue/composition-api';

export default defineComponent({
  name: 'Model',
  props: {
    pageScaleWindow: Boolean,
    pageScaleValue: {
      required: true,
      type: Number,
    },
  },
  setup(props, ctx) {
    const newPageScaleValue = ref(null);

    watch(
      () => props.pageScaleValue,
      (val) => {
        nextTick(() => {
          if (val) {
            const modal: any = ctx.refs.pageScale;
            modal.show();
          }
        });
      },
    );

    watch(
      () => props.pageScaleValue,
      (val) => {
        nextTick(() => {
          newPageScaleValue.value = val;
        });
      },
    );

    function closeModal() {
      ctx.emit('modelClose');
    }

    function apply() {
      const pageDivideBy = 100;
      newPageScaleValue.value = newPageScaleValue.value / pageDivideBy;
      ctx.emit('setPageScale', newPageScaleValue);
    }

    return {
      apply,
      closeModal,
      newPageScaleValue,
    };
  },
});
</script>

<template lang="pug">
div
  b-modal#modal(v-if='pageScaleWindow', no-close-on-backdrop='', ref='pageScale', no-fade)
    template(#modal-header='')
    .mw-100
      label Page Scale (%):
      input(type='text', v-model='newPageScaleValue')
    template(#modal-footer='')
      button.btn.btn-default(type='button', @click='closeModal')
        | Close
      button.btn.btn-primary(type='button', @click='apply')
        | Ok
</template>
