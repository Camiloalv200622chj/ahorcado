<template>
  <div class="juego-container">
    <div class="main-wrapper">
      
      <div class="header">
        <div class="header-top">
          <h1 class="game-title">AHORCADO</h1>
          
          <div class="timer-badge" :class="{ 'pulse-animation': timeLeft <= 10 }">
             <div class="timer-value">{{ timeLeft }}</div>
             <div class="timer-label">TIEMPO</div>
             <svg class="timer-ring" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
               <circle cx="50" cy="50" r="45" fill="transparent" stroke="#4ECDC4" stroke-width="6" 
                       stroke-dasharray="283" :stroke-dashoffset="283 - (283 * timePercent / 100)" stroke-linecap="round"/>
             </svg>
          </div>
        </div>

        <div class="player-info-grid">
          <div class="info-pill">
            <span class="pill-icon">👤</span>
            <div class="pill-data">
              <span class="label">JUGADOR</span>
              <span class="value">{{ playerName }}</span>
            </div>
          </div>

          <div class="info-pill">
            <span class="pill-icon">🏷️</span>
            <div class="pill-data">
              <span class="label">CATEGORÍA</span>
              <span class="value">{{ category }}</span>
            </div>
          </div>

          <div class="info-pill">
            <span class="pill-icon">📊</span>
            <div class="pill-data">
              <span class="label">NIVEL</span>
              <span class="value">{{ level }}</span>
            </div>
          </div>

          <div class="info-pill lives-pill">
            <span class="pill-icon">❤️</span>
            <div class="pill-data">
              <span class="label">VIDAS</span>
              <div class="hearts-row">
                 <span v-for="i in maxErrors" :key="i" class="heart-dot" :class="{ 'lost': i <= errors }"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="game-board">
        
        <div class="board-left">
          <div class="hangman-box" :class="{ shake: shakeEffect }">
            <div class="scaffold-area">
              <div class="scaffold-base"></div>
              <div class="scaffold-pole"></div>
              <div class="scaffold-top"></div>
              <div class="scaffold-rope"></div>

              <div class="man-head" v-if="errors >= 1">xx</div>
              <div class="man-body" v-if="errors >= 2"></div>
              <div class="man-arm-l" v-if="errors >= 3"></div>
              <div class="man-arm-r" v-if="errors >= 4"></div>
              <div class="man-leg-l" v-if="errors >= 5"></div>
              <div class="man-leg-r" v-if="errors >= 6"></div>
            </div>
          </div>
          <div class="error-tag">
              ERRORES: <span class="error-num">{{ errors }} / {{ maxErrors }}</span>
            </div>
        </div>

        <div class="board-right">
          
          <div class="word-container">
            <div class="word-wrapper">
              <span v-for="(letter, index) in displayWord" :key="index" 
                    class="letter-slot" 
                    :class="{ 'revealed': letter !== '_', 'empty': letter === '_' }">
                {{ letter === '_' ? '' : letter }}
              </span>
            </div>
          </div>

          <div v-if="(level.toLowerCase() === 'fácil' || level.toLowerCase() === 'facil')" class="hint-container">
            <div class="hint-bubble">
              <span class="hint-emoji">💡</span>
              <span class="hint-text">{{ hintText }}</span>
            </div>
          </div>

          <div class="keyboard-wrapper">
            <div class="keyboard-grid">
               <button 
                 v-for="letter in alphabet" 
                 :key="letter"
                 class="key-btn"
                 :class="{
                    'key-correct': usedLetters.includes(letter) && selectedWord.includes(letter),
                    'key-wrong': usedLetters.includes(letter) && !selectedWord.includes(letter),
                    'key-disabled': usedLetters.includes(letter)
                 }"
                 :disabled="usedLetters.includes(letter) || gameOver"
                 @click="selectLetter(letter)"
               >
                 {{ letter }}
               </button>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div v-if="gameOver" class="modal-overlay">
      <div class="modal-card" :class="finalMessage.includes('Ganaste') ? 'modal-win' : 'modal-lose'">
        <div class="modal-emoji">{{ finalMessage.includes('Ganaste') ? '🏆' : '💀' }}</div>
        <h2>{{ finalMessage }}</h2>
        <p>La palabra era: <strong>{{ selectedWord }}</strong></p>
        
        <div class="modal-btns">
          <button class="action-btn primary" @click="goToResults">Resultados</button>
          <button class="action-btn secondary" @click="$router.push('/')">Salir</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const playerName = localStorage.getItem("nombreJugador") || "Jugador";
    
    const category = ref("");
    const level = localStorage.getItem("nivelSeleccionado") || "Fácil";

    const timeConfig = { facil: 300, medio: 240, dificil: 180 };
    const timeLeft = ref(timeConfig[level.toLowerCase()] || 240);
    const timePercent = computed(() => (timeLeft.value / (timeConfig[level.toLowerCase()] || 240)) * 100);
    let timer;

    const maxErrors = Number(localStorage.getItem("intentosMax")) || 6;
    const shakeEffect = ref(false);

    const wordBank = {
      Animales: ["PERRO", "GATO", "LEON", "TORTUGA", "ELEFANTE", "CABALLO"],
      Comida: ["PIZZA", "HAMBURGUESA", "SPAGHETTI", "ARROZ", "EMPANADA", "PERROCALIENTE"],
      Países: ["COLOMBIA", "MEXICO", "ARGENTINA", "BRASIL", "PERU", "CHILE"],
      Deportes: ["FUTBOL", "TENIS", "BALONCESTO", "NATACION", "CICLISMO"],
      Tecnología: ["CELULAR", "TECLADO", "COMPUTADOR", "MONITOR"],
      Películas: ["TITANIC", "AVATAR", "GLADIADOR", "COCO", "FROZEN"],
      General: ["AHORCADO", "PROGRAMAR", "JUEGO"]
    };

    const selectedWord = ref("");
    const hintText = ref("");
    const usedLetters = ref([]);
    const errors = ref(0);
    const gameOver = ref(false);
    const finalMessage = ref("");

    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

    const hints = {
      PERRO: "Mejor amigo del hombre.", GATO: "Animal que maúlla.", LEON: "Rey de la selva.",
      TORTUGA: "Tiene caparazón.", ELEFANTE: "Tiene trompa.", CABALLO: "Se monta.",
      PIZZA: "Comida italiana redonda.", HAMBURGUESA: "Carne entre panes.", SPAGHETTI: "Pasta larga.",
      ARROZ: "Grano blanco.", EMPANADA: "Masa rellena frita.", PERROCALIENTE: "Salchicha y pan.",
      COLOMBIA: "Capital Bogotá.", MEXICO: "Tacos y mariachis.", ARGENTINA: "Tango y asado.",
      BRASIL: "Samba y fútbol.", PERU: "Machu Picchu.", CHILE: "País largo y angosto.",
      FUTBOL: "Balón y goles.", TENIS: "Raqueta y red.", BALONCESTO: "Canasta y naranja.",
      NATACION: "Deporte en agua.", CICLISMO: "Bicicleta.", CELULAR: "Móvil personal.",
      TECLADO: "Para escribir en PC.", COMPUTADOR: "Máquina inteligente.", MONITOR: "Pantalla.",
      TITANIC: "Barco hundido.", AVATAR: "Aliens azules.", GLADIADOR: "Luchador romano.",
      COCO: "Mundo de los muertos.", FROZEN: "Reina de hielo.", AHORCADO: "Adivina la palabra.",
      PROGRAMAR: "Escribir código.", JUEGO: "Diversión."
    };

    const selectRandomWord = (cat) => {
      if (!wordBank[cat] || wordBank[cat].length === 0) {
        cat = "General";
      }
      
      const words = wordBank[cat];
      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words[randomIndex];
      
      return word;
    };

    const initializeGame = () => {
      const cat = localStorage.getItem("categoriaSeleccionada");
      category.value = cat ? cat.trim() : "General";
      
      console.log("Categoría recuperada:", category.value);
      
      selectedWord.value = selectRandomWord(category.value);
      
      hintText.value = hints[selectedWord.value] || "Adivina la palabra";
      
      console.log("Palabra seleccionada:", selectedWord.value);
      console.log("Categoría usada:", category.value); 
    };

    const displayWord = computed(() => {
      return selectedWord.value.split("").map(l => 
        usedLetters.value.includes(l) ? l : "_"
      );
    });

    const endGame = (msg) => {
      finalMessage.value = msg;
      gameOver.value = true;
      clearInterval(timer);
      
      const usedTime = (timeConfig[level.toLowerCase()] || 240) - timeLeft.value;
      const results = JSON.parse(localStorage.getItem("results") || "[]");
      
      results.push({
        player: playerName,
        category: category.value,
        level: level,
        word: selectedWord.value,
        result: msg.includes("Ganaste") ? "Ganó" : "Perdió",
        errors: errors.value,
        tiempo: usedTime,
        date: new Date().toISOString()
      });
      
      localStorage.setItem("results", JSON.stringify(results));
    };

    const selectLetter = (letter) => {
      if (gameOver.value) return;
      
      usedLetters.value.push(letter);
      
      if (!selectedWord.value.includes(letter)) {
        errors.value++;
        shakeEffect.value = true;
        setTimeout(() => (shakeEffect.value = false), 400);
        
        if (errors.value >= maxErrors) {
          endGame("¡Perdiste! 😢");
        }
      } else if (!displayWord.value.includes("_")) {
        endGame("¡Ganaste! 🎉");
      }
    };

    onMounted(() => {
      initializeGame();
      
      timer = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          endGame("Tiempo Agotado ⏳");
        }
      }, 1000);
    });

    const goToResults = () => router.push("/tiempos");

    return {
      playerName,
      category,
      level,
      timeLeft,
      timePercent,
      alphabet,
      displayWord,
      usedLetters,
      selectLetter,
      errors,
      maxErrors,
      shakeEffect,
      gameOver,
      finalMessage,
      goToResults,
      hintText,
      selectedWord
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;600&display=swap');

* { box-sizing: border-box; }

.juego-container {
  min-height: 100vh;
  background: #1a1625;
  background: radial-gradient(circle at center, #2a2340 0%, #110e1a 100%);
  color: white;
  font-family: 'Fredoka', sans-serif;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.main-wrapper {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.header {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-title {
  font-size: 2.5rem;
  margin: 0;
  color: #FF61D2;
  text-shadow: 0 0 15px rgba(255, 97, 210, 0.4);
}

.timer-badge {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-ring {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transform: rotate(-90deg);
}

.timer-value { font-size: 1.2rem; font-weight: bold; }
.timer-label { font-size: 0.5rem; color: #aaa; margin-top: -2px; }

.player-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.info-pill {
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.pill-icon { font-size: 1.5rem; }
.pill-data { display: flex; flex-direction: column; }
.label { font-size: 0.7rem; color: #888; letter-spacing: 1px; }
.value { font-size: 1rem; font-weight: 600; }

.hearts-row { display: flex; gap: 4px; margin-top: 4px; }
.heart-dot {
  width: 12px; height: 12px;
  background-color: #ff4757;
  border-radius: 50%;
  box-shadow: 0 0 5px #ff4757;
}
.heart-dot.lost { background-color: #333; box-shadow: none; }

.game-board {
  display: grid;
  grid-template-columns: 320px 1fr; 
  gap: 25px;
  min-height: 400px;
}

.board-left {
  background: rgba(0,0,0,0.2);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
}

.hangman-box {
  position: relative;
  width: 220px;
  height: 300px;
}

.scaffold-base { position: absolute; bottom: 0; left: 10px; width: 120px; height: 8px; background: #555; border-radius: 4px; }
.scaffold-pole { position: absolute; bottom: 0; left: 65px; width: 8px; height: 290px; background: #555; border-radius: 4px; }
.scaffold-top  { position: absolute; top: 10px; left: 65px; width: 100px; height: 8px; background: #555; border-radius: 4px; }
.scaffold-rope { position: absolute; top: 10px; left: 155px; width: 4px; height: 40px; background: #e1b12c; }

.man-head { 
  position: absolute; top: 50px; left: 132px; 
  width: 50px; height: 50px; 
  border: 4px solid #fff; border-radius: 50%; 
  color: #fff; display: flex; align-items: center; justify-content: center; 
  font-weight: bold; font-size: 12px; letter-spacing: 2px;
}
.man-body  { position: absolute; top: 100px; left: 155px; width: 4px; height: 80px; background: #fff; }
.man-arm-l { position: absolute; top: 120px; left: 125px; width: 30px; height: 4px; background: #fff; transform: rotate(30deg); }
.man-arm-r { position: absolute; top: 120px; left: 159px; width: 30px; height: 4px; background: #fff; transform: rotate(-30deg); }
.man-leg-l { position: absolute; top: 175px; left: 135px; width: 30px; height: 4px; background: #fff; transform: rotate(-45deg); }
.man-leg-r { position: absolute; top: 175px; left: 159px; width: 30px; height: 4px; background: #fff; transform: rotate(45deg); }

.error-tag {
  position: absolute;
  bottom: -10px;
  left: 40%;
  transform: translateX(-50%);
  background: #ff4757;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  white-space: nowrap;
  margin-bottom: 20px;
}

.board-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.word-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  padding: 30px;
}

.word-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.letter-slot {
  width: 50px; height: 60px;
  border-bottom: 4px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: bold; text-transform: uppercase;
}
.letter-slot.revealed { border-bottom: none; background: #4ECDC4; color: #1a1625; border-radius: 8px; }

.hint-container { display: flex; justify-content: center; }
.hint-bubble {
  background: #2d98da;
  padding: 8px 20px;
  border-radius: 20px;
  display: flex; align-items: center; gap: 10px;
}

.keyboard-wrapper {
  padding: 10px;
}

.keyboard-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 700px;
  margin: 0 auto;
}

.key-btn {
  width: 45px;
  height: 50px;
  border: none;
  background: #e0e0e0;
  border-bottom: 4px solid #999;
  border-radius: 8px;
  color: #333;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.key-btn:active:not(:disabled) { transform: translateY(4px); border-bottom-width: 0; }

.key-correct { background: #4ECDC4; border-color: #26857e; color: white; }
.key-wrong { background: #ff6b6b; border-color: #c0392b; color: white; }
.key-disabled { opacity: 0.6; transform: translateY(4px); border-bottom-width: 0; cursor: not-allowed; }

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex; justify-content: center; align-items: center;
  z-index: 100;
}
.modal-card {
  background: #fff; color: #333;
  padding: 30px; border-radius: 20px;
  text-align: center; width: 90%; max-width: 400px;
}
.modal-win h2 { color: #4ECDC4; }
.modal-lose h2 { color: #ff6b6b; }
.modal-emoji { font-size: 4rem; }
.modal-btns { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
.action-btn {
  padding: 10px 20px; border: none; border-radius: 8px;
  font-weight: bold; cursor: pointer;
}
.primary { background: #4ECDC4; color: white; }
.secondary { background: #eee; color: #333; }

.shake { animation: shakeAnim 0.5s; }
@keyframes shakeAnim {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 768px) {
  .game-board { grid-template-columns: 1fr; }
  .board-left { height: 250px; }
  .key-btn { width: 35px; height: 40px; font-size: 1rem; }
}
</style>
