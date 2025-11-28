import { createRouter, createWebHistory } from 'vue-router'

import inicio from '../views/inicio.vue'
import categoria from '../views/categoria.vue'
import nombre from '../views/nombre.vue'
import nivel from '../views/nivel.vue'
import juego from '../views/juego.vue'
import tiempos from '../views/tiempos.vue'

const routes = [
  { path: '/', component: inicio },
  { path: '/categoria', component: categoria },
  { path: '/nombre', component: nombre },
  { path: '/nivel', component: nivel },
  { path: '/juego', component: juego },
  { path: '/tiempos', component: tiempos }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
