<template>
  <div class="inicio-wrapper">

    <div class="card">
      <img 
        class="card-img"
        src="https://www.shutterstock.com/image-vector/hangman-icon-vector-symbol-design-600nw-2516503065.jpg"
        alt="Ahorcado"
      />

      <h1 class="title">EL AHORCADO</h1>

      <button class="btn" @click="goNombre">
        Iniciar Juego
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goNombre = () => router.push('/nombre')
</script>

<style scoped>
.inicio-wrapper {
  height: 100vh;
  width: 100%;
  background-color: #1a0033; 
  background-image: 
    radial-gradient(circle at center, rgba(123, 58, 245, 0.15) 0%, transparent 40%), 
    linear-gradient(to right, #3c0066 1px, transparent 1px),
    linear-gradient(to bottom, #3c0066 1px, transparent 1px);
  background-size: 40px 40px; 
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8); 
}

.card {
  background: rgba(255, 255, 255, 0.04); 
  padding: 40px;
  width: 480px;
  border-radius: 24px;
  backdrop-filter: blur(20px) brightness(1.1); 
  border: 2px solid rgba(255, 255, 255, 0.25); 
  text-align: center;
  box-shadow: 
    0 0 35px rgba(149, 80, 255, 0.8), 
    inset 0 0 15px rgba(255, 255, 255, 0.15); 
  animation: pulse-shadow 2s infinite alternate;
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

.card-img {
  width: 280px; 
  margin-bottom: 25px;
  filter: 
    drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
    drop-shadow(0 0 20px #c084ff);
}

.title {
  font-family: 'Arial Black', sans-serif; 
  font-size: 56px; 
  color: #ffffff;
  font-weight: 900;
  margin-bottom: 40px;
  letter-spacing: 4px; 
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

.btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(90deg, #a855f7, #7c3aed);
  
  color: white; 
  
  border: none;
  border-radius: 12px;
  font-size: 26px; 
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
  transition: 0.3s ease-in-out;
  position: relative; 
  overflow: hidden; 
  z-index: 1;
}

.btn:hover {
  transform: scale(1.03);
  box-shadow: 
    0 0 30px rgba(168, 85, 247, 1),
    0 0 5px rgba(255, 255, 255, 0.8);
  background: linear-gradient(90deg, #a855f7, #7c3aed);
}

.btn:active {
  transform: scale(0.98);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}
</style>
