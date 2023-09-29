<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

// import ModalRecord from '@/components/modals/Notice.vue';

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

  <OverlayPanel ref="refMenu" appendTo="body" class="w-30rem">
    <div class="flex justify-content-between px-2 pt-2">
      <div class="flex align-items-center justify-content-center">
        <Avatar size="large" icon="pi pi-bell text-4xl" class="mr-2" />
        <div>
          <p class="text-lg font-bold line-height-2 mb-2">
            {{ $t('HD Notification') }}
          </p>
          <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
            {{ $t('Helpdesk notification system') }}
          </p>
        </div>
      </div>
      <div class="flex align-items-center justify-content-center">
        <Button
          text
          plain
          rounded
          icon="pi pi-plus-circle"
          iconClass="text-2xl"
          class="p-button-lg hover:text-color h-3rem w-3rem"
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

    <DataView v-if="records?.length" :value="records" class="overflow-auto max-h-30rem">
      <template #list="{ data }">
        <div class="col-12 border-none py-2">
          <div class="flex flex-row justify-content-start gap-3">
            <div class="flex flex-column align-items-start overflow-auto w-full">
              <div class="w-full flex align-items-center text-color">
                <Avatar icon="pi pi-bell text-xl" class="text-green-500 mr-2" />
                <div class="flex flex-column align my-2">
                  <span class="font-medium text-green-500 text-xl">{{ data?.name }}</span>
                  <span class="font-normal text-color-secondary">
                    {{ dateTimeToStr(data?.createdAt) || '-' }}
                  </span>
                </div>
              </div>
              <span class="text-xl">{{ data?.text }}</span>
            </div>
            <div class="flex flex-column align-items-center justify-content-center mr-2">
              <Button
                text
                plain
                rounded
                icon="pi pi-times text-orange-300"
                v-tooltip.bottom="$t('Close notice')"
                @click="onRemoveRecord(data.id)"
              />
            </div>
          </div>
          <Divider />
        </div>
      </template>
    </DataView>

    <div class="flex align-items-center justify-content-center p-2" v-else>
      <p class="font-medium text-lg text-color-secondary mb-0">
        {{ $t('Notifications not found') }}
      </p>
    </div>
  </OverlayPanel>

  <i v-badge.success="records?.length" class="p-overlay-badge mx-2" v-if="records?.length">
    <Button
      text
      plain
      rounded
      icon="pi pi-bell"
      iconClass="text-3xl"
      aria-haspopup="true"
      aria-controls="notifications-menu"
      class="w-3rem h-3rem hover:text-color"
      v-tooltip.bottom="$t('Notifications')"
      @click="event => refMenu.toggle(event)"
    />
  </i>

  <Button
    text
    plain
    rounded
    icon="pi pi-bell"
    iconClass="text-3xl"
    aria-haspopup="true"
    aria-controls="notifications-menu"
    class="w-3rem h-3rem hover:text-color mx-2"
    v-tooltip.bottom="$t('Notifications')"
    @click="event => refMenu.toggle(event)"
    v-else
  />
</template>

<style scoped>
::v-deep(.p-badge.p-component) {
  top: 6px;
  right: 6px;
}
</style>
