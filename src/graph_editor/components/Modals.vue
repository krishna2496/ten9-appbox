<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import EditDiagramModal from './dialogs/EditDiagramModal.vue';

export default defineComponent({
  name: 'Modals',
  components: {
    EditDiagramModal,
    // PageScaleModal,
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
  edit-diagram-modal(:editorUi='editorUi')
</template>
