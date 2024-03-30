<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const ModalRecord = defineAsyncComponent(() => import('@/components/modals/Notice.vue'));

import { dateTimeToStr } from '@/service/DataFilters';
import { useNotice } from '@/stores/api/notices';

const { t } = useI18n();
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
      summary: t('HD Warning'),
      detail: t('Records not updated'),
      life: 3000
    });
  }
};

const onRemoveRecord = async id => {
  try {
    await removeOne({ id });
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Record is removed'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Record not removed'),
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
  <ModalRecord ref="refModal" @close="async () => await onRecords()" />

  <OverlayPanel ref="refMenu" appendTo="body" class="w-[30rem]">
    <div class="flex justify-between px-2 pt-2">
      <div class="flex items-center justify-center">
        <Avatar size="large" icon="pi pi-bell text-4xl" class="mr-2" />
        <div>
          <p class="text-lg font-bold line-height-2 mb-2">
            {{ $t('HD Notification') }}
          </p>
          <p class="text-base font-normal line-height-2 text-surface-500 mb-0">
            {{ $t('Helpdesk notification system') }}
          </p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <Button
          text
          plain
          rounded
          icon="pi pi-plus-circle"
          class="text-2xl w-12 h-12"
          v-tooltip.bottom="$t('Create notice')"
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

    <DataView v-if="records?.length" :value="records" class="overflow-auto max-h-[30rem]">
      <template #list="{ items }">
        <div
          class="flex-shrink-0 p-4 w-full border-none py-2"
          v-for="(item, index) in items"
          :key="index"
        >
          <div class="flex flex-row justify-start gap-3">
            <div class="flex flex-col align-items-start overflow-auto w-full">
              <div class="w-full flex items-center">
                <Avatar icon="pi pi-bell text-xl" class="text-green-500 mr-2" />
                <div class="flex flex-col align my-2">
                  <span class="font-medium text-green-500 text-xl">{{ item?.name }}</span>
                  <span class="font-normal text-surface-500">
                    {{ dateTimeToStr(item?.createdAt) || '-' }}
                  </span>
                </div>
              </div>
              <span class="text-xl">{{ item?.text }}</span>
            </div>
            <div class="flex flex-col items-center justify-center mr-2">
              <Button
                text
                plain
                rounded
                icon="pi pi-times"
                class="text-orange-300"
                v-tooltip.bottom="$t('Close notice')"
                @click="onRemoveRecord(item.id)"
              />
            </div>
          </div>
          <Divider />
        </div>
      </template>
    </DataView>

    <div class="flex items-center justify-center p-2" v-else>
      <p class="font-medium text-lg text-surface-500 mb-0">
        {{ $t('Notifications not found') }}
      </p>
    </div>
  </OverlayPanel>

  <i v-badge.success="records?.length" class="mx-2" v-if="records?.length">
    <Button
      text
      plain
      rounded
      icon="pi pi-bell"
      class="text-2xl w-12 h-12"
      v-tooltip.bottom="$t('Notifications')"
      @click="event => refMenu.toggle(event)"
    />
  </i>

  <Button
    text
    plain
    rounded
    icon="pi pi-bell"
    class="text-2xl w-12 h-12"
    v-tooltip.bottom="$t('Notifications')"
    @click="event => refMenu.toggle(event)"
    v-else
  />
</template>
