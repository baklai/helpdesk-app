<script setup>
import { ref, computed } from 'vue';

const hostnames = ref($props.hostnames);

const hasHostnames = computed(() => {
  const hostname = hostnames.value[0];
  return hostname && hostname.name !== '';
});
</script>

<template>
  <div v-if="hasHostnames">
    <h3>Hostnames</h3>
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>
