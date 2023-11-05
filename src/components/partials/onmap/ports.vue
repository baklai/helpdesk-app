<template>
  <div>
    <h3>Ports</h3>
    <div v-for="extraports in extraports" :key="extraports">
      <p v-if="extraports.count > 0">
        The {{ extraports.count }} ports scanned but not shown below are in state:
        <b>{{ extraports.state }}</b>
      </p>
      <ul>
        <li v-for="extrareason in extraports.extrareasons" :key="extrareason">
          <p v-if="extrareason.count > 0">
            {{ extrareason.count }} ports replied with:
            <b>{{ extrareason.reason }}</b>
          </p>
        </li>
      </ul>
    </div>
    <table :id="'porttable_' + var_address" cellspacing="1">
      <tr class="head">
        <td colspan="2">Port</td>
        <td>
          State
          <a :href="'javascript:togglePorts(\'porttable_' + var_address + '\', \'closed\');'">
            <span class="noprint"
              ><small>(toggle closed [{{ closed_count }}])</small></span
            >
          </a>
          <a :href="'javascript:togglePorts(\'porttable_' + var_address + '\', \'filtered\');'">
            <span class="noprint"
              ><small>| filtered [{{ filtered_count }}])</small></span
            >
          </a>
        </td>
        <td>Service</td>
        <td>Reason</td>
        <td>Product</td>
        <td>Version</td>
        <td>Extra info</td>
      </tr>
      <tr v-for="port in portStates" :key="port">
        <!-- Render port details here -->
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const extraports = ref($props.extraports);
const var_address = ref($props.var_address);
const closed_count = ref($props.closed_count);
const filtered_count = ref($props.filtered_count);

const portStates = computed(() => {
  // Compute port states or fetch them from props
  return [];
});
</script>
