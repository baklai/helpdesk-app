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
    props.data?.device?.name && { label: 'Пристрій', value: props.data.device.name },
    props.data?.ipaddress && { label: 'IP-адресa', value: props.data.ipaddress },
    props.data?.mask && { label: 'Маска', value: props.data.mask },
    props.data?.gateway && { label: 'Шлюз', value: props.data.gateway },
    props.data?.createdAt && { label: 'Дата відкриття', value: dateToStr(props.data.createdAt) },
    props.data?.inventory && { label: 'Інвентарний номер', value: props.data.inventory },
    props.data?.location?.name && { label: 'Розташування', value: props.data.location.name },
    props.data?.reqnum && { label: 'Номер листа', value: props.data.reqnum },
    props.data?.organization?.name && { label: 'Організація', value: props.data.organization.name },
    props.data?.subdivision?.name && { label: 'Підрозділ', value: props.data.subdivision.name },
    props.data?.department?.name && { label: 'Відділ', value: props.data.department.name },
    props.data?.fullname && { label: "Прізвище та ім'я", value: props.data.fullname },
    props.data?.position?.name && { label: 'Посада', value: props.data.position.name },
    props.data?.phone && { label: 'Номер телефону', value: props.data.phone },
    props.data?.email && { label: 'Електронна пошта', value: props.data.email },
    props.data?.autoanswer && { label: 'Автовідповідь', value: props.data.autoanswer },
    props.data?.comment && { label: 'Коментар', value: props.data.comment },
    props.data?.internet?.status && { label: 'Інтернет', value: props.data.internet.status }
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
