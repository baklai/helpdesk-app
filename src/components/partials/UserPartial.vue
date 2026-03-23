<script setup>
import { computed } from 'vue';

import { dateTimeToStr } from '@/utils/DateMethods';

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
    props.data?.fullname && { label: "Прізвище та ім'я", value: props.data.fullname },
    props.data?.email && { label: 'Електронна пошта', value: props.data.email },
    props.data?.phone && { label: 'Номер телефону', value: props.data.phone },
    props.data?.status && { label: 'Статус', value: props.data.status },
    props.data?.role && { label: 'Роль', value: props.data.role },
    props.data?.scope?.length && { label: 'Кількість дозволів', value: props.data.scope.length },
    props.data?.createdAt && {
      label: 'Дата реєстрації',
      value: dateTimeToStr(props.data.createdAt)
    },
    props.data?.updatedAt && {
      label: 'Останнє оновлення',
      value: dateTimeToStr(props.data.updatedAt)
    }
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
