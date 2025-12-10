<template>
  <div class="categoria-wrapper">

    <h1 class="titulo">Selecciona una categoría</h1>

    <div class="categorias-grid">
      <button
        class="btn-cat"
        v-for="cat in categorias"
        :key="cat"
        @click="seleccionarCategoria(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <Modal v-if="mostrarModal" :mensaje="mensajeModal" @cerrar="cerrarModal" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Modal from "../components/Modal.vue"

const router = useRouter()

const categorias = [
  "Animales",
  "Comida",
  "Países",
  "Deportes",
  "Tecnología",
  "Películas"
]

const mostrarModal = ref(false)
const mensajeModal = ref("")

const seleccionarCategoria = (cat) => {
  localStorage.setItem("categoriaSeleccionada", cat) 
  
  mensajeModal.value = `Categoría seleccionada: ${cat}`
  mostrarModal.value = true

  setTimeout(() => router.push("/nivel"), 900)
}

const cerrarModal = () => {
  mostrarModal.value = false
}
</script>

<style scoped>
.categoria-wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #1a0033;
  background-image: 
    radial-gradient(circle at center, rgba(123, 58, 245, 0.15) 0%, transparent 40%),
    linear-gradient(to right, #3c0066 1px, transparent 1px),
    linear-gradient(to bottom, #3c0066 1px, transparent 1px);
  background-size: 40px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);
}

.titulo {
  font-family: 'Arial Black', sans-serif;
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 50px;
  letter-spacing: 2px;
  text-shadow: 
    0 0 5px #fff,
    0 0 18px #c084ff,
    0 0 40px #a855f7;
  animation: neon-flicker 1.8s infinite alternate ease-in-out;
}

@keyframes neon-flicker {
  0%, 100% {
    text-shadow: 
      0 0 5px #fff,
      0 0 18px #c084ff,
      0 0 40px #a855f7;
  }
  50% {
    text-shadow: 
      0 0 2px #fff,
      0 0 10px #c084ff,
      0 0 25px rgba(168, 85, 247, 0.6);
  }
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  gap: 35px;
  max-width: 700px;
}

.btn-cat {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  padding: 22px 10px;
  border-radius: 18px;
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  transition: 0.3s ease-in-out;
  text-shadow: 0 0 5px #c084ff;
}

.btn-cat:hover {
  transform: scale(1.05);
  box-shadow: 
    0 0 30px rgba(168, 85, 247, 1),
    0 0 10px rgba(255, 255, 255, 0.5);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(124, 58, 237, 0.2));
  border-color: #a855f7;
}

.btn-cat:active {
  transform: scale(0.98);
}
</style>






