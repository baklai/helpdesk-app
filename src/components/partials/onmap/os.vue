<template>
  <div>
    <h3>Remote Operating System Detection</h3>
    <p v-if="!hasOsmatch">Unable to identify operating system.</p>
    <ul>
      <li v-for="portused in portuseds" :key="portused">
        Used port:
        <b>{{ portused.portid }}/{{ portused.proto }}</b>
        (
        <b>{{ portused.state }}</b>
        )
      </li>
      <li v-for="osmatch in osmatches" :key="osmatch">
        OS match:
        <b>{{ osmatch.name }}</b>
        (
        <b>{{ osmatch.accuracy }}% </b>
        )
      </li>
    </ul>
    <os-fingerprint v-if="hasOsfingerprint" :osfingerprint="osfingerprint" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const portuseds = ref($props.portused);
const osmatches = ref($props.osmatch);
const osfingerprint = ref($props.osfingerprint);

const hasOsmatch = computed(() => osmatches.value.length > 0);
const hasOsfingerprint = computed(() => osfingerprint.value != null);
</script>
