<template>
  <div v-if="responses !== ''">
    <h3>Smurf Responses</h3>
    <ul>
      <li>{{ responses }} responses counted</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const responses = ref($props.responses);
</script>
