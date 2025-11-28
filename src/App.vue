<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">

    <!-- Contenido principal -->
    <q-page-container class="page-wrapper">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
</script>

<style>
/* Fondo general del proyecto tipo hoja limpia */
.main-layout {
  background: #ffffff;
  font-family: 'Segoe UI', sans-serif;
  color: #0a1a4a; /* azul oscuro del diseño */
}

.page-wrapper {
  justify-content: center;
  width: 100%;
}

/* Eliminamos margenes globales */
body, html {
  margin: 0;
  padding: 0;
}
</style>
