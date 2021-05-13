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
import FindWindow from './windows/FindWindow.vue';
import LayersWindow from './windows/LayerWindow.vue';
import OutlineWindow from './windows/OutlineWindow.vue';
import ColorPickerWindow from '../components/vue-colorpicker/color/Index.vue';
import { defineComponent } from '@vue/composition-api';

import '../styles/windows.scss';

export default defineComponent({
  name: 'Windows',
  components: {
    ColorPickerWindow,
    FindWindow,
    LayersWindow,
    OutlineWindow,
  },
  props: {
    editorUi: {
      type: Object,
      required: false,
      default: null,
    },
    isEnableBind: {
      type: Boolean,
    },
    recentColors: {
      require: false,
      type: String,
      default: '',
    },
  },
  setup(_props, ctx) {
    function saveRecentColors(colors: string) {
      ctx.emit('save-recent-colors', colors);
    }
    return {
      saveRecentColors,
    };
  },
});
</script>

<template lang="pug">
.windows-container(v-if='editorUi')
  color-picker-window(
    :editorUi='editorUi',
    :recentColors='recentColors',
    @saveRecentColors='saveRecentColors'
  )
  find-window(:editorUi='editorUi')
  layers-window(:editorUi='editorUi', :isEnableBind='isEnableBind')
  outline-window(:editorUi='editorUi')
</template>
