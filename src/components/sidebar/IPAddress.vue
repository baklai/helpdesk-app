<script setup>
import { ref } from 'vue';

import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import SysInspectorPartial from '@/components/partials/SysInspectorPartial.vue';

import { useIPAddress } from '@/stores/api/ipaddresses';
import { dateToStr } from '@/service/DataFilters';

const IPAddress = useIPAddress();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await IPAddress.findOne({ id, populate: true, aggregate: true });
      visible.value = true;
    } catch (err) {
      onCloseSidebar();
    }
  }
});

const visible = ref(false);
const record = ref(null);

const toggleMenu = (event, data) => {
  emits('toggleMenu', event, data);
};

const onCloseSidebar = () => {
  visible.value = false;
  record.value = null;
  emits('close', {});
};
</script>

<template>
  <Card
    v-if="visible"
    class="h-full surface-card sticky shadow-none w-full overflow-y-auto border-left-1 border-noround surface-border px-2 w-4"
  >
    <template #title>
      <div class="flex justify-content-between">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="network-ip-address" :size="40" class="mr-2" />
          <div>
            <p class="text-lg mb-0">IP {{ record?.ipaddress?.ipaddress }}</p>
            <p class="text-base font-normal">
              {{ $t('Date open') }} : {{ dateToStr(record?.ipaddress?.date) || '-' }}
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
            @click="toggleMenu($event, record.ipaddress)"
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
      <div class="overflow-y-auto pt-4" style="height: calc(100vh - 20rem)">
        <IPAddressPartial :record="record.ipaddress" v-if="record?.ipaddress" />
        <SysInspectorPartial :record="record.inspector" v-if="record?.inspector" />
      </div>
    </template>
  </Card>
</template>
