<script setup>
import { computed } from 'vue';

import { dateToStr } from '@/utils/DateMethods';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
});

const rows = computed(() =>
  [
    props.data?.locationFrom && { label: 'Поч. розташування', value: props.data.locationFrom },
    props.data?.deviceFrom && { label: 'Поч. пристрій', value: props.data.deviceFrom },
    props.data?.locationTo && { label: 'Кін. розташування', value: props.data.locationTo },
    props.data?.deviceTo && { label: 'Кін. пристрій', value: props.data.deviceTo },
    props.data?.level && { label: 'Рівень', value: props.data.level },
    props.data?.channelType && { label: 'Тип', value: props.data.channelType },
    props.data?.speed && { label: 'Швидкість', value: props.data.speed },
    props.data?.status && { label: 'Статус', value: props.data.status },
    props.data?.operator && { label: 'Оператор', value: props.data.operator },
    props.data?.composition && { label: 'Склад', value: props.data.composition },
    props.data?.createdAt && { label: 'Дата створення', value: dateToStr(props.data.createdAt) }
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
        <td class="py-0.5" width="50%">{{ row.label }} :</td>
        <td class="py-0.5">{{ row.value }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
