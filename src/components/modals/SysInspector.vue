<script setup>
import html2pdf from 'html2pdf.js';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import SysInspectorPartial from '@/components/partials/SysInspectorPartial.vue';

import { byteToStr, strToDate, dateTimeToStr } from '@/service/DataFilters';

import { useInspector } from '@/stores/api/inspectors';
import { useFilter } from '@/stores/api/filters';

const toast = useToast();
const confirm = useConfirm();

const Inspector = useInspector();
const Filter = useFilter();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    if (id) {
      try {
        const { inspector, ipaddress } = await Inspector.findOne({
          id,
          populate: true,
          aggregate: true
        });

        record.value = inspector;
        recordip.value = ipaddress;

        filters.value = await Filter.findAll({});
        visible.value = true;
      } catch (err) {
        visible.value = false;
      }
    }
  }
});

const visible = ref(false);

const refMenu = ref();
const options = ref([
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: async () => onSaveReport()
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const record = ref(null);
const recordip = ref(null);
const filters = ref([]);

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

const validSoftware = value => {
  if (typeof value !== 'string') return true;
  let result = true;
  filters.value.forEach(item => {
    if (value.toLowerCase().includes(item?.regex.toLowerCase())) {
      result = false;
    }
  });
  return result;
};

const onRemoveRecord = async () => {
  if (!record.value?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await Inspector.removeOne(record.value);
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 5000
      });
    }
  });
};

const onSaveReport = () => {
  try {
    const element = document.querySelector('#report');
    const options = {
      margin: 1,
      filename: `SYSINSPECTOR_${record.value.host} (${new Date(
        record.value.updatedAt
      ).toLocaleDateString()}).pdf`,
      jsPDF: {
        format: 'a4',
        compress: true,
        floatPrecision: 16,
        orientation: 'portrait'
      }
    };
    html2pdf().set(options).from(element).save();

    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Звіт успішно створено',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Виникла непередбачувана помилка',
      life: 3000
    });
  }
};

const onCloseModal = () => {
  record.value = null;
  recordip.value = null;
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Dialog
    modal
    closable
    dismissableMask
    :draggable="false"
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[80vw] xl:w-[60vw] 2xl:w-[45vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="pc-sys-inspector" :size="40" class="mr-4" />
          <div>
            <p class="line-height-2 mb-0 text-lg font-bold">
              {{ record?.os ? record?.os?.CSName : record?.host }}
            </p>
            <p class="line-height-2 mb-0 text-base font-normal text-surface-500">
              Хост звіту: {{ record?.host || '-' }}
            </p>
            <p class="line-height-2 mb-0 text-base font-normal text-surface-500">
              Дата звіту:
              {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="'Меню опцій'"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div id="report" class="flex flex-col gap-y-4 lg:flex-row lg:flex-wrap">
        <div class="flex w-full flex-wrap lg:flex-row lg:flex-nowrap">
          <div :class="['flex w-full flex-col', record && 'p-4 lg:w-1/2']" v-if="recordip">
            <IPAddressPartial :record="recordip" :internet="false" v-if="recordip" />
          </div>

          <Divider layout="vertical" class="hidden lg:flex" v-if="recordip && record" />

          <div :class="['flex w-full flex-col', recordip && 'p-4 lg:w-1/2']" v-if="record">
            <SysInspectorPartial :record="record" v-if="record" />
          </div>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.cpu">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11M13,13H11V11H13M15,9H9V15H15V9Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">CPU</p>
              <p class="mb-0 text-base font-normal">Центральний процесор</p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ record?.cpu?.Name || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Частота процесора</td>
                <td>{{ record?.cpu?.CurrentClockSpeed || '-' }} MHz</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Кількість ядер</td>
                <td>{{ record?.cpu?.NumberOfCores || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Кількість логічних ядер</td>
                <td>{{ record?.cpu?.NumberOfLogicalProcessors || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Тип архітектури</td>
                <td>{{ record?.cpu?.Architecture || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ record?.cpu?.Manufacturer || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.memorychip?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M2 7H4.5V17H3V8.5H2M22 7V16H14V17H7V16H6V7M10 9H8V12H10M13 9H11V12H13M20 9H15V14H20V9Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">RAM</p>
              <p class="mb-0 text-base font-normal">Оперативна пам'ять</p>
            </div>
          </div>
          <table
            v-for="(memorychip, index) in record?.memorychip || []"
            :key="`memorychip_${index}`"
          >
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Ємність</td>
                <td>{{ byteToStr(memorychip?.Capacity) }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Частота процесора</td>
                <td>{{ memorychip?.Speed || '-' }} MHz</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ memorychip?.Manufacturer || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ memorychip?.Description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.diskdrive?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M12,4A6,6 0 0,0 6,10C6,13.31 8.69,16 12.1,16L11.22,13.77C10.95,13.29 11.11,12.68 11.59,12.4L12.45,11.9C12.93,11.63 13.54,11.79 13.82,12.27L15.74,14.69C17.12,13.59 18,11.9 18,10A6,6 0 0,0 12,4M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M12.09,13.27L14.58,19.58L17.17,18.08L12.95,12.77L12.09,13.27Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">HDD</p>
              <p class="mb-0 text-base font-normal">
                Кількість жорстких дисків :
                {{ record?.diskdrive?.length || '-' }}
              </p>
            </div>
          </div>
          <table v-for="(diskdrive, index) in record?.diskdrive || []" :key="`diskdrive_${index}`">
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Тип</td>
                <td>{{ diskdrive?.Description || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ diskdrive?.Caption || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Ємність</td>
                <td>{{ byteToStr(diskdrive?.Size) }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Серійний номер</td>
                <td>{{ diskdrive?.SerialNumber || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ diskdrive?.Manufacturer || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.netadapter?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <title>expansion-card-variant</title>
              <path
                fill="currentColor"
                d="M2 7H4.5V17H3V8.5H2M22 7V16H14V17H7V16H6V7M10 9H8V12H10M13 9H11V12H13M20 9H15V14H20V9Z"
              />
            </svg>

            <div>
              <p class="mb-0 text-base font-bold">Мережеві адаптери</p>
              <p class="mb-0 text-base font-normal">
                Кількість мережевих адаптерів :
                {{ record?.netadapter?.filter(item => item?.NetConnectionID)?.length || '-' }}
              </p>
            </div>
          </div>
          <table
            v-for="(netadapter, index) in record?.netadapter?.filter(
              item => item?.NetConnectionID
            ) || []"
            :key="`netadapter_${index}`"
          >
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Назва підключення</td>
                <td>{{ netadapter?.NetConnectionID || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Тип адаптера</td>
                <td>{{ netadapter?.AdapterType || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Назва</td>
                <td>{{ netadapter?.Name || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ netadapter?.Description || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ netadapter?.Manufacturer || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">MAC</td>
                <td>{{ netadapter?.MACAddress || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.display?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <title>monitor</title>
              <path
                fill="currentColor"
                d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Дисплей</p>
              <p class="mb-0 text-base font-normal">
                Кількість дисплеїв :
                {{ record?.display?.length || '-' }}
              </p>
            </div>
          </div>

          <table v-for="(display, index) in record?.display || []" :key="`display_${index}`">
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ display?.Description || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ display?.MonitorManufacturer || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Тип</td>
                <td>{{ display?.MonitorType || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.videoadapter?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <title>video-outline</title>
              <path
                fill="currentColor"
                d="M15,8V16H5V8H15M16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5V7A1,1 0 0,0 16,6Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Відеоадаптер</p>
              <p class="mb-0 text-base font-normal">
                Кількість відеоадаптерів :
                {{ record?.videoadapter?.length || '-' }}
              </p>
            </div>
          </div>

          <table
            v-for="(videoadapter, index) in record?.videoadapter || []"
            :key="`videoadapter_${index}`"
          >
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ videoadapter?.Description || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Пам'ять</td>
                <td>{{ byteToStr(videoadapter?.AdapterRAM) || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Частота оновлення</td>
                <td>{{ videoadapter?.CurrentRefreshRate || '-' }} Hz</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Відеопроцесор</td>
                <td>{{ videoadapter?.VideoProcessor || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.sound?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <title>volume-high</title>
              <path
                fill="currentColor"
                d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Аудіопристрій</p>
              <p class="mb-0 text-base font-normal">
                Кількість аудіопристроїв :
                {{ record?.sound?.length || '-' }}
              </p>
            </div>
          </div>

          <table v-for="(sound, index) in record?.sound || []" :key="`sound_${index}`">
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Опис</td>
                <td>{{ sound?.Description || '-' }}</td>
              </tr>
              <tr class="border border-surface-200 dark:border-surface-600">
                <td class="font-bold" width="30%">Виробник</td>
                <td>{{ sound?.Manufacturer || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.printer?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Принтери</p>
              <p class="mb-0 text-base font-normal">
                Кількість принтерів :
                {{ record?.printer?.length || '-' }}
              </p>
            </div>
          </div>

          <table>
            <tbody>
              <tr
                v-for="(printer, index) in record?.printer || []"
                :key="`printer_${index}`"
                class="border border-surface-200 dark:border-surface-600"
              >
                <td class="font-bold" width="30%">Назва</td>
                <td>{{ printer?.Name || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.useraccount?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M13.07 10.41A5 5 0 0 0 13.07 4.59A3.39 3.39 0 0 1 15 4A3.5 3.5 0 0 1 15 11A3.39 3.39 0 0 1 13.07 10.41M5.5 7.5A3.5 3.5 0 1 1 9 11A3.5 3.5 0 0 1 5.5 7.5M7.5 7.5A1.5 1.5 0 1 0 9 6A1.5 1.5 0 0 0 7.5 7.5M16 17V19H2V17S2 13 9 13 16 17 16 17M14 17C13.86 16.22 12.67 15 9 15S4.07 16.31 4 17M15.95 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Локальні користувачі</p>
              <p class="mb-0 text-base font-normal">
                Кількість користувачів :
                {{ record?.useraccount?.length || '-' }}
              </p>
              <p class="mb-0 text-base font-normal">
                <i class="pi pi-bookmark-fill text-orange-500" />
                Обліковий запис має права адміністратора
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <th></th>
                <th>Назва</th>
                <th>Опис</th>
                <th>Статус</th>
              </tr>
              <tr
                v-for="(user, index) in record?.useraccount || []"
                :key="`user_${index}`"
                class="border border-surface-200 dark:border-surface-600"
              >
                <td class="text-center">
                  <i
                    class="pi pi-bookmark-fill text-orange-500"
                    v-if="record?.useradmin?.includes(user.Name)"
                  />
                </td>
                <td>{{ user?.Name || '-' }}</td>
                <td width="50%">{{ user?.Description || '-' }}</td>
                <td>
                  <Tag
                    :value="user?.Disabled ? 'Вимк.' : 'Увімк.'"
                    :class="[
                      '!bg-transparent',
                      '!border',
                      '!text-sm',
                      '!w-20',
                      user?.Disabled
                        ? '!border-surface-600/80 !text-surface-600/80'
                        : '!border-green-500 !text-green-500'
                    ]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.product?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Встановлені програми</p>
              <p class="mb-0 text-base font-normal">
                Кількість програм :
                {{ record?.product?.length || '-' }}
              </p>
              <p class="mb-0 text-base font-normal">
                <i class="pi pi-bookmark-fill text-orange-500" />
                Небажане програмне забезпечення
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <th></th>
                <th class="uppercase">Назва</th>
                <th class="uppercase">Видавець</th>
                <th class="uppercase">Версія</th>
                <th class="uppercase">Дата встановлення</th>
              </tr>
              <tr
                v-for="(product, index) in record?.product || []"
                :key="`product_${index}`"
                class="border border-surface-200 dark:border-surface-600"
              >
                <td class="text-center">
                  <i
                    class="pi pi-bookmark-fill text-orange-500"
                    v-if="!validSoftware(product?.Name)"
                  />
                </td>
                <td width="45%">{{ product?.Name || '-' }}</td>
                <td>{{ product?.Vendor || '-' }}</td>
                <td>{{ product?.Version || '-' }}</td>
                <td>{{ strToDate(product?.InstallDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.share?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M19,17H11V16C11,14.67 13.67,14 15,14C16.33,14 19,14.67 19,16M15,9A2,2 0 0,1 17,11A2,2 0 0,1 15,13A2,2 0 0,1 13,11C13,9.89 13.9,9 15,9M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Спільні ресурси</p>
              <p class="mb-0 text-base font-normal">
                Кількість ресурсів :
                {{ record?.share?.length || '-' }}
              </p>
              <p class="mb-0 text-base font-normal">
                <i class="pi pi-bookmark-fill text-orange-500" />
                Спільні ресурси
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <th></th>
                <th>Назва</th>
                <th>Шлях</th>
                <th>Опис</th>
              </tr>
              <tr
                v-for="(share, index) in record?.share || []"
                :key="`share_${index}`"
                class="border border-surface-200 dark:border-surface-600"
              >
                <td class="text-center">
                  <i class="pi pi-bookmark-fill text-orange-500" v-if="share?.Type === 0" />
                </td>
                <td>{{ share?.Name || '-' }}</td>
                <td width="50%">{{ share?.Path || '-' }}</td>
                <td>{{ share?.Description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mx-2 my-2 w-full" v-if="record?.fixupdate?.length">
          <div class="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              class="mr-2"
            >
              <title>bug-outline</title>
              <path
                fill="currentColor"
                d="M20,8H17.19C16.74,7.2 16.12,6.5 15.37,6L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.5,5 12,5C11.5,5 11.05,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6C7.87,6.5 7.26,7.21 6.81,8H4V10H6.09C6.03,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.03,15.67 6.09,16H4V18H6.81C8.47,20.87 12.14,21.84 15,20.18C15.91,19.66 16.67,18.9 17.19,18H20V16H17.91C17.97,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.97,10.33 17.91,10H20V8M16,15A4,4 0 0,1 12,19A4,4 0 0,1 8,15V11A4,4 0 0,1 12,7A4,4 0 0,1 16,11V15M14,10V12H10V10H14M10,14H14V16H10V14Z"
              />
            </svg>
            <div>
              <p class="mb-0 text-base font-bold">Виправлення та оновлення</p>
              <p class="mb-0 text-base font-normal">
                Кількість оновлень :
                {{ record?.fixupdate?.length || '-' }}
              </p>
            </div>
          </div>
          <table>
            <tbody>
              <tr class="border border-surface-200 dark:border-surface-600">
                <th></th>
                <th class="uppercase">Виправлення</th>
                <th class="uppercase">Опис</th>
                <th class="uppercase">Дата встановлення</th>
              </tr>
              <tr
                v-for="(fixupdate, index) in record?.fixupdate || []"
                :key="`fixupdate_${index}`"
                class="border border-surface-200 dark:border-surface-600"
              >
                <td width="3%"></td>
                <td width="35%">{{ fixupdate?.HotFixID }} {{ fixupdate?.ServicePackInEffect }}</td>
                <td>{{ fixupdate?.Description || '-' }}</td>
                <td>{{ fixupdate?.InstalledOn || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ScrollTop target="parent" :threshold="400" behavior="smooth" />
    </template>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Закрити" @click="visible = false" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveReport" />
    </template>
  </Dialog>
</template>

<style scoped>
table {
  width: 100%;
  border: 15px solid transparent;
  border-top: 5px solid transparent;
  border-collapse: collapse;
}

th {
  font-size: 14px;
  font-weight: bold;
  padding: 5px;
  border: none;
  text-align: left;
  background: transparent;
  text-transform: uppercase;
}

td {
  font-size: 12px;
  padding: 3px;
  border: none;
}

td,
th {
  border-bottom: 1px solid var(--surface-200);
}
</style>
