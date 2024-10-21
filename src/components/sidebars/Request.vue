<script setup>
import { ref } from 'vue';

import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import SysInspectorPartial from '@/components/partials/SysInspectorPartial.vue';

import { useRequest } from '@/stores/api/requests';
import { dateTimeToStr } from '@/service/DataFilters';

const Request = useRequest();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      const { request, ipaddress, inspector } = await Request.findOne({
        id,
        populate: true,
        aggregate: true
      });

      record.value = request;
      recordip.value = ipaddress;
      recordsysi.value = inspector;

      visible.value = true;
    } catch (err) {
      onCloseSidebar();
    }
  }
});

const visible = ref(false);

const record = ref(null);
const recordip = ref(null);
const recordsysi = ref(null);

const toggleMenu = (event, data) => {
  emits('toggleMenu', event, data);
};

const onCloseSidebar = () => {
  visible.value = false;
  record.value = null;
  recordip.value = null;
  recordsysi.value = null;
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
          <AppIcons name="technical-support" :size="40" class="mr-4" />
          <div>
            <p class="mb-0 text-lg">Поточний запит</p>
            <p class="text-base font-normal">
              Статус :
              {{ record?.closed ? 'Запит закрито' : 'Запит відкрито' }}
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
      <div class="overflow-y-auto py-6" style="height: calc(100vh - 20rem)">
        <table class="w-full">
          <tbody>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Відкрив запит :</td>
              <td>
                {{ record?.workerOpen ? record?.workerOpen?.fullname : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Дата відкриття :</td>
              <td>
                {{ record?.createdAt ? dateTimeToStr(record?.createdAt) : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Статус :</td>
              <td>
                <i
                  :class="
                    record?.closed
                      ? 'pi pi-check-circle text-green-500'
                      : 'pi pi-info-circle text-orange-500'
                  "
                />
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td colspan="2">
                <p class="w-full font-bold">Запит :</p>
                <p class="text-primary font-medium">
                  {{ record?.request ? record?.request : '-' }}
                </p>
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Розташування :</td>
              <td>
                {{ record?.location ? record?.location?.title : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Повне ім'я :</td>
              <td>{{ record?.fullname || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Телефон :</td>
              <td>{{ record?.phone || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Посада :</td>
              <td>
                {{ record?.position ? record?.position?.title : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">IP-адресa :</td>
              <td>
                {{ record?.ipaddress ? record?.ipaddress : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Номер листа :</td>
              <td>{{ record?.reqnum || '-' }}</td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Організація :</td>
              <td>
                {{ record?.organization ? record?.organization?.title : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Підрозділ :</td>
              <td>
                {{ record?.subdivision ? record?.subdivision?.title : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Відділ :</td>
              <td>
                {{ record?.department ? record?.department?.title : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Дата закриття :</td>
              <td>
                {{ record?.closed ? dateTimeToStr(record?.updatedAt) : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Закрив запит :</td>
              <td>
                {{ record?.workerClose ? record?.workerClose?.fullname : '-' }}
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td colspan="2">
                <p class="w-full font-bold">Висновок до запиту :</p>
                <p class="text-primary font-medium">
                  {{ record?.conclusion || '-' }}
                </p>
              </td>
            </tr>
            <tr class="border border-surface-200 dark:border-surface-600">
              <td class="font-bold" width="50%">Коментар :</td>
              <td>{{ record?.comment || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="w-full py-4">
          <IPAddressPartial :record="recordip" v-if="recordip" />
        </div>

        <div class="w-full py-4">
          <SysInspectorPartial :record="recordsysi" v-if="recordsysi" />
        </div>
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
