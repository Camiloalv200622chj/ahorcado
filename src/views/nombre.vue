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

<style scoped>
.nombre-wrapper {
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
  justify-content: center;
  align-items: center;
  padding: 0;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);
}

.card {
  background: rgba(255, 255, 255, 0.04);
  padding: 50px 45px;
  width: 480px; 
  border-radius: 24px;
  backdrop-filter: blur(25px) brightness(1.1); 
  border: 2px solid rgba(255, 255, 255, 0.25); 
  text-align: center;
  transform: translateY(0);
  animation: pulse-shadow 2s infinite alternate, fadeUp 0.6s ease-out; 
  
  box-shadow: 
    0 0 35px rgba(149, 80, 255, 0.8), 
    inset 0 0 15px rgba(255, 255, 255, 0.15);
}

@keyframes pulse-shadow {
  from {
    box-shadow: 
      0 0 30px rgba(149, 80, 255, 0.8),
      inset 0 0 10px rgba(255, 255, 255, 0.15);
  }
  to {
    box-shadow: 
      0 0 45px rgba(149, 80, 255, 1), 
      inset 0 0 20px rgba(255, 255, 255, 0.25);
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  font-family: 'Arial Black', sans-serif;
  font-size: 40px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 40px;
  letter-spacing: 2px;
  
  text-shadow: 
    0 0 5px #fff,
    0 0 15px #c084ff,
    0 0 30px #a855f7;
    
  animation: neon-flicker 1.5s infinite alternate ease-in-out;
}

@keyframes neon-flicker {
  0%, 100% {
    text-shadow: 
      0 0 5px #fff,
      0 0 15px #c084ff,
      0 0 30px #a855f7;
  }
  50% {
    text-shadow: 
      0 0 2px #fff,
      0 0 10px #c084ff,
      0 0 20px rgba(168, 85, 247, 0.6);
  }
}


.input {
  width: 100%;
  padding: 18px; 
  border-radius: 16px; 
  border: 1px solid rgba(255, 255, 255, 0.2); 
  background: rgba(255, 255, 255, 0.08); 
  color: #fff;
  font-size: 22px; 
  margin-bottom: 40px; 
  outline: none;
  transition: 0.3s ease-in-out;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5); 
}

.input::placeholder {
  color: #e9d5ff;
  opacity: 0.8;
}

.input:focus {
  border-color: #a855f7; 
  box-shadow: 
    0 0 8px #a855f7,
    inset 0 0 10px rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.15);
}


.btn {
  width: 100%;
  padding: 20px; 
  background: linear-gradient(90deg, #a855f7, #7c3aed); 
  color: white;
  border: none;
  border-radius: 16px; 
  font-size: 24px; 
  font-weight: 800; 
  cursor: pointer;
  
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.9);
  transition: 0.3s ease-in-out;
}

.btn:hover {
  transform: scale(1.03); 
  box-shadow: 
    0 0 40px rgba(168, 85, 247, 1),
    0 0 10px rgba(255, 255, 255, 0.5); 
}

.btn:active {
  transform: scale(0.98);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}
</style>
