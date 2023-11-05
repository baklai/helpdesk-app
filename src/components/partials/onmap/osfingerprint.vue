<script setup>
import { ref, computed } from 'vue';

const fingerprint = ref($props.fingerprint);
const varAddress = ref($props.varAddress);

const hasOsmatch = computed(() => $props.osmatch.length === 0);
</script>

<template>
  <div>
    <ul>
      <template v-if="hasOsmatch">
        <li class="noprint">
          OS identified but the fingerprint was requested at scan time.
          <a :href="'javascript:toggle(\'osblock_' + varAddress + '\');'">
            <span class="noprint"><small> (click to expand)</small></span>
          </a>
        </li>
      </template>
    </ul>
    <div :id="'osblock_' + varAddress" :class="{ hidden: !hasOsmatch }">
      <table class="noprint" cellspacing="1">
        <tr class="head">
          <td>Operating System fingerprint</td>
        </tr>
        <tr>
          <td>
            <pre>{{ fingerprint }}</pre>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
