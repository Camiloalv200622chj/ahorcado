<template>
  <div class="tiempos-container">
    <h1>🏆 Mejores Tiempos – Solo Ganadores</h1>

    <button class="back-btn" @click="goHome">Volver al inicio</button>

    <div class="filtro">
      <label>Filtrar por nivel:</label>
      <select v-model="selectedFilter">
        <option value="Todos">Todos</option>
        <option value="facil">Fácil</option>
        <option value="medio">Medio</option>
        <option value="dificil">Difícil</option>
      </select>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Jugador</th>
          <th>Categoría</th>
          <th>Nivel</th>
          <th>Palabra</th>
          <th>Tiempo</th>
          <th>Fecha</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(r, i) in filteredResults" :key="i">
          <td>{{ i + 1 }} {{ medalEmoji(i) }}</td>
          <td>{{ r.player }}</td>
          <td>{{ r.category }}</td>
          <td>{{ r.level }}</td>
          <td>{{ r.word }}</td>
          <td>{{ formatTime(r.tiempo) }}</td>
          <td>{{ new Date(r.date).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="filteredResults.length === 0" class="no-data">
      ⚠ No hay ganadores registrados aún.
    </p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const selectedFilter = ref("Todos");
    const results = ref([]);

    onMounted(() => {
      const stored = JSON.parse(localStorage.getItem("results") || "[]");

      // Solo GANADORES → pero NO se borra nada del localStorage
      const winners = stored.filter(r => r.result === "Ganó");

      winners.forEach(r => {
        r.tiempo = Number(r.tiempo ?? 0);
      });

      results.value = winners.sort((a, b) => a.tiempo - b.tiempo);
    });

    const filteredResults = computed(() => {
      if (selectedFilter.value === "Todos") return results.value;

      return results.value.filter(r => r.level === selectedFilter.value);
    });

    const formatTime = (sec) => {
      if (!sec && sec !== 0) return "00:00";
      const total = Math.floor(sec);
      const m = String(Math.floor(total / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      return `${m}:${s}`;
    };

    const medalEmoji = (i) => {
      if (i === 0) return "🥇";
      if (i === 1) return "🥈";
      if (i === 2) return "🥉";
      return "";
    };

    const goHome = () => router.push("/");

    return {
      results,
      filteredResults,
      selectedFilter,
      formatTime,
      medalEmoji,
      goHome,
    };
  },
};
</script>

<style scoped>
.tiempos-container {
  background: #2d004d;
  min-height: 100vh;
  padding: 30px;
  text-align: center;
  color: white;
}

.back-btn {
  background: #8a00d4;
  padding: 12px 20px;
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: 0.3s;
}

.back-btn:hover {
  background: #b24cff;
}

.filtro {
  margin: 20px 0;
}

.filtro select {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
}

.tabla {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
}

.tabla th,
.tabla td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tabla th {
  background: rgba(0, 0, 0, 0.3);
}

.no-data {
  margin-top: 20px;
  font-size: 22px;
}
</style>
