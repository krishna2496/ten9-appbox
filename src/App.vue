<template>
  <div id="app">
    <router-view />
    <!-- <Editor /> -->
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
//import Editor from "./components/editor/index.vue";

export default {
  name: 'App',
  components: {
    //HelloWorld
    // Editor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
   height: 100%;
  width: 100%;
}


html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
