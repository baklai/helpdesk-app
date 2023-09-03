<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { dateToStr } from '@/service/DataFilters';
import IPTable from '@/components/tables/IPTable.vue';

const { t } = useI18n();
const toast = useToast();
const IPAddress = useIPAddress();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await IPAddress.findOne({ id, populate: true });
      visible.value = true;
    } catch (err) {
      visible.value = false;
      record.value = IPAddress.$reset();
      toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
    }
  }
});

const visible = ref(false);

const record = ref({});

const toggleMenu = (event, data) => {
  emits('toggleMenu', event, data);
};

const onClose = () => {
  visible.value = false;
  record.value = IPAddress.$reset();
  emits('close', {});
};
</script>

<template>
  <Card
    v-if="visible"
    class="h-full surface-overlay sticky shadow-none w-full overflow-y-auto border-left-1 border-noround surface-border px-2 w-4"
  >
    <template #title>
      <div class="flex justify-content-between">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="network-ip-address" :size="40" class="mr-2" />
          <div>
            <p class="text-lg mb-0">IP {{ record?.ipaddress }}</p>
            <p class="text-base font-normal">{{ $t('Date open') }} : {{ dateToStr(record?.date) || '-' }}</p>
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
            @click="onClose"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="overflow-y-auto pt-4" style="height: calc(100vh - 20rem)">
        <h5>{{ $t('IP Address') }}</h5>
        <IPTable :record="record" :internet="true" :email="true" />
      </div>
    </template>
  </Card>
</template>
