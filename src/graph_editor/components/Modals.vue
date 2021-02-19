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
import PageScaleModal from './dialogs/PageScaleModal.vue';
import BackgroundImageModal from './dialogs/BackgroundImageModal.vue';
import LayerRenameModal from './dialogs/RenameLayerModal.vue';
import PageRenameModal from './dialogs/PageRenameModal.vue';
import EditStyleModal from './dialogs/EditStyleModal.vue';

import '../styles/modals.scss';

export default defineComponent({
  name: 'Modals',
  components: {
    BackgroundImageModal,
    EditDiagramModal,
    EditStyleModal,
    LayerRenameModal,
    PageScaleModal,
    PageRenameModal,
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
  edit-style-modal(:editorUi='editorUi')
  page-scale-modal(:editorUi='editorUi')
  layer-rename-modal(:editorUi='editorUi')
  page-rename-modal(:editorUi='editorUi')
</template>
