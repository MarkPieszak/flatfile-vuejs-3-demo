<template>
   Button?
  <FlatfileButton :token="token">
    Upload to Flatfile!
  </FlatfileButton>
</template>

<script>
import  FlatfileButton  from "./components/ff.vue";

export default {
  name: 'App',
  components: {
    FlatfileButton,
  },
  data: () => ({
    token: 'Your_Token_You_Received_From_Your_Backend',    
  })
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
}
</style>
