<template>
  <div class="juego-container">

    <div class="header">
      <h1>Ahorcado</h1>
      <div class="info">
        <p><strong>Jugador:</strong> {{ playerName }}</p>
        <p><strong>Categoría:</strong> {{ category }}</p>
        <p><strong>Nivel:</strong> {{ level }}</p>
        <p><strong>Intentos restantes:</strong> {{ maxErrors - errors }}</p>

        <div class="life-bar">
          <div class="life" :style="{ width: lifePercent + '%' }"></div>
        </div>
      </div>

      <div class="timer" :class="{ danger: timeLeft <= 5 }">
        Tiempo: {{ timeLeft }}s
      </div>
    </div>

    <!-- Ahorcado -->
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

    <!-- Palabra -->
    <div class="word">
      <span v-for="(letter, index) in displayWord" :key="index" class="letter">
        {{ letter }}
      </span>
    </div>

    <!-- Teclado -->
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

    <!-- PISTA SOLO EN MODO FÁCIL -->
    <div v-if="level.toLowerCase() === 'fácil' || level.toLowerCase() === 'facil'" class="hint-box">
      <p><strong>Pista:</strong> {{ hintText }}</p>
    </div>

    <!-- Game Over -->
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

    // DATOS GUARDADOS
    const playerName = localStorage.getItem("nombreJugador") || "Jugador";
    const category = (localStorage.getItem("categoriaSeleccionada") || "General").trim();
    const level = localStorage.getItem("nivelSeleccionado") || "Fácil";

    // Tiempo por nivel
    const timeConfig = {
      facil: 300,
      medio: 240,
      dificil: 180
    };

    const timeLeft = ref(timeConfig[level.toLowerCase()] || 240);
    let timer;

    // Intentos
    const maxErrors = Number(localStorage.getItem("intentosMax")) || 6;

    const shakeEffect = ref(false);

    // BANCO DE PALABRAS COMPLETO
    const wordBank = {
      Animales: ["PERRO", "GATO", "LEON", "TORTUGA", "ELEFANTE", "CABALLO"],
      Comida: ["PIZZA", "HAMBURGUESA", "SPAGHETTI", "ARROZ", "EMPANADA", "PERROCALIENTE"],
      Países: ["COLOMBIA", "MEXICO", "ARGENTINA", "BRASIL", "PERU", "CHILE"],
      Deportes: ["FUTBOL", "TENIS", "BALONCESTO", "NATACION", "CICLISMO"],
      Tecnología: ["CELULAR", "TECLADO", "COMPUTADOR", "MONITOR"],
      Películas: ["TITANIC", "AVATAR", "GLADIADOR", "COCO", "FROZEN"],
      General: ["AHORCADO", "PROGRAMAR", "JUEGO"]
    };

    // PALABRA ALEATORIA
    const selectedWord =
      wordBank[category] && wordBank[category].length > 0
        ? wordBank[category][Math.floor(Math.random() * wordBank[category].length)]
        : "ERROR";

    // PISTAS COMPLETAS
    const hints = {
      // Animales
      PERRO: "Es el mejor amigo del hombre.",
      GATO: "Animal que maúlla.",
      LEON: "El rey de la selva.",
      TORTUGA: "Tiene caparazón.",
      ELEFANTE: "Tiene una gran trompa.",
      CABALLO: "Se puede montar.",

      // Comida
      PIZZA: "Comida italiana famosa.",
      HAMBURGUESA: "Carne entre panes.",
      SPAGHETTI: "Pasta larga.",
      ARROZ: "Grano blanco común.",
      EMPANADA: "Frita y rellena.",
      PERROCALIENTE: "Pan con salchicha.",

      // Países
      COLOMBIA: "Su capital es Bogotá.",
      MEXICO: "Muy famoso por los tacos.",
      ARGENTINA: "Cuna del tango.",
      BRASIL: "Famoso por el carnaval.",
      PERU: "Hogar de Machu Picchu.",
      CHILE: "Uno de los países más largos.",

      // Deportes
      FUTBOL: "Se juega con un balón y 11 jugadores.",
      TENIS: "Se juega con raquetas.",
      BALONCESTO: "Consiste en encestar una pelota.",
      NATACION: "Se practica en el agua.",
      CICLISMO: "Se practica en bicicleta.",

      // Tecnología
      CELULAR: "Lo usas varias veces al día.",
      TECLADO: "Tiene muchas teclas.",
      COMPUTADOR: "Sirve para trabajar o jugar.",
      MONITOR: "Pantalla donde ves todo.",

      // Películas
      TITANIC: "Trata de un barco hundido.",
      AVATAR: "Personajes de color azul.",
      GLADIADOR: "Peleas en la antigua Roma.",
      COCO: "Película sobre el Día de Muertos.",
      FROZEN: "La reina del hielo.",

      // General
      AHORCADO: "Es el juego que estás jugando.",
      PROGRAMAR: "Crear software.",
      JUEGO: "Actividad divertida."
    };

    const hintText = ref(hints[selectedWord] || "Sin pista disponible.");

    const usedLetters = ref([]);
    const errors = ref(0);

    const lifePercent = computed(() => ((maxErrors - errors.value) / maxErrors) * 100);

    const displayWord = computed(() =>
      selectedWord.split("").map(letter =>
        usedLetters.value.includes(letter) ? letter : "_"
      )
    );

    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

    const gameOver = ref(false);
    const finalMessage = ref("");

    // FINALIZA JUEGO
    const endGame = (msg) => {
      finalMessage.value = msg;
      gameOver.value = true;
      clearInterval(timer);

      const totalTime = timeConfig[level.toLowerCase()];
      const usedTime = totalTime - timeLeft.value;

      const results = JSON.parse(localStorage.getItem("results") || "[]");

      results.push({
        player: playerName,
        category,
        level,
        word: selectedWord,
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

    const goToResults = () => router.push("/tiempos");

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
/* (Tu CSS queda igual, no necesita cambios) */
</style>

