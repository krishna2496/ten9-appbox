<template>
    <div class="btn-left">
        <button v-on:click="FileUpload">Upload A File</button>
        <input type="file" value="Upload File" ref="file" v-on:change="UploadFile" style="display:none;">
    </div>
</template>

<script>
export default {
    methods:{
        FileUpload(){
            this.$refs.file.click();
        },
        UploadFile()
        {
            var readXml=null;
            var selectedFile = this.$refs.file.files[0];
            var reader = new FileReader();
            reader.onload = (e) => {
                readXml=e.target.result;
                 this.$emit('fileContent',readXml);
            }
           reader.readAsText(selectedFile);
          
        }
    }
}
</script>