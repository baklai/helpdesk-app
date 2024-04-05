<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();

const isFullScreen = ref(false);

const toggleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    // IE/Edge
    document.documentElement.msRequestFullscreen();
  }
};

onMounted(() => {
  window.addEventListener('fullscreenchange', event => {
    isFullScreen.value = document.fullscreenElement !== null && !!event;
  });
});

watchEffect(() => {
  if (isFullScreen.value) {
    toast.add({
      severity: 'info',
      summary: t('HD Information'),
      detail: t('Helpdesk is now in full screen mode (Exit full screen mode: Esc)'),
      life: 3000
    });
  }
});
</script>

<template>
  <Button
    text
    plain
    rounded
    class="text-2xl w-12 h-12"
    :icon="`pi ${isFullScreen ? 'pi-window-minimize' : 'pi-window-maximize'}`"
    v-tooltip.bottom="$t('Maximize/Minimize')"
    @click="toggleFullScreen"
  />
</template>
