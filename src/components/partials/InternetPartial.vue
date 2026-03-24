<script setup>
import { computed } from 'vue';

import { INTERNET_STATUS } from '@/constants/ui.const';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
});

const internetStatus = computed(
  () => INTERNET_STATUS.find(item => props.data?.status === item.key)?.label
);

const rows = computed(() =>
  [
    props?.data?.reqnum && { label: 'Номер листа', value: props.data.reqnum },
    internetStatus?.value && { label: 'Статус', value: internetStatus.value },
    props?.data?.comment && { label: 'Коментар', value: props.data.comment }
  ].filter(Boolean)
);
</script>

<template>
  <slot name="header" />

  <table v-if="data" class="dark:text-surface-100 text-surface-700 text-md w-full font-normal">
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.label"
        class="border-surface-200 dark:border-surface-800 border-b"
      >
        <td class="py-1" width="50%">{{ row.label }} :</td>
        <td class="py-1">{{ row.value }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
