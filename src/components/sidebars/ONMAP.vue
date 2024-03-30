<script setup>
import { ref } from 'vue';

import { dateTimeToStr } from '@/service/DataFilters';
import { useOnmap } from '@/stores/api/onmaps';

const Onmap = useOnmap();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await Onmap.findOne({ id });
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
    class="h-full sticky shadow-none overflow-y-auto border-l rounded-none border-surface-200 dark:border-surface-600 px-2 w-1/3"
  >
    <template #title>
      <div class="flex justify-between mb-6">
        <div class="flex items-center justify-center">
          <AppIcons name="onmap-scanner" :size="40" class="my-auto mr-2" />
          <div>
            <p class="text-lg mb-0">
              {{ record?.title || '-' }}
            </p>
            <p class="text-base font-normal mb-0">
              {{ $t('Report target') }}: {{ record?.target || '-' }}
            </p>
            <p class="text-base font-normal">
              {{ $t('Report date') }}:
              {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="text-2xl w-12 h-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Menu')"
            @click="toggleMenu($event, record)"
          />
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="text-2xl w-12 h-12"
            icon="pi pi-times"
            v-tooltip.bottom="$t('Close')"
            @click="onCloseSidebar"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="overflow-y-auto" style="height: calc(100vh - 20rem)"></div>
    </template>
  </Card>
</template>
