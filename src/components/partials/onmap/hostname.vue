<script setup>
import { ref } from 'vue';

const props = defineProps(['name', 'type']);
</script>

<template>
  <li>{{ name }} ({{ type }})</li>
</template>
