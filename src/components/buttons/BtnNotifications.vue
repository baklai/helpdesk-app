<script setup>
import { mdiBellOutline } from '@mdi/js';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { useToast } from 'primevue/usetoast';
import { computed, defineAsyncComponent, ref } from 'vue';

import { NOTICE_STATUS_SEVERITY } from '@/constants/ui.const';
import { FIND_ALL_NOTICES, REMOVE_ONE_NOTICE } from '@/graphql/apollo.gql';
import { dateTimeToStr } from '@/utils/DateMethods';

const Modal = defineAsyncComponent(() => import('@/components/modals/NoticeModal.vue'));

const toast = useToast();

const { result, refetch } = useQuery(FIND_ALL_NOTICES);
const { mutate: deleteNotice } = useMutation(REMOVE_ONE_NOTICE);

const notices = computed(() => result.value?.notices || []);

const refMenu = ref();
const refModal = ref();

const onRemoveRecord = async id => {
  try {
    await deleteNotice({ id });
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
      detail: err.message,
      life: 3000
    });
  } finally {
    await refetch();
  }
};
</script>

<template>
  <div>
    <Modal ref="refModal" @close="refetch" />

    <Popover ref="refMenu" appendTo="body" class="w-140">
      <div class="flex justify-between px-2 pt-2">
        <div class="flex items-center justify-center">
          <Avatar class="mr-4" icon="pi pi-bell text-xl" size="large" />
          <div>
            <p class="line-height-2 text-lg font-bold">Сповіщення</p>
            <p class="line-height-2 text-surface-500 text-base font-normal">Системні сповіщення</p>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <Button
            v-tooltip.bottom="'Створити сповіщення'"
            icon="pi pi-plus-circle text-xl!"
            rounded
            severity="secondary"
            variant="text"
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

      <DataView class="max-h-120 overflow-auto" :value="notices" pt:content="flex flex-col gap-y-2">
        <template #list="{ items }">
          <Message
            :severity="NOTICE_STATUS_SEVERITY[item.status] || 'secondary'"
            v-for="(item, index) in items"
            :key="`msg-${index}`"
            pt:text="w-full!"
          >
            <div class="flex w-full flex-row justify-between gap-x-4">
              <i class="pi pi-info-circle text-xl!"></i>

              <div class="flex w-full flex-col gap-y-1">
                <p v-if="item.title" class="text-base font-medium uppercase">{{ item.title }}</p>
                <p
                  v-if="item.message"
                  class="text-surface-600 dark:text-surface-200 text-sm font-normal whitespace-pre-wrap"
                >
                  {{ item.message }}
                </p>
                <p v-if="item.createdAt" class="text-muted-color text-xs font-normal">
                  {{ dateTimeToStr(item.createdAt) }}
                </p>
              </div>

              <Button
                v-tooltip.bottom="'Закрити'"
                icon="pi pi-times"
                rounded
                size="small"
                :severity="NOTICE_STATUS_SEVERITY[item.status] || 'secondary'"
                variant="text"
                @click="onRemoveRecord(item.id)"
              />
            </div>
          </Message>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center p-2">
            <p class="text-muted-color text-sm font-medium">Сповіщення не знайдені</p>
          </div>
        </template>
      </DataView>
    </Popover>

    <OverlayBadge
      :pt="{ pcBadge: { root: ['text-sm!', { 'hidden!': !notices?.length }] } }"
      severity="success"
      :value="notices.length"
    >
      <Button
        v-tooltip.bottom="'Сповіщення'"
        rounded
        severity="secondary"
        variant="text"
        @click="event => refMenu.toggle(event)"
      >
        <template #icon>
          <AppIcon :path="mdiBellOutline" :size="20" />
        </template>
      </Button>
    </OverlayBadge>
  </div>
</template>
