import { reactive } from 'vue'

export const store = reactive({
  player: '',
  categoria: '',
  nivel: '',
  palabras: [],
  palabraActual: '',
  usadas: [],
  intentos: 6,
  gano: false,
  perdio: false,
  resultados: JSON.parse(localStorage.getItem("resultados") || "[]"),

  resetGame() {
    this.usadas = []
    this.intentos = 6
    this.gano = false
    this.perdio = false
  },

  saveResult() {
    const info = {
      jugador: this.player,
      categoria: this.categoria,
      nivel: this.nivel,
      palabra: this.palabraActual,
      gano: this.gano,
      fecha: new Date().toLocaleString()
    }

    this.resultados.push(info)
    localStorage.setItem("resultados", JSON.stringify(this.resultados))
  }
})
