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
    props.data?.email && { label: 'Електронна пошта', value: props.data.email },
    props.data?.reqnum && { label: 'Номер листа', value: props.data.reqnum },
    props.data?.createdAt && { label: 'Дата відкриття', value: dateToStr(props.data.createdAt) },
    props.data?.fullname && { label: "Прізвище та ім'я", value: props.data.fullname },
    props.data?.phone && { label: 'Номер телефону', value: props.data.phone },
    props.data?.status && { label: 'Статус', value: props.data.status },
    props.data?.organization?.name && { label: 'Організація', value: props.data.organization.name },
    props.data?.subdivision?.name && { label: 'Підрозділ', value: props.data.subdivision.name },
    props.data?.department?.name && { label: 'Відділ', value: props.data.department.name },
    props.data?.position?.name && { label: 'Посада', value: props.data.position.name },
    props.data?.comment && { label: 'Коментар', value: props.data.comment }
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
