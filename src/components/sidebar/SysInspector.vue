<script setup>
import { ref } from 'vue';

import IPTable from '@/components/tables/IPTable.vue';

import { dateToStr, dateTimeToStr } from '@/service/DataFilters';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useInspector } from '@/stores/api/inspectors';

const Inspector = useInspector();
const IPAddress = useIPAddress();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await Inspector.findOne({ id });
      recordIP.value = await IPAddress.findOne({
        ipaddress: record.value?.host,
        populate: true
      });
      visible.value = true;
    } catch (err) {
      onCloseSidebar();
    }
  }
});

const visible = ref(false);

const record = ref({});
const recordIP = ref({});

const toggleMenu = (event, data) => {
  emits('toggleMenu', event, data);
};

const onCloseSidebar = () => {
  visible.value = false;
  record.value = null;
  recordIP.value = null;
  emits('close', {});
};

const memorySum = value => {
  const summa = value
    ? value?.reduce((accumulator, { Capacity }) => Number(accumulator) + Number(Capacity), 0)
    : 0;
  const index = Math.floor(Math.log(summa) / Math.log(1024));
  return (
    (summa / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
  );
};

const diskSum = value => {
  const summa = value
    ? value?.reduce((accumulator, { Size }) => Number(accumulator) + Number(Size), 0)
    : 0;
  const index = Math.floor(Math.log(summa) / Math.log(1024));
  return (
    (summa / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index]
  );
};
</script>

<template>
  <Card
    v-if="visible"
    class="h-full surface-overlay sticky shadow-none w-full overflow-y-auto border-left-1 border-noround surface-border px-2 w-4"
  >
    <template #title>
      <div class="flex justify-content-between mb-4">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="pc-sys-inspector" :size="40" class="my-auto mr-2" />
          <div>
            <p class="text-lg mb-0">
              {{ record?.os ? record?.os?.CSName : record?.host }}
            </p>
            <p class="text-base font-normal mb-0">
              {{ $t('Report host') }}: {{ record?.host || '-' }}
            </p>
            <p class="text-base font-normal">
              {{ $t('Report date') }}: {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
        <div class="flex align-items-center justify-content-center">
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="w-2rem h-2rem hover:text-color mx-2"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Menu')"
            @click="toggleMenu($event, record)"
          />
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="w-2rem h-2rem hover:text-color mx-2"
            icon="pi pi-times"
            v-tooltip.bottom="$t('Close')"
            @click="onCloseSidebar"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="overflow-y-auto" style="height: calc(100vh - 20rem)">
        <div class="flex align-items-center mb-4" v-if="recordIP?.ipaddress">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="40"
            height="40"
            class="text-color-secondary mr-2"
          >
            <path
              fill="currentColor"
              d="M19 5V19H5V5H19M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9 7H7V17H9V7M15 7H11V17H13V13H15C16.1 13 17 12.1 17 11V9C17 7.9 16.1 7 15 7M15 11H13V9H15V11Z"
            />
          </svg>
          <div>
            <p class="text-lg mb-0">IP {{ recordIP?.ipaddress || '-' }}</p>
            <p class="text-base font-normal">
              {{ $t('Date open') }} : {{ dateToStr(recordIP?.date) || '-' }}
            </p>
          </div>
        </div>
        <IPTable :record="recordIP" :internet="false" :email="false" v-if="recordIP?.ipaddress" />

        <div class="flex align-items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="40"
            height="40"
            class="text-color-secondary mr-2"
          >
            <path
              fill="currentColor"
              d="M3,12V6.75L9,5.43V11.91L3,12M20,3V11.75L10,11.9V5.21L20,3M3,13L9,13.09V19.9L3,18.75V13M20,13.25V22L10,20.09V13.1L20,13.25Z"
            />
          </svg>
          <div>
            <p class="text-base font-normal mb-0">
              {{ record?.os ? record?.os?.Caption : '-' }}
            </p>
            <p class="text-base font-normal mb-0">
              {{ record?.os ? record?.os?.OSArchitecture : '32-bit' }}
              {{ record?.os ? record?.os?.Version : '-' }}
            </p>
          </div>
        </div>

        <div class="flex justify-content-between mb-4">
          <div class="flex justify-content-cente w-4">
            <div class="flex flex-column card-container">
              <div class="flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  class="text-color-secondary"
                >
                  <path
                    fill="currentColor"
                    d="M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11M13,13H11V11H13M15,9H9V15H15V9Z"
                  />
                </svg>
              </div>
              <div class="flex align-items-center justify-content-center">
                <p>{{ $t('CPU') }}</p>
              </div>
              <div class="flex align-items-center justify-content-center text-center">
                <span>
                  {{ record?.cpu?.Name || '-' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-content-center w-4">
            <div class="flex flex-column">
              <div class="flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  class="text-color-secondary"
                >
                  <path
                    fill="currentColor"
                    d="M2 7H4.5V17H3V8.5H2M22 7V16H14V17H7V16H6V7M10 9H8V12H10M13 9H11V12H13M20 9H15V14H20V9Z"
                  />
                </svg>
              </div>
              <div class="flex align-items-center justify-content-center">
                <p>{{ $t('RAM') }}</p>
              </div>
              <div class="flex align-items-center justify-content-center text-center">
                <span>
                  {{ memorySum(record?.memorychip) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-content-center w-4">
            <div class="flex flex-column card-container">
              <div class="flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  class="text-color-secondary"
                >
                  <path
                    fill="currentColor"
                    d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M12,4A6,6 0 0,0 6,10C6,13.31 8.69,16 12.1,16L11.22,13.77C10.95,13.29 11.11,12.68 11.59,12.4L12.45,11.9C12.93,11.63 13.54,11.79 13.82,12.27L15.74,14.69C17.12,13.59 18,11.9 18,10A6,6 0 0,0 12,4M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M12.09,13.27L14.58,19.58L17.17,18.08L12.95,12.77L12.09,13.27Z"
                  />
                </svg>
              </div>
              <div class="flex align-items-center justify-content-center">
                <p>{{ $t('HDD') }}</p>
              </div>
              <div class="flex align-items-center justify-content-center text-center">
                <span>
                  {{ diskSum(record?.diskdrive) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <table class="mb-2">
          <tr>
            <td class="font-medium" width="40%">{{ $t('Baseboard serial number') }}</td>
            <td>{{ record?.baseboard?.SerialNumber || '-' }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('Bios serial number') }}</td>
            <td>{{ record?.bios?.SerialNumber || '-' }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('Bios version') }}</td>
            <td>{{ record?.bios?.Version || '-' }}</td>
          </tr>
        </table>

        <table class="mb-2">
          <tr>
            <td class="font-medium" width="40%">{{ $t('OS Type') }}</td>
            <td>{{ $t('Microsoft Windows') }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('OS Version') }}</td>
            <td>{{ record?.os?.Version || '-' }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('OS Name') }}</td>
            <td>{{ record?.os?.Caption || '-' }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('OS Platform') }}</td>
            <td>{{ record?.os?.OSArchitecture || '32-bit' }}</td>
          </tr>
        </table>

        <table>
          <tr>
            <td class="font-medium" width="40%">{{ $t('PC Name') }}</td>
            <td>{{ record?.os ? record?.os?.CSName : record?.host }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('IP Address') }}</td>
            <td>{{ record?.host || '-' }}</td>
          </tr>
          <tr>
            <td class="font-medium" width="40%">{{ $t('Report date') }}</td>
            <td>{{ dateTimeToStr(record?.updatedAt) || '-' }}</td>
          </tr>
        </table>
      </div>
    </template>
  </Card>
</template>

<style scoped>
table {
  width: 100%;
  border: 15px solid transparent;
  border-top: 5px solid transparent;
  border-collapse: collapse;
}

td,
th {
  font-size: 14px;
  border-bottom: 1px solid var(--surface-border);
}

th {
  font-weight: bold;
  text-align: left;
  background: transparent;
  text-transform: uppercase;
  padding: 5px;
}

td {
  padding: 3px;
}
</style>
