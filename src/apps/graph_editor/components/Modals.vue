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
import BackgroundImageModal from './dialogs/BackgroundImageModal.vue';
import CustomZoomModal from './dialogs/CustomZoomModal.vue';
import EditDataModal from './dialogs/EditDataModal.vue';
import EditDiagramModal from './dialogs/EditDiagramModal.vue';
import EditStyleModal from './dialogs/EditStyleModal.vue';
import InsertImageModal from './dialogs/InsertImageModal.vue';
import InsertLinkModal from './dialogs/InserLinkModal.vue';
import MoreShapesModal from './dialogs/MoreShapesModal.vue';
import LayerRenameModal from './dialogs/RenameLayerModal.vue';
import OrganicModal from './dialogs/OrganicModal.vue';
import PageRenameModal from './dialogs/PageRenameModal.vue';
import PageScaleModal from './dialogs/PageScaleModal.vue';
import PrintModal from './dialogs/PrintModal.vue';
import RotationModal from './dialogs/RotationModal.vue';
import ScratchpadModal from './dialogs/ScratchpadModal.vue';
import { defineComponent } from '@vue/composition-api';

import '../styles/modals.scss';

export default defineComponent({
  name: 'Modals',
  components: {
    BackgroundImageModal,
    CustomZoomModal,
    EditDataModal,
    EditDiagramModal,
    EditStyleModal,
    InsertImageModal,
    InsertLinkModal,
    LayerRenameModal,
    MoreShapesModal,
    OrganicModal,
    PageRenameModal,
    PageScaleModal,
    PrintModal,
    RotationModal,
    ScratchpadModal,
  },
  props: {
    editorUi: {
      type: Object,
      required: false,
      default: null,
    },
    shapeLibraries: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(_props, ctx) {
    function insertImage(url: string) {
      ctx.emit('insert-image', url);
    }
    return {
      insertImage,
    };
  },
});
</script>

<template lang="pug">
.modals-container(v-if='editorUi')
  background-image-modal(:editorUi='editorUi')
  custom-zoom-modal(:editorUi='editorUi')
  edit-data-modal(:editorUi='editorUi')
  edit-diagram-modal(:editorUi='editorUi')
  edit-style-modal(:editorUi='editorUi')
  insert-image-modal(:editorUi='editorUi', @insert-image='insertImage')
  insert-link-modal(:editorUi='editorUi')
  layer-rename-modal(:editorUi='editorUi')
  more-shapes-modal(:editorUi='editorUi', :shape-libraries='shapeLibraries')
  organic-modal(:editorUi='editorUi')
  page-rename-modal(:editorUi='editorUi')
  page-scale-modal(:editorUi='editorUi')
  print-modal(:editorUi='editorUi')
  rotation-modal(:editorUi='editorUi')
  scratchpad-modal(:editorUi='editorUi')
</template>
