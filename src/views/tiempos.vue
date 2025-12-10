<template>
  <div class="tiempos-wrapper">
    <div class="tiempos-content">
      <h1 class="titulo">🏆 Mejores Tiempos – Solo Ganadores</h1>

      <button class="back-btn" @click="goHome">
        <span class="icon">🚀</span> Volver al inicio
      </button>

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
          <tr v-for="(r, i) in filteredResults" :key="i" :data-nivel="r.level">
            <td class="posicion">{{ i + 1 }} {{ medalEmoji(i) }}</td>
            <td>{{ r.player }}</td>
            <td>{{ r.category }}</td>
            <td class="nivel">{{ r.level }}</td>
            <td>{{ r.word }}</td>
            <td class="tiempo">{{ formatTime(r.tiempo) }}</td>
            <td>{{ new Date(r.date).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>

      <p v-if="filteredResults.length === 0" class="no-data">
        ⚠ No hay ganadores registrados aún.
      </p>
    </div>
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
.tiempos-wrapper {
  background-color: #1a0033;
  background-image: 
    radial-gradient(circle at center, rgba(123, 58, 245, 0.15) 0%, transparent 40%),
    linear-gradient(to right, #3c0066 1px, transparent 1px),
    linear-gradient(to bottom, #3c0066 1px, transparent 1px);
  background-size: 40px 40px;
  min-height: 100vh;
  padding: 50px 30px;
  text-align: center;
  color: white;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);
}

.tiempos-content {
  max-width: 1200px;
  margin: 0 auto;
}

.titulo {
  font-family: 'Arial Black', sans-serif;
  font-size: 40px; 
  font-weight: 900;
  margin-bottom: 40px; 
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


.back-btn {
  background: linear-gradient(90deg, #a855f7, #7c3aed);
  padding: 14px 25px;
  border: none;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
  transition: 0.3s ease-in-out;
}

.back-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(168, 85, 247, 1);
}

.back-btn .icon {
    margin-right: 5px;
}

.filtro {
  margin: 20px 0 40px;
  font-size: 18px;
}

.filtro label {
  margin-right: 15px;
}

.filtro select {
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid #a855f7; 
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
  appearance: none; 
  cursor: pointer;
}

.tabla {
  width: 100%;
  background: rgba(255, 255, 255, 0.05); 
  border-collapse: separate; 
  border-spacing: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.4); 
}

.tabla thead {
    background: linear-gradient(90deg, #4d0094, #7c3aed); 
    border-bottom: 3px solid #a855f7;
}

.tabla th,
.tabla td {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.tabla th {
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tabla tbody tr:last-child td {
  border-bottom: none;
}

.tabla tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.03);
}

.tabla tbody tr:nth-child(1) .posicion { color: #FFD700; font-weight: bold; font-size: 1.2em; }
.tabla tbody tr:nth-child(2) .posicion { color: #C0C0C0; font-weight: bold; }
.tabla tbody tr:nth-child(3) .posicion { color: #CD7F32; font-weight: bold; }

.tabla td.tiempo {
    color: #32CD32; 
    font-weight: bold;
}

.tabla td.nivel {
  text-transform: capitalize;
  font-weight: bold;
}
.tabla tr[data-nivel="facil"] .nivel { color: #32CD32; }
.tabla tr[data-nivel="medio"] .nivel { color: #FFD700; }
.tabla tr[data-nivel="dificil"] .nivel { color: #FF4500; }

.no-data {
  margin-top: 30px;
  font-size: 20px;
  color: #c084ff; 
}
</style>

