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

// 📌 6 categorías
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
/* Fondo Gamer full-screen */
.categoria-wrapper {
  height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #7b3af5, #260047 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
  padding: 0;
}

/* Título */
.titulo {
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 40px;
  text-shadow: 0 0 12px #d4a5ff;
}

/* GRID DE 6 BOTONES */
.categorias-grid {
  display: grid;
  grid-template-columns: repeat(2, 260px);
  gap: 25px;
}

/* Botón gamer */
.btn-cat {
  background: linear-gradient(90deg, #a855f7, #7c3aed);
  border: none;
  padding: 18px;
  border-radius: 14px;
  color: white;
  font-size: 22px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
  transition: 0.25s ease-out;
}

.btn-cat:hover {
  transform: scale(1.08);
  box-shadow: 0 0 25px rgba(200, 120, 255, 1);
}
</style>
