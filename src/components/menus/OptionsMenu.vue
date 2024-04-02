<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { Clipboard } from 'v-clipboard';

import { useTool } from '@/stores/api/systools';
import { usePing } from '@/stores/api/pings';

const { t } = useI18n();
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
    label: t('View record'),
    icon: 'pi pi-eye',
    command: () => emits('view', record.value)
  },
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: () => emits('create', {})
  },
  {
    label: t('Update record'),
    icon: 'pi pi-file-edit',
    command: () => emits('update', record.value)
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: () => emits('delete', record.value)
  }
]);

const customOptions = computed(() => [...props.items]);

const hostOptions = computed(() => [
  {
    label: t('Options'),
    items: [
      {
        label: t('Copy to clipboard'),
        icon: 'pi pi-copy',
        command: () => copyIPtoClipboard(record.value[props.hostkey])
      }
    ]
  },
  {
    label: t('Commands'),
    items: [
      {
        label: t('ICMP Ping'),
        icon: 'pi pi-code',
        command: () => onPINGCommand(record.value[props.hostkey])
      }
    ]
  },
  {
    label: t('Option links'),
    items: [
      {
        label: t('CMD Ping'),
        icon: 'pi pi-desktop',
        command: () => getPINGLink(record.value[props.hostkey])
      },
      {
        label: t('RDP Connect'),
        icon: 'pi pi-desktop',
        command: () => getRDPLink(record.value[props.hostkey])
      },
      {
        label: t('VNC Connect'),
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
      summary: t('HD Information'),
      detail: t(`IP ${value} copied to clipboard`),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(`IP ${value} not copied to clipboard`),
      life: 3000
    });
  }
};

const onPINGCommand = async value => {
  try {
    toast.add({
      severity: 'info',
      summary: t('HD Information'),
      detail: t(`ICMP Ping running on ${value}`),
      life: 3000
    });
    const ping = await Ping.createOne({ host: value });
    if (ping.output) {
      toast.add({
        severity: 'success',
        summary: t('HD ICMP Ping'),
        detail: ping?.output,
        group: 'ping'
      });
    }
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(`ICMP Ping on ${value} does not answer`)
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
    summary: t('HD Information'),
    detail: t('PING File created'),
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
    summary: t('HD Information'),
    detail: t('RDP File created'),
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
    summary: t('HD Information'),
    detail: t('VNC File created'),
    life: 3000
  });
  link.click();
};
</script>

<template>
  <Toast position="bottom-right" group="ping" class="z-5 w-auto" v-if="hostkey">
    <template #message="{ message }">
      <div class="flex flex-col">
        <div class="flex content-center h-[2rem]">
          <div class="flex gap-2 items-center justify-center">
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

  <Menu ref="refMenu" popup :model="options" :class="[hostkey ? 'pt-2 pb-0' : 'py-2']">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
    <template #end v-if="hostkey && record[hostkey]">
      <div class="flex justify-center bg-surface-300 dark:bg-surface-900 rounded-b py-2">
        <span class="font-bold"> {{ record[hostkey] }} </span>
      </div>
    </template>
  </Menu>
</template>
