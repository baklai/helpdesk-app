<script setup>
const props = defineProps(['address']);
</script>

<template>
  <div v-if="address">
    <h3>Address</h3>

    <ul>
      <li v-for="(item, index) in address" :key="`address${index}`">
        {{ item.item.addr }} - {{ item.item['vendor'] ? item.item.vendor : '' }} ({{
          item.item.addrtype
        }})
      </li>
    </ul>
  </div>
</template>
