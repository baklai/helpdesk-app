<script setup>
import { dateToStr } from '@/service/DataFilters';

defineProps({
  record: {
    type: Object,
    default: () => {},
    required: true
  },
  internet: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="flex items-center mb-6">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" class="mr-2">
      <path
        fill="currentColor"
        d="M19 5V19H5V5H19M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9 7H7V17H9V7M15 7H11V17H13V13H15C16.1 13 17 12.1 17 11V9C17 7.9 16.1 7 15 7M15 11H13V9H15V11Z"
      />
    </svg>
    <div>
      <p class="text-lg">IP {{ record?.ipaddress || '-' }}</p>
      <p class="text-base font-normal">
        {{ $t('Date open') }} : {{ dateToStr(record?.date) || '-' }}
      </p>
    </div>
  </div>

  <table class="w-full text-lg font-normal">
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Location') }} :</td>
      <td>{{ record?.location?.name || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Unit') }} :</td>
      <td>{{ record?.unit?.name || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('IP Address') }} :</td>
      <td>{{ record?.ipaddress || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Mask') }} :</td>
      <td>{{ record?.mask || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Gateway') }} :</td>
      <td>{{ record?.gateway || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Letter number') }} :</td>
      <td>{{ record?.reqnum || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Organization') }} :</td>
      <td>{{ record?.organization?.name || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Subdivision') }} :</td>
      <td>{{ record?.subdivision?.name || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Department') }} :</td>
      <td>{{ record?.department?.name || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Fullname') }} :</td>
      <td>{{ record?.fullname || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Position') }} :</td>
      <td>{{ record?.position?.name || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Phone') }} :</td>
      <td>{{ record?.phone || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Autoanswer') }} :</td>
      <td>{{ record?.autoanswer || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Date open') }} :</td>
      <td>{{ dateToStr(record?.date) || '-' }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Comment') }} :</td>
      <td>{{ record?.comment }}</td>
    </tr>
    <tr class="border-b border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="50%">{{ $t('Internet') }} :</td>
      <td>
        <i :class="record?.inetStatus ? 'pi pi-check font-bold text-green-500' : 'pi pi-ban'" />
      </td>
    </tr>
  </table>

  <table
    class="w-full"
    v-if="
      internet &&
      (record?.internet?.reqnum ||
        record?.internet?.dateOpen ||
        record?.internet?.dateClose ||
        record?.internet?.comment)
    "
  >
    <tr class="border-b py-2 border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="40%">{{ $t('Letter number') }} :</td>
      <td>{{ record?.internet?.reqnum || '-' }}</td>
    </tr>
    <tr class="border-b py-2 border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="40%">{{ $t('Date open') }} :</td>
      <td>{{ dateToStr(record?.internet?.dateOpen) || '-' }}</td>
    </tr>
    <tr class="border-b py-2 border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="40%">{{ $t('Date close') }} :</td>
      <td>{{ dateToStr(record?.internet?.dateClose) || '-' }}</td>
    </tr>
    <tr class="border-b py-2 border-surface-200 dark:border-surface-600">
      <td class="font-medium" width="40%">{{ $t('Comment') }} :</td>
      <td>{{ record?.internet?.comment }}</td>
    </tr>
  </table>
</template>
