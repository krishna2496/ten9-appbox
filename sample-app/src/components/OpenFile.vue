<template>
  <div class="btn-left">
    <button @click="fileUpload">
      Open A File
    </button>
    <input ref="file" type="file" value="Upload File" style="display:none;" @change="uploadFile" />
  </div>
</template>

<script>
export default {
  methods: {
    fileUpload() {
      this.$refs.file.click();
    },
    uploadFile() {
      let readXml = null;
      let [selectedFile] = this.$refs.file.files;
      let reader = new FileReader();
      reader.onload = (e) => {
        readXml = e.target.result;
        this.$emit('fileContent', readXml);
      };
      reader.readAsText(selectedFile);
    },
  },
};
</script>
