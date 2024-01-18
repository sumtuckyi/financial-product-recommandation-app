import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';





const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
// app.use(createPinia())
app.use(pinia)
app.use(router)
app.use(VueAwesomeSwiper);

app.mount('#app')
