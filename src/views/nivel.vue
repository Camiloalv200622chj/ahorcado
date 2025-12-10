<template>
  <div class="nivel-wrapper">

    <h1 class="titulo">Selecciona el nivel de dificultad</h1>

    <div class="nivel-grid">
      <button
        class="btn-nivel"
        v-for="n in niveles"
        :key="n.value"
        @click="seleccionarNivel(n.value)"
        :data-nivel="n.value"
      >
        {{ n.nombre }}
        <span class="intentos">
          ({{ n.intentos }} Intentos)
        </span>
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
  { nombre: "Fácil", value: "facil", intentos: 8, color: '#32CD32' }, 
  { nombre: "Medio", value: "medio", intentos: 5, color: '#FFD700' }, 
  { nombre: "Difícil", value: "dificil", intentos: 3, color: '#FF4500' } 
];

const mostrarModal = ref(false);
const mensajeModal = ref("");

const seleccionarNivel = (nivel) => {
  localStorage.setItem("nivelSeleccionado", nivel);

  const nivelData = niveles.find(n => n.value === nivel);
  const intentosMax = nivelData ? nivelData.intentos : 5; // Fallback a 5

  localStorage.setItem("intentosMax", intentosMax);

  mensajeModal.value = `Nivel seleccionado: ${nivelData.nombre} (${intentosMax} intentos)`;
  mostrarModal.value = true;

  setTimeout(() => router.push("/juego"), 900);
};

const cerrarModal = () => {
  mostrarModal.value = false;
};
</script>

<style scoped>
.nivel-wrapper {
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
  margin-bottom: 60px; 
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

.nivel-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 350px; 
}

.btn-nivel {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent; 
  color: white;
  font-size: 28px; 
  font-weight: bold;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.intentos {
  display: block;
  font-size: 14px;
  font-weight: normal;
  opacity: 0.8;
  margin-top: 5px;
}

.btn-nivel[data-nivel="facil"] {
  border-color: #32CD32;
  box-shadow: 0 0 15px rgba(50, 205, 50, 0.5);
}
.btn-nivel[data-nivel="facil"]:hover {
  background: rgba(50, 205, 50, 0.1);
  box-shadow: 0 0 30px #32CD32;
  transform: scale(1.05);
}

.btn-nivel[data-nivel="medio"] {
  border-color: #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}
.btn-nivel[data-nivel="medio"]:hover {
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 30px #FFD700;
  transform: scale(1.05);
}

.btn-nivel[data-nivel="dificil"] {
  border-color: #FF4500;
  box-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
}
.btn-nivel[data-nivel="dificil"]:hover {
  background: rgba(255, 69, 0, 0.1);
  box-shadow: 0 0 30px #FF4500;
  transform: scale(1.05);
}
</style>

