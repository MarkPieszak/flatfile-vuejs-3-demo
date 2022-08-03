import { createApp } from 'vue'
import App from './App.vue'
import  FlatfileButton  from "./components/ff.vue";

const app = createApp(App);

app.component(`FlatfileButton`, FlatfileButton);

console.log(`FlatfileButton`);
console.log(FlatfileButton);

app.mount('#app')
