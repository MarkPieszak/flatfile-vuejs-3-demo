<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref, computed, onBeforeMount, reactive, onMounted, provide } from "vue";
// import { FlatfileButton } from "@flatfile/vuejs";
import { useActions, useState, useGetters } from "vuex-composition-helpers";

import { useStore } from "vuex";

import FF from './components/ff.vue'

// export default {
//   components: {
//     FlatfileButton
//   }
// }

const licenseKey = ref("5d5f3329-f255-49b1-9b61-37648d4445f9");

const customer = reactive({
  userId: "12345",
});

console.log("inside setup");
console.log(licenseKey);

const settings = reactive({
  type: "test import",

  fields: [
    { label: "name", key: "Name" },
    { label: "email", key: "Email" },
  ],
});

const onData = (results) => {
  // Do something with the data here

  console.log(results);
  console.log("inside onData");

  return "Done!";
};

const onError = (err) => {
  console.error(err);
}
</script>

<template>
  <div>
    <!-- <FF :token="licenseKey" :customer="customer" :settings="settings" :onError="onError">Test</FF> -->
    <FF :token="licenseKey">
      Import Contacts 123
    </FF>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
