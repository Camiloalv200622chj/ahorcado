<template>
  <div class="juego-container">

    <!-- Header del juego -->
    <div class="header">
      <h1>Ahorcado</h1>
      <div class="info">
        <p><strong>Jugador:</strong> {{ playerName }}</p>
        <p><strong>Categoría:</strong> {{ category }}</p>
        <p><strong>Nivel:</strong> {{ level }}</p>
      </div>

      <!-- Tiempo -->
      <div class="timer" :class="{ danger: timeLeft <= 5 }">
        Tiempo: {{ timeLeft }}s
      </div>
    </div>

    <!-- Muñeco Ahorcado -->
    <div class="hangman">
      <div class="pole"></div>
      <div class="beam"></div>
      <div class="rope"></div>

      <div class="head" v-if="errors >= 1"></div>
      <div class="body" v-if="errors >= 2"></div>
      <div class="arm left" v-if="errors >= 3"></div>
      <div class="arm right" v-if="errors >= 4"></div>
      <div class="leg left" v-if="errors >= 5"></div>
      <div class="leg right" v-if="errors >= 6"></div>
    </div>

    <!-- Palabra -->
    <div class="word">
      <span v-for="(letter, index) in displayWord" :key="index" class="letter">
        {{ letter }}
      </span>
    </div>

    <!-- Letras -->
    <div class="letters">
      <button
        v-for="(letter, index) in alphabet"
        :key="index"
        class="letter-btn"
        :disabled="usedLetters.includes(letter)"
        @click="selectLetter(letter)"
      >
        {{ letter }}
      </button>
    </div>

    <!-- Mensaje final -->
    <div v-if="gameOver" class="final-message">
      <h2>{{ finalMessage }}</h2>
      <button class="btn" @click="goToResults">Ver resultados</button>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    // Datos del jugador
    const playerName = localStorage.getItem("nombreJugador") || "Jugador";
    const category = localStorage.getItem("category") || "General";
    const level = localStorage.getItem("level") || "Fácil";

    // Tiempo por nivel
    const timeConfig = {
      Fácil: 300,
      Medio: 240,
      Difícil: 180
    };

    const timeLeft = ref(timeConfig[level]);
    let timer;

    // ✅ Palabras por categoría (6 CATEGORÍAS NUEVAS, 6 PALABRAS CADA UNA)
    const wordBank = {
      Animales: [
        "PERRO", "GATO", "LEON", "TORTUGA", "ELEFANTE", "CABALLO"
      ],
      Comida: [
        "PIZZA", "HAMBURGUESA", "SPAGHETTI", "ARROZ", "EMPANADA", "PERROCALIENTE"
      ],
      Paises: [
        "COLOMBIA", "MEXICO", "ARGENTINA", "BRASIL", "PERU", "CHILE"
      ],
      Frutas: [
        "MANZANA", "BANANO", "SANDIA", "MELON", "PERA", "KIWI"
      ],
      Colores: [
        "ROJO", "AZUL", "VERDE", "AMARILLO", "NARANJA", "MORADO"
      ],
      Objetos: [
        "MESA", "SILLA", "CELULAR", "COMPUTADOR", "LAPIZ", "CAMA"
      ],
      General: [
        "AHORCADO", "JUEGO", "PROGRAMAR"
      ]
    };

    // Seleccionar palabra según categoría
    const selectedWord =
      wordBank[category][Math.floor(Math.random() * wordBank[category].length)];

    const usedLetters = ref([]);
    const errors = ref(0);
    const maxErrors = 6;

    const displayWord = computed(() =>
      selectedWord
        .split("")
        .map((letter) =>
          usedLetters.value.includes(letter) ? letter : "_"
        )
    );

    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

    const gameOver = ref(false);
    const finalMessage = ref("");

    // GUARDAR RESULTADO
    const endGame = (message) => {
      finalMessage.value = message;
      gameOver.value = true;
      clearInterval(timer);

      const totalTime = timeConfig[level];
      const timeUsed = totalTime - timeLeft.value;

      const results = JSON.parse(localStorage.getItem("results") || "[]");

      const newResult = {
        player: playerName,
        category,
        level,
        word: selectedWord,
        result: message.includes("Ganaste") ? "Ganó" : "Perdió",
        errors: errors.value,
        tiempo: timeUsed,
        date: new Date().toISOString(),
      };

      results.push(newResult);
      localStorage.setItem("results", JSON.stringify(results));
    };

    // Selección de letras
    const selectLetter = (letter) => {
      if (gameOver.value) return;

      usedLetters.value.push(letter);

      if (!selectedWord.includes(letter)) {
        errors.value++;
        if (errors.value >= maxErrors) {
          endGame("Perdiste 😢");
          return;
        }
      }

      if (!displayWord.value.includes("_")) {
        endGame("Ganaste 🎉");
      }
    };

    // TIMER
    onMounted(() => {
      timer = setInterval(() => {
        if (timeLeft.value > 0) timeLeft.value--;
        else endGame("Se acabó el tiempo ⏳");
      }, 1000);
    });

    const goToResults = () => {
      router.push("/tiempos");
    };

    return {
      playerName,
      category,
      level,
      timeLeft,
      alphabet,
      displayWord,
      usedLetters,
      selectLetter,
      errors,
      gameOver,
      finalMessage,
      goToResults
    };
  }
};
</script>

<style scoped>
.juego-container {
  text-align: center;
  color: white;
  padding: 20px;
  background: #3b1e5e;
  min-height: 100vh;
}

.header {
  margin-bottom: 20px;
}

.info p {
  margin: 0;
}

.timer {
  font-size: 24px;
  font-weight: bold;
  background: #5c2d91;
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.timer.danger {
  background: red;
  color: black;
}

.hangman {
  margin: 20px auto;
  width: 200px;
  height: 300px;
  position: relative;
}

.pole {
  width: 10px;
  height: 250px;
  background: white;
  position: absolute;
  left: 10px;
  top: 20px;
}

.beam {
  width: 120px;
  height: 10px;
  background: white;
  position: absolute;
  left: 10px;
  top: 20px;
}

.rope {
  width: 2px;
  height: 40px;
  background: white;
  position: absolute;
  left: 130px;
  top: 30px;
}

.head {
  width: 50px;
  height: 50px;
  border: 3px solid white;
  border-radius: 50%;
  position: absolute;
  left: 105px;
  top: 70px;
}

.body {
  width: 3px;
  height: 70px;
  background: white;
  position: absolute;
  left: 130px;
  top: 120px;
}

.arm {
  width: 40px;
  height: 3px;
  background: white;
  position: absolute;
  top: 150px;
}

.arm.left {
  left: 90px;
}

.arm.right {
  left: 130px;
}

.leg {
  width: 3px;
  height: 50px;
  background: white;
  position: absolute;
  top: 190px;
}

.leg.left {
  left: 115px;
}

.leg.right {
  left: 145px;
}

.word {
  margin: 20px;
  font-size: 30px;
  letter-spacing: 12px;
}

.letters {
  margin-top: 20px;
}

.letter-btn {
  background: #5c2d91;
  color: white;
  border: none;
  padding: 10px 14px;
  margin: 4px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.letter-btn:disabled {
  background: #a883d3;
}

.final-message {
  margin-top: 20px;
  font-size: 28px;
}

.btn {
  background: #8a2be2;
  padding: 12px 20px;
  border: none;
  color: white;
  margin-top: 10px;
  border-radius: 8px;
  cursor: pointer;
}

/* Ocultar el wrapper que mete Quasar */
.page-wrapper {
  display: none !important;
}
</style>
