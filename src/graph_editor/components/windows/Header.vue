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
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Header',
  props: {
    title: {
      type: String,
      require: true,
      default: '',
    },
    isMin: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  setup(_props, ctx) {
    function close() {
      ctx.emit('close-window');
    }

    function changeMinStatus() {
      ctx.emit('change-min-status');
    }
    return {
      changeMinStatus,
      close,
    };
  },
});
</script>

<template lang="pug">
.d-flex.align-items-center.justify-content-between.w-100
  h6.mb-1.col-sm-10.pl-0 {{ title }}
  span.cursor-pointer.layer-window-btn(
    aria-hidden='true',
    @click='changeMinStatus',
    :title='!isMin ? "Minimize" : "Maximize"'
  )
    i.fa.fa-window-maximize.mr-1(v-if='isMin')
    i.fa.fa-window-minimize.mr-1(v-else)
  i.fa.fa-times(aria-hidden='true', @click='close')
</template>
