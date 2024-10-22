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
  <div class="my-3" v-if="record">
    <div class="mb-6 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="40"
        height="40"
        class="mr-2"
      >
        <path
          fill="currentColor"
          d="M19 5V19H5V5H19M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9 7H7V17H9V7M15 7H11V17H13V13H15C16.1 13 17 12.1 17 11V9C17 7.9 16.1 7 15 7M15 11H13V9H15V11Z"
        />
      </svg>
      <div>
        <p class="text-lg">IP {{ record?.ipaddress || '-' }}</p>
        <p class="text-base font-normal">Дата відкриття : {{ dateToStr(record?.date) || '-' }}</p>
      </div>
    </div>

    <table class="w-full text-lg font-normal">
      <tbody>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Розташування :</td>
          <td>{{ record?.location?.name || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Пристрій :</td>
          <td>{{ record?.unit?.name || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">IP-адресa :</td>
          <td>{{ record?.ipaddress || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Маска :</td>
          <td>{{ record?.mask || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Шлюз :</td>
          <td>{{ record?.gateway || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Номер листа :</td>
          <td>{{ record?.reqnum || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Організація :</td>
          <td>{{ record?.organization?.name || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Підрозділ :</td>
          <td>{{ record?.subdivision?.name || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Відділ :</td>
          <td>{{ record?.department?.name || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Повне ім'я :</td>
          <td>{{ record?.fullname || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Посада :</td>
          <td>{{ record?.position?.name || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Телефон :</td>
          <td>{{ record?.phone || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Автовідповідь :</td>
          <td>{{ record?.autoanswer || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Дата відкриття :</td>
          <td>{{ dateToStr(record?.date) || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Коментар :</td>
          <td>{{ record?.comment }}</td>
        </tr>
        <tr class="border-b border-surface-200 dark:border-surface-600">
          <td class="font-medium" width="50%">Інтернет :</td>
          <td>
            <i :class="record?.inetStatus ? 'pi pi-check font-bold text-green-500' : 'pi pi-ban'" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="my-3" v-if="internet">
    <div class="mb-6 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="40"
        height="40"
        class="mr-2"
      >
        <path
          fill="currentColor"
          d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
        />
      </svg>
      <div>
        <p class="text-lg">Інтернет</p>
        <p class="text-base font-normal">
          Дата відкриття : {{ dateToStr(record?.internet?.dateOpen) || '-' }}
        </p>
      </div>
    </div>

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
      <tbody>
        <tr class="border-b border-surface-200 py-2 dark:border-surface-600">
          <td class="font-medium" width="40%">Номер листа :</td>
          <td>{{ record?.internet?.reqnum || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 py-2 dark:border-surface-600">
          <td class="font-medium" width="40%">Дата відкриття :</td>
          <td>{{ dateToStr(record?.internet?.dateOpen) || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 py-2 dark:border-surface-600">
          <td class="font-medium" width="40%">Дата закриття :</td>
          <td>{{ dateToStr(record?.internet?.dateClose) || '-' }}</td>
        </tr>
        <tr class="border-b border-surface-200 py-2 dark:border-surface-600">
          <td class="font-medium" width="40%">Коментар :</td>
          <td>{{ record?.internet?.comment }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
