<template>
  <tr :class="portClass">
    <td>{{ portid }}</td>
    <td>{{ protocol }}</td>
    <td>{{ state }}</td>
    <td>{{ serviceName }}</td>
    <td>
      {{ stateReason }}
      <span v-if="stateReasonIp"> from {{ stateReasonIp }}</span>
    </td>
    <td>{{ serviceProduct }}</td>
    <td>{{ serviceVersion }}</td>
    <td>{{ serviceExtraInfo }}</td>
  </tr>
</template>

<script setup>
import { ref } from 'vue';

const portid = ref($props.portid);
const protocol = ref($props.protocol);
const state = ref($props.state);
const serviceName = ref($props.serviceName);
const stateReason = ref($props.stateReason);
const stateReasonIp = ref($props.stateReasonIp);
const serviceProduct = ref($props.serviceProduct);
const serviceVersion = ref($props.serviceVersion);
const serviceExtraInfo = ref($props.serviceExtraInfo);

const portClass = ref(
  $props.state === 'open' ? 'open' : $props.state === 'filtered' ? 'filtered' : 'closed'
);
</script>
