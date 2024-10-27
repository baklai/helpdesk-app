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
    class="sticky h-full w-1/3 overflow-y-auto rounded-none border-l border-surface-200 px-2 shadow-none dark:border-surface-600 dark:!bg-surface-800"
  >
    <template #title>
      <div class="mb-6 flex justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="onmap-scanner" :size="40" class="my-auto mr-2" />
          <div>
            <p class="mb-0 text-lg">
              {{ record?.title || '-' }}
            </p>
            <p class="mb-0 text-base font-normal">
              Повідомити про ціль: {{ record?.target || '-' }}
            </p>
            <p class="text-base font-normal">
              Дата звіту: {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="h-12 w-12 text-2xl"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="'Меню'"
            @click="toggleMenu($event, record)"
          />
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="h-12 w-12 text-2xl"
            icon="pi pi-times"
            v-tooltip.bottom="'Закрити'"
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
