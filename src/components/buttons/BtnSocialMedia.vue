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
    <Button
      text
      plain
      rounded
      :icon="icon"
      iconClass="text-2xl"
      class="w-12 h-12 hover:text-primary-50"
      v-tooltip.bottom="tooltip"
    />
  </a>
</template>
