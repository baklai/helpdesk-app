<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useToast } from 'primevue/usetoast';

const DataView = defineAsyncComponent(() => import('primevue/dataview'));

const ModalRecord = defineAsyncComponent(() => import('@/components/modals/Notice.vue'));

import { dateTimeToStr } from '@/service/DataFilters';
import { useNotice } from '@/stores/api/notices';

 
const toast = useToast();

const { findAll, removeOne } = useNotice();

const records = ref([]);
const refMenu = ref();
const refModal = ref();

const onRecords = async () => {
  try {
    records.value = await findAll({});
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Записи не оновлено',
      life: 3000
    });
  }
};

const onRemoveRecord = async id => {
  try {
    await removeOne({ id });
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Запис видалено',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не видалено',
      life: 3000
    });
  } finally {
    await onRecords();
  }
};

onMounted(async () => {
  await onRecords();
});
</script>

<template>
  <div>
    <ModalRecord ref="refModal" @close="async () => await onRecords()" />

    <OverlayPanel ref="refMenu" appendTo="body" class="w-[35rem]">
      <div class="flex w-full flex-col">
        <div class="flex justify-between px-2 pt-2">
          <div class="flex items-center justify-center">
            <Avatar size="xlarge" icon="pi pi-bell text-4xl" class="mr-4" />
            <div>
              <p class="line-height-2 mb-2 text-lg font-bold">
                HD Сповіщення
              </p>
              <p class="line-height-2 mb-0 text-base font-normal text-surface-500">
                Система сповіщень служби технічної підтримки
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <Button
              text
              plain
              rounded
              icon="pi pi-plus-circle"
              class="h-12 w-12 text-2xl"
              v-tooltip.bottom="'Створити сповіщення'"
              @click="
                () => {
                  refMenu.hide();
                  refModal.toggle({});
                }
              "
            />
          </div>
        </div>

        <Divider />

        <DataView v-if="records?.length" :value="records" class="max-h-[30rem] overflow-auto">
          <template #list="{ items }">
            <div
              class="w-full flex-shrink-0 border-none p-4 py-2"
              v-for="(item, index) in items"
              :key="index"
            >
              <div class="flex flex-row justify-start gap-3">
                <div class="align-items-start flex w-full flex-col overflow-auto">
                  <div class="flex w-full items-center">
                    <Avatar icon="pi pi-bell text-xl" size="large" class="mr-2 text-green-500" />
                    <div class="align my-2 flex flex-col">
                      <span class="text-xl font-medium text-green-500">{{ item?.title }}</span>
                      <span class="font-normal text-surface-500">
                        {{ dateTimeToStr(item?.createdAt) || '-' }}
                      </span>
                    </div>
                  </div>
                  <span class="text-xl">{{ item?.text }}</span>
                </div>
                <div class="mr-2 flex flex-col items-center justify-center">
                  <Button
                    text
                    plain
                    rounded
                    icon="pi pi-times"
                    class="hover:!text-orange-300"
                    v-tooltip.bottom="'Закрити сповіщення'"
                    @click="onRemoveRecord(item.id)"
                  />
                </div>
              </div>
              <Divider />
            </div>
          </template>
        </DataView>

        <div class="flex flex-col items-center justify-center p-2" v-else>
          <p class="mb-0 text-lg font-medium text-surface-500">
            Сповіщення не знайдені
          </p>
        </div>
      </div>
    </OverlayPanel>

    <button
      type="button"
      @click="event => refMenu.toggle(event)"
      v-tooltip.bottom="'Сповіщення'"
      class="relative inline-flex select-none items-center rounded-full p-3 text-center text-sm font-medium text-surface-500 hover:bg-surface-300/20 hover:text-surface-600 focus:outline-none focus:ring-4 focus:ring-primary-400/50 dark:hover:text-surface-300 dark:focus:ring-primary-300/50"
    >
      <i class="pi pi-bell text-2xl"></i>
      <div
        v-if="records?.length"
        class="absolute -end-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white dark:text-surface-900"
      >
        {{ records?.length }}
      </div>
    </button>
  </div>
</template>
