<template>
  <div>
    <h3>Host Script Output</h3>
    <table>
      <tr class="head">
        <td>Script Name</td>
        <td>Output</td>
      </tr>
      <tr v-for="script in scripts" :key="script.id">
        <td>{{ script.id }}</td>
        <td>
          <pre>{{ script.output }}</pre>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const scripts = ref($props.script);
</script>
