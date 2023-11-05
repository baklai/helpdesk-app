<script setup>
import { ref } from 'vue';

const port = ref($props.port);
const varAddress = ref($props.varAddress);
const hops = ref($props.hop);

function hopClass(hop) {
  if (hop.rtt === '--') {
    return 'filtered';
  } else if (hop.rtt > 0) {
    return 'open';
  } else {
    return 'closed';
  }
}
</script>

<template>
  <div>
    <a :href="'javascript:toggle(\'trace_' + varAddress + '\');'">
      Traceroute Information
      <span class="noprint"><small> (click to expand)</small></span>
    </a>
    <div :id="'trace_' + varAddress" class="hidden">
      <ul v-if="port">
        <li>Traceroute data generated using port {{ port }}/{{ proto }}</li>
      </ul>
      <table cellspacing="1">
        <tr class="head">
          <td>Hop</td>
          <td>Rtt</td>
          <td>IP</td>
          <td>Host</td>
        </tr>
        <tr v-for="hop in hops" :key="hop.ttl" :class="hopClass(hop)">
          <td>{{ hop.ttl }}</td>
          <td v-if="hop.rtt !== '--">{{ hop.rtt }}</td>
          <td v-else>--</td>
          <td>{{ hop.ipaddr }}</td>
          <td>{{ hop.host }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
