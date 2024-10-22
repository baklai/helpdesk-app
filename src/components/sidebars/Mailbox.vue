<script setup>
import { ref } from 'vue';

import { useMailbox } from '@/stores/api/mailboxes';
import { dateToStr } from '@/service/DataFilters';

const Mailbox = useMailbox();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await Mailbox.findOne({ id });

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
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="network-mailbox" :size="40" class="mr-4" />
          <div>
            <p class="mb-0 text-lg">Логін : {{ record?.login }}</p>
            <p class="text-base font-normal">
              Дата відкриття : {{ dateToStr(record?.dateOpen) || '-' }}
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
      <div class="overflow-y-auto pt-6" style="height: calc(100vh - 20rem)">
        <table>
          <tbody>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="40%">Логін :</td>
              <td>{{ record?.login }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="40%">Номер листа :</td>
              <td>{{ record?.reqnum }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="40%">Дата відкриття :</td>
              <td>{{ dateToStr(record?.dateOpen) || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="40%">Повне ім'я :</td>
              <td>{{ record?.fullname }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Телефон :</td>
              <td>{{ record?.phone || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Розташування :</td>
              <td>{{ record?.location?.name || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Організація :</td>
              <td>{{ record?.organization?.name || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Підрозділ :</td>
              <td>{{ record?.subdivision?.name || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Відділ :</td>
              <td>{{ record?.department?.name || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Посада :</td>
              <td>{{ record?.position?.name || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="40%">Дата закриття :</td>
              <td>{{ dateToStr(record?.dateClose) || '-' }}</td>
            </tr>

            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Коментар :</td>
              <td>{{ record?.comment }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Card>
</template>

<style scoped>
table {
  width: 100%;
  border: 15px solid transparent;
  border-top: 5px solid transparent;
  border-collapse: collapse;
}

td,
th {
  font-size: 14px;
}

th {
  font-weight: bold;
  text-align: left;
  background: transparent;
  text-transform: uppercase;
  padding: 5px;
}

td {
  padding: 3px;
}
</style>
