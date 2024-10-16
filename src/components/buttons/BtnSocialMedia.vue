<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: '#'
  },
  tooltip: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <a :href="href" target="_blank">
    <Button text plain rounded :icon="icon" class="h-12 w-12 text-2xl" v-tooltip.bottom="tooltip" />
  </a>
</template>
