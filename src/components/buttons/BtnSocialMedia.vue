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
    <Button text plain rounded :icon="icon" class="text-2xl w-12 h-12" v-tooltip.bottom="tooltip" />
  </a>
</template>
