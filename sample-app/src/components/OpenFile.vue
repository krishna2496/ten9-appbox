<template>
  <div class="btn-left">
    <button @click="chooseFile">
      Open File
    </button>
    <input ref="file" type="file" value="Open File" style="display:none;" @change="loadFile" />
  </div>
</template>

<script>
export default {
  methods: {
    chooseFile() {
      this.$refs.file.click();
    },
    loadFile() {
      let fileData = null;
      let [selectedFile] = this.$refs.file.files;
      let reader = new FileReader();
      reader.onload = (e) => {
        fileData = e.target.result;
        this.$emit('file-loaded', fileData);
      };
      reader.readAsText(selectedFile);
    },
  },
};
</script>
