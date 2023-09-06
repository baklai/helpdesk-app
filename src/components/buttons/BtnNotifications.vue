<script setup>
import { ref, inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useNotice } from '@/stores/api/notices';
import { dateTimeToStr } from '@/service/DataFilters';

const { t } = useI18n();
const toast = useToast();

// const $helpdesk = inject('helpdesk');

const Notice = useNotice();

const records = ref([]);

const refMenu = ref();

const onRecords = async () => {
  try {
    // records.value = await Notice.findAll({
    //   offset: 0,
    //   limit: -1,
    //   sort: { createdAt: -1 },
    //   filters: { userId: { $in: $helpdesk.user?.id ? [$helpdesk.user?.id] : [] } }
    // });

    records.value = [];
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
    await Notice.removeOne({ id });
    await onRecords();
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
  }
};

onMounted(async () => {
  await onRecords();
});
</script>

<template>
  <OverlayPanel ref="refMenu" appendTo="body" class="w-30rem" v-if="records?.docs?.length">
    <DataView :value="records.docs" class="overflow-auto max-h-30rem">
      <template #list="{ data }">
        <div class="col-12 border-none py-2">
          <div class="flex flex-row justify-content-start gap-3">
            <div class="flex flex-column align-items-start overflow-auto w-full">
              <div class="w-full flex align-items-center text-color">
                <Avatar icon="pi pi-bell text-2xl" class="bg-green-500 text-white mr-2" />
                <div class="flex flex-column align my-2">
                  <span class="font-medium text-primary text-xl">{{ data?.title }}</span>
                  <span class="font-normal text-color-secondary">
                    {{ dateTimeToStr(data?.createdAt) || '-' }}
                  </span>
                </div>
              </div>
              <span class="text-xl">{{ data?.text }}</span>
            </div>
            <div class="flex flex-column align-items-end">
              <Button
                text
                plain
                rounded
                icon="pi pi-trash"
                v-tooltip.bottom="$t('Remove record')"
                @click="onRemoveRecord(data.id)"
              />
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </OverlayPanel>

  <i
    v-if="records?.docs?.length"
    v-badge.success="records?.docs?.length"
    class="p-overlay-badge mx-2"
  >
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
</template>

<style scoped>
::v-deep(.p-badge.p-component) {
  top: 6px;
  right: 6px;
}
</style>
