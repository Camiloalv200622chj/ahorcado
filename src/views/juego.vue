<template>
  <div class="juego-container">

    <div class="header">
      <h1>Ahorcado</h1>
      <div class="info">
        <p><strong>Jugador:</strong> {{ playerName }}</p>
        <p><strong>Categoría:</strong> {{ category }}</p>
        <p><strong>Nivel:</strong> {{ level }}</p>

        <p><strong>Intentos:</strong> {{ maxErrors - errors }}</p>

        <div class="life-bar">
          <div
            class="life"
            :style="{ width: lifePercent + '%' }"
          ></div>
        </div>
      </div>

      <div class="timer" :class="{ danger: timeLeft <= 5 }">
        Tiempo: {{ timeLeft }}s
      </div>
    </div>

    <div class="hangman" :class="{ shake: shakeEffect }">
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

    <div class="word">
      <span v-for="(letter, index) in displayWord" :key="index" class="letter">
        {{ letter }}
      </span>
    </div>

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

    <div v-if="level === 'Fácil'" class="hint-box">
      <p><strong>Pista:</strong> {{ hintText }}</p>
    </div>

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

    const playerName = localStorage.getItem("nombreJugador") || "Jugador";
    const category = localStorage.getItem("category") || "General";
    const level = localStorage.getItem("nivelSeleccionado") || "Fácil";

    const timeConfig = {
      facil: 300,
      medio: 240,
      dificil: 180
    };

    const timeLeft = ref(timeConfig[level] || 240);
    let timer;

    const maxErrors = Number(localStorage.getItem("intentosMax")) || 6;

    const shakeEffect = ref(false);

    const wordBank = {
      Animales: ["PERRO", "GATO", "LEON", "TORTUGA", "ELEFANTE", "CABALLO"],
      Comida: ["PIZZA", "HAMBURGUESA", "SPAGHETTI", "ARROZ", "EMPANADA", "PERROCALIENTE"],
      Paises: ["COLOMBIA", "MEXICO", "ARGENTINA", "BRASIL", "PERU", "CHILE"],
      Frutas: ["MANZANA", "BANANO", "SANDIA", "MELON", "PERA", "KIWI"],
      Colores: ["ROJO", "AZUL", "VERDE", "AMARILLO", "NARANJA", "MORADO"],
      Objetos: ["MESA", "SILLA", "CELULAR", "COMPUTADOR", "LAPIZ", "CAMA"],
      General: ["AHORCADO", "JUEGO", "PROGRAMAR"]
    };

    const hints = {
      PERRO: "Es el mejor amigo del hombre.",
      GATO: "Le gusta cazar ratones.",
      LEON: "Es conocido como el rey de la selva.",
      TORTUGA: "Tiene un caparazón muy duro.",
      ELEFANTE: "Tiene una trompa larga.",
      CABALLO: "Se usa para montar.",

      PIZZA: "Comida italiana muy popular.",
      HAMBURGUESA: "Viene en pan y suele tener carne.",
      SPAGHETTI: "Pasta larga y delgada.",
      ARROZ: "Grano blanco muy consumido.",
      EMPANADA: "Masa rellena con carne o pollo.",
      PERROCALIENTE: "Pan con salchicha.",

      COLOMBIA: "Su capital es Bogotá.",
      MEXICO: "Famoso por los tacos.",
      ARGENTINA: "Famosa por el tango.",
      BRASIL: "Es conocido por el carnaval.",
      PERU: "Tiene Machu Picchu.",
      CHILE: "Es un país muy largo.",

      MANZANA: "Fruta de Blancanieves.",
      BANANO: "Amarillo y lo comen los monos.",
      SANDIA: "Es roja por dentro y tiene semillas negras.",
      MELON: "Fruta dulce verde o naranja.",
      PERA: "Fruta verde, jugosa y alargada.",
      KIWI: "Fruta café por fuera y verde por dentro.",

      ROJO: "Color de la sangre.",
      AZUL: "Color del cielo.",
      VERDE: "Color del césped.",
      AMARILLO: "Color del sol.",
      NARANJA: "Color de una fruta cítrica.",
      MORADO: "Color asociado a la realeza.",

      MESA: "Tiene patas y se usa para comer.",
      SILLA: "Sirve para sentarse.",
      CELULAR: "Lo usas para llamar o chatear.",
      COMPUTADOR: "Máquina para trabajar o jugar.",
      LAPIZ: "Se usa para escribir.",
      CAMA: "La usas para dormir.",

      AHORCADO: "Es el nombre del juego.",
      JUEGO: "Actividad que entretiene.",
      PROGRAMAR: "Crear software."
    };

    const selectedWord =
      wordBank[category][Math.floor(Math.random() * wordBank[category].length)];

    const hintText = ref(hints[selectedWord] || "Sin pista disponible.");

    const usedLetters = ref([]);
    const errors = ref(0);

    const lifePercent = computed(() => ((maxErrors - errors.value) / maxErrors) * 100);

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

    const selectLetter = (letter) => {
      if (gameOver.value) return;

      usedLetters.value.push(letter);

      if (!selectedWord.includes(letter)) {
        errors.value++;

        shakeEffect.value = true;
        setTimeout(() => (shakeEffect.value = false), 400);

        if (errors.value >= maxErrors) {
          endGame("Perdiste 😢");
          return;
        }
      }

      if (!displayWord.value.includes("_")) {
        endGame("Ganaste 🎉");
      }
    };

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
      maxErrors,
      lifePercent,
      shakeEffect,
      gameOver,
      finalMessage,
      goToResults,
      hintText
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

.hint-box {
  margin-top: 20px;
  background: #5c2d91;
  padding: 12px;
  border-radius: 10px;
  font-size: 18px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.header {
  margin-bottom: 20px;
}

.info p {
  margin: 0;
}

.life-bar {
  width: 200px;
  height: 15px;
  background: #4a256f;
  border-radius: 8px;
  margin: 10px auto;
  overflow: hidden;
}

.life {
  height: 100%;
  background: #00ff8c;
  transition: width 0.4s ease;
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

.shake {
  animation: shakeAnim 0.3s ease-in-out;
}

@keyframes shakeAnim {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
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

.page-wrapper {
  display: none !important;
}
</style>



