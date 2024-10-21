<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';

import { Clipboard } from 'v-clipboard';

import { useTool } from '@/stores/api/systools';
import { usePing } from '@/stores/api/pings';

const toast = useToast();
const Tool = useTool();
const Ping = usePing();

const props = defineProps({
  crud: {
    type: Boolean,
    default: true
  },
  items: {
    type: Array,
    default: () => []
  },
  hostkey: { type: [String, Boolean], default: false }
});

const emits = defineEmits({
  view: ({ id }) => {
    if (id) return true;
    return false;
  },
  create: null,
  update: ({ id }) => {
    if (id) return true;
    return false;
  },
  delete: ({ id }) => {
    if (id) return true;
    return false;
  }
});

defineExpose({
  toggle: (event, data) => {
    record.value = data;
    refMenu.value.toggle(event);
  }
});

const record = ref({});

const refMenu = ref();

const crudOptions = computed(() => [
  {
    label: 'Переглянути запис',
    icon: 'pi pi-eye',
    command: () => emits('view', record.value)
  },
  {
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: () => emits('create', {})
  },
  {
    label: 'Оновити запис',
    icon: 'pi pi-file-edit',
    command: () => emits('update', record.value)
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: () => emits('delete', record.value)
  }
]);

const customOptions = computed(() => [...props.items]);

const hostOptions = computed(() => [
  {
    label: 'Опції',
    items: [
      {
        label: 'Копіювати в буфер обміну',
        icon: 'pi pi-copy',
        command: () => copyIPtoClipboard(record.value[props.hostkey])
      }
    ]
  },
  {
    label: 'Команди',
    items: [
      {
        label: 'ICMP Пінг',
        icon: 'pi pi-code',
        command: () => onPINGCommand(record.value[props.hostkey])
      }
    ]
  },
  {
    label: 'Посилання на опції',
    items: [
      {
        label: 'CMD Ping',
        icon: 'pi pi-desktop',
        command: () => getPINGLink(record.value[props.hostkey])
      },
      {
        label: 'RDP Підключення',
        icon: 'pi pi-desktop',
        command: () => getRDPLink(record.value[props.hostkey])
      },
      {
        label: 'VNC Підключення',
        icon: 'pi pi-desktop',
        command: () => getVNClink(record.value[props.hostkey])
      }
    ]
  }
]);

const options = computed(() => [
  ...(props.crud ? crudOptions.value : []),
  ...customOptions.value,
  ...(props.hostkey && record.value[props?.hostkey] ? hostOptions.value : [])
]);

const copyIPtoClipboard = async value => {
  try {
    await Clipboard.copy(value);
    toast.add({
      severity: 'info',
      summary: 'Інформація',
      detail: `IP ${value} copied to clipboard`,
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: `IP ${value} not copied to clipboard`,
      life: 3000
    });
  }
};

const onPINGCommand = async value => {
  try {
    toast.add({
      severity: 'info',
      summary: 'Інформація',
      detail: `ICMP Ping running on ${value}`,
      life: 3000
    });
    const ping = await Ping.createOne({ host: value });
    if (ping.output) {
      toast.add({
        severity: 'success',
        summary: 'HD ICMP Пінг',
        detail: ping?.output,
        group: 'ping'
      });
    }
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: `ICMP Ping on ${value} does not answer`
    });
  }
};

const getPINGLink = async value => {
  const file = await Tool.getLinkPING({ host: value });
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `PING_${value}.cmd`);
  toast.add({
    severity: 'info',
    summary: 'Інформація',
    detail: 'PING Файл створено',
    life: 3000
  });
  link.click();
};

const getRDPLink = async value => {
  const file = await Tool.getLinkRDP({ host: value });
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RDP_${value}.rdp`);
  toast.add({
    severity: 'info',
    summary: 'Інформація',
    detail: 'RDP Файл створено',
    life: 3000
  });
  link.click();
};

const getVNClink = async value => {
  const file = await Tool.getLinkVNC({ host: value });
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `VNC_${value}.vnc`);
  toast.add({
    severity: 'info',
    summary: 'Інформація',
    detail: 'VNC Файл створено',
    life: 3000
  });
  link.click();
};
</script>

<template>
  <Toast position="bottom-right" group="ping" class="z-10 w-auto" v-if="hostkey">
    <template #message="{ message }">
      <div class="flex flex-col">
        <div class="flex h-[2rem] content-center">
          <div class="flex items-center justify-center gap-2">
            <i class="pi pi-info-circle text-2xl"></i>
            <span class="text-base font-semibold">{{ message.summary }}</span>
          </div>
        </div>
        <pre>
          {{ message.detail }}
        </pre>
      </div>
    </template>
  </Toast>

  <Menu
    ref="refMenu"
    popup
    :model="options"
    :class="[hostkey && record[hostkey] && hostkey !== '-' ? 'pb-0 pt-2' : 'py-2']"
  >
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
    <template #end v-if="hostkey && record[hostkey] && hostkey !== '-'">
      <div class="flex justify-center rounded-b bg-surface-300 py-2 dark:bg-surface-900">
        <span class="font-bold"> {{ record[hostkey] }} </span>
      </div>
    </template>
  </Menu>
</template>
