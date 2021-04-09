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
import FindWindow from './windows/FindWindow.vue';
import LayersWindow from './windows/LayerWindow.vue';
import OutlineWindow from './windows/OutlineWindow.vue';

import '../styles/windows.scss';

export default defineComponent({
  name: 'Windows',
  components: {
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
  },
});
</script>

<template lang="pug">
.windows-container(v-if='editorUi')
  find-window(:editorUi='editorUi')
  layers-window(:editorUi='editorUi')
  outline-window(:editorUi='editorUi')
</template>
