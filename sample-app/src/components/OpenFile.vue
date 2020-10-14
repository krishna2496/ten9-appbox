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

<template>
  <div class="btn-left">
    <button @click="chooseFile">
      Open File
    </button>
    <input ref="file" type="file" value="Open File" style="display:none;" @change="loadFile" />
  </div>
</template>
