<template>
  <div class="nivel-wrapper">

    <h1 class="titulo">Selecciona el nivel</h1>

    <div class="nivel-grid">
      <button
        class="btn-nivel"
        v-for="n in niveles"
        :key="n.value"
        @click="seleccionarNivel(n.value)"
      >
        {{ n.nombre }}
      </button>
    </div>

    <Modal v-if="mostrarModal" :mensaje="mensajeModal" @cerrar="cerrarModal" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";

const router = useRouter();

const niveles = [
  { nombre: "Fácil", value: "facil" },
  { nombre: "Medio", value: "medio" },
  { nombre: "Difícil", value: "dificil" }
];

const mostrarModal = ref(false);
const mensajeModal = ref("");

const seleccionarNivel = (nivel) => {
  localStorage.setItem("nivelSeleccionado", nivel);

  mensajeModal.value = `Nivel seleccionado: ${nivel}`;
  mostrarModal.value = true;

  setTimeout(() => router.push("/juego"), 900);
};

const cerrarModal = () => {
  mostrarModal.value = false;
};
</script>

<style scoped>
/* 🎮 Fondo Gamer */
.nivel-wrapper {
  height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #7b3af5, #260047 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Título */
.titulo {
  font-size: 44px;
  font-weight: 900;
  text-shadow: 0 0 12px #d4a5ff;
  margin-bottom: 40px;
}

/* GRID elegante */
.nivel-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Botones gamer */
.btn-nivel {
  background: linear-gradient(90deg, #a855f7, #7c3aed);
  border: none;
  padding: 18px 50px;
  color: white;
  font-size: 26px;
  font-weight: bold;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
  transition: 0.25s ease-out;
}

.btn-nivel:hover {
  transform: scale(1.08);
  box-shadow: 0 0 25px rgba(200, 120, 255, 1);
}
</style>
