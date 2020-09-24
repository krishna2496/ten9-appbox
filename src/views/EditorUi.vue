<template>
  <div class="editor-ui">
    <editor />
  </div>
</template>

<script>
import Editor from '@/components/Editor.vue';

export default {
  name: 'EditorUi',
  components: {
    Editor,
  },
};
</script>

<style lang="scss">
.editor-ui {
  width: 100%;
  height: 100%;
}
</style>
