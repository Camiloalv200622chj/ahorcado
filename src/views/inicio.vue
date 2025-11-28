<template>
  <div class="inicio-wrapper">

    <div class="card">
      <img 
        class="card-img"
        src="https://w7.pngwing.com/pngs/749/468/png-transparent-hangman-full-figurine-hangman-thumbnail.png"
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
/* 💜 Fondo gamer morado */
.inicio-wrapper {
  height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #7b3af5, #3c0066 70%);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 🕹 Tarjeta estilo arcade */
.card {
  background: rgba(255, 255, 255, 0.06);
  padding: 40px;
  width: 480px;
  border-radius: 18px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 25px rgba(149, 80, 255, 0.6);
  text-align: center;
}

.card-img {
  width: 260px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 12px rgba(255,255,255,0.3));
}

.title {
  font-size: 48px;
  color: #ffffff;
  font-weight: 900;
  margin-bottom: 30px;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #c084ff;
}

/* ✨ Botón gamer estilo neón */
.btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(90deg, #a855f7, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
  transition: 0.25s;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(168, 85, 247, 1);
}
</style>
