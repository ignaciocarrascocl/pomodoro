import 'bootstrap/dist/css/bootstrap.min.css' // Importar CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Importar JavaScript de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css' // Importar Bootstrap Icons
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
