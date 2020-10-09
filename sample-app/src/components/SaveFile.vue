<template>
    <button v-on:click="saveFile">Save File</button>
</template>

<script>
export default {
    methods:{
        saveFile()
        {
            this.$emit('fileSave')
        }
    }
}
</script>