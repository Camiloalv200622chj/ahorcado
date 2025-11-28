<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal-box">
      <p>{{ mensaje }}</p>
      <button @click="$emit('cerrar')" class="btn-cerrar">OK</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mensaje: String
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: #5d009c;
  padding: 25px;
  border-radius: 12px;
  color: white;
  text-align: center;
  width: 300px;
}

.btn-cerrar {
  margin-top: 15px;
  background: #b24cff;
  border: none;
  padding: 10px 18px;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
</style>
