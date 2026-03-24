<script setup>
import { computed } from 'vue';

import { REQUEST_STATUS } from '@/constants/ui.const';
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

const isClosed = computed(
  () =>
    props.data?.status &&
    ['resolved', 'closed', 'rejected', 'cancelled'].includes(props.data.status)
);

const requestStatus = computed(
  () => REQUEST_STATUS.find(item => props.data?.status === item.key)?.label
);

const rows = computed(() =>
  [
    props.data?.opened?.fullname && { label: 'Відкрив запит', value: props.data.opened.fullname },
    props.data?.createdAt && {
      label: 'Дата відкриття',
      value: dateTimeToStr(props.data.createdAt)
    },
    requestStatus?.value && { label: 'Статус', value: requestStatus.value },
    props.data?.request && { label: 'Запит', value: props.data.request },
    props.data?.location?.name && { label: 'Розташування', value: props.data.location.name },
    props.data?.fullname && { label: "Повне ім'я", value: props.data.fullname },
    props.data?.phone && { label: 'Телефон', value: props.data.phone },
    props.data?.position?.name && { label: 'Посада', value: props.data.position.name },
    props.data?.reqnum && { label: 'Номер листа', value: props.data.reqnum },
    props.data?.organization?.name && { label: 'Організація', value: props.data.organization.name },
    props.data?.subdivision?.name && { label: 'Підрозділ', value: props.data.subdivision.name },
    props.data?.department?.name && { label: 'Відділ', value: props.data.department.name },
    props.data?.updatedAt &&
      isClosed && { label: 'Дата закриття', value: dateTimeToStr(props.data.updatedAt) },
    props.data?.closed?.fullname && { label: 'Закрив запит', value: props.data.closed.fullname },
    props.data?.conclusion && { label: 'Висновок до запиту', value: props.data.conclusion },
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
        <td class="py-0.5" width="50%">{{ row.label }} :</td>
        <td class="py-0.5">{{ row.value }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="footer" />
</template>
