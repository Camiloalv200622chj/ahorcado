<template>
  <div class="nombre-wrapper">

    <div class="card">
      <h2 class="title">¿Cuál es tu nombre?</h2>

      <input 
        v-model="nombre"
        type="text"
        class="input"
        placeholder="Escribe tu nombre..."
      />

      <button class="btn" @click="guardarNombre">
        Continuar
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombre = ref("")

const guardarNombre = () => {
  if (!nombre.value.trim()) {
    alert("Ingresa un nombre válido");
    return;
  }

  localStorage.setItem("nombreJugador", nombre.value.trim())
  router.push("/categoria")
}
</script>
<style>
/* Pantalla completa sin scroll */
.nombre-wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: radial-gradient(circle at 30% -20%, #a855f7, #3c0066 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

/* Tarjeta glass con más profundidad */
.card {
  background: rgba(255, 255, 255, 0.08);
  padding: 50px 45px;
  width: 460px;
  border-radius: 22px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 40px rgba(150, 90, 255, 0.55);
  text-align: center;
  transform: translateY(0);
  animation: fadeUp 0.6s ease-out;
}

/* Animación suave */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Título más gamer */
.title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 12px #bf8bff;
  margin-bottom: 35px;
}

/* Input moderno */
.input {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 20px;
  margin-bottom: 30px;
  outline: none;
  transition: 0.3s;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.15);
}

.input::placeholder {
  color: #e9d5ff;
}

.input:focus {
  border-color: #d9b3ff;
  box-shadow: 0 0 14px #c084ff;
  background: rgba(255, 255, 255, 0.15);
}

/* Botón neon gamer pro */
.btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(90deg, #c084fc, #9333ea);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(170, 60, 255, 0.8);
  transition: 0.25s ease-out;
}

.btn:hover {
  transform: scale(1.07);
  box-shadow: 0 0 28px rgba(200, 120, 255, 1);
}

</style>