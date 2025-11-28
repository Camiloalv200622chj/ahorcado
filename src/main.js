import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/routes.js'

import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'

const app = createApp(App)

app.use(Quasar)
app.use(router)

app.mount('#app')
