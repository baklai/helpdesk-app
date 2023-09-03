<template>
  <main
    class="background-app surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <main class="w-30rem justify-content-center align-items-center">
        <RouterView />
      </main>
    </div>
  </main>
</template>

<style scoped>
.background-app {
  background-image: url('/img/bg-app.webp');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
