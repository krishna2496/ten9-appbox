<template>
  <button @click="saveFile">
    Save File
  </button>
</template>

<script>
export default {
  methods: {
    saveFile() {
      this.$emit('fileSave');
    },
  },
};
</script>
