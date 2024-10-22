<script setup>
import { ref } from 'vue';

import { useChannel } from '@/stores/api/channels';

const Channel = useChannel();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await Channel.findOne({ id });
      visible.value = true;
    } catch (err) {
      onCloseSidebar();
    }
  }
});

const visible = ref(false);

const record = ref({});

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
          <AppIcons name="network-channels" :size="40" class="mr-4" />
          <div>
            <p class="mb-0 text-lg">Мережевий канал</p>
            <p class="text-base font-normal">
              {{ record?.locationFrom }} - {{ record?.locationTo }}
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
      <div class="overflow-y-auto" style="height: calc(100vh - 20rem)">
        <h5>Початкова точка</h5>
        <table>
          <tbody>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Початкове розташування :</td>
              <td>{{ record?.locationFrom || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Початковий пристрій :</td>
              <td>{{ record?.unitFrom || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <h5>Кінцева точка</h5>
        <table>
          <tbody>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Кінцеве розташування :</td>
              <td>{{ record?.locationTo || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Кінцевий пристрій :</td>
              <td>{{ record?.unitTo || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <h5>Інформація про канал</h5>
        <table>
          <tbody>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Рівень :</td>
              <td>{{ record?.level || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Тип :</td>
              <td>{{ record?.type || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Швидкість :</td>
              <td>{{ record?.speed || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Статус :</td>
              <td>{{ record?.status || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Оператор :</td>
              <td>{{ record?.operator || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Склад :</td>
              <td>{{ record?.composition || '-' }}</td>
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
