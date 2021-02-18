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
import EditDiagramModal from './dialogs/EditDiagramModal.vue';
import PageScaleModal from './dialogs/PageScale.vue';
import BackgroundImageModal from './dialogs/BackgroundImageModal.vue';
import LayerRenameModal from './dialogs/RenameLayerModal.vue';

export default defineComponent({
  name: 'Modals',
  components: {
    BackgroundImageModal,
    EditDiagramModal,
    LayerRenameModal,
    PageScaleModal,
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
.modals-container(v-if='editorUi')
  background-image-modal(:editorUi='editorUi')
  edit-diagram-modal(:editorUi='editorUi')
  page-scale-modal(:editorUi='editorUi')
  layer-rename-modal(:editorUi='editorUi')
</template>
