<template>
    <div class="graphEditorContainer">
        <router-link to="/home">Click Here to go Home Screen</router-link>
        <graph-editor ref="graphEditor"/>
    </div>
</template>

<script>
import GraphEditor from '@/components/graphEditor/index'

export default {
  name: 'index',
  components: {GraphEditor},
  data() {
    return {
      graph: null
    }
  },
  mounted() {
    this.graph = this.$refs.graphEditor.init()
  }
}
</script>

<style lang="scss">
.graphEditorContainer {
  width: 100%;
  height: 100%;
}

</style>
