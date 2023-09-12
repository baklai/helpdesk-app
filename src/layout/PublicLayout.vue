<template>
  <main
    class="bg-app flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <div class="w-min justify-content-center align-items-center">
        <router-view />
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-app {
  background-image: url('/img/bg-app.webp');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
