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
    class="h-full surface-card sticky shadow-none overflow-y-auto border-left-1 border-noround surface-border px-2 w-1/3"
  >
    <template #title>
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="helpdesk-live-log" :size="40" class="mr-2" />
          <div>
            <p class="text-lg mb-0">{{ $t('Current request') }}</p>
            <p class="text-base font-normal">
              {{ $t('Status') }} :
              {{ record?.closed ? $t('Request closed') : $t('Request opened') }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="w-2rem h-2rem hover:text-color mx-2"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Menu')"
            @click="toggleMenu($event, record)"
          />
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="w-2rem h-2rem hover:text-color mx-2"
            icon="pi pi-times"
            v-tooltip.bottom="$t('Close')"
            @click="onCloseSidebar"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="overflow-y-auto pt-6" style="height: calc(100vh - 20rem)">
        <h5>{{ $t('Description') }}</h5>
        <table>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Opened an request') }} :</td>
            <td>
              {{ record?.workerOpen ? record?.workerOpen?.fullname : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Date opened') }} :</td>
            <td>
              {{ record?.createdAt ? dateTimeToStr(record?.createdAt) : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Status') }} :</td>
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
          <tr>
            <td colspan="2">
              <p class="font-weight-bold w-full">{{ $t('Request') }} :</p>
              <p class="font-medium text-primary">
                {{ record?.request ? record?.request : '-' }}
              </p>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Location') }} :</td>
            <td>
              {{ record?.location ? record?.location?.title : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Fullname') }} :</td>
            <td>{{ record?.fullname || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Phone') }} :</td>
            <td>{{ record?.phone || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Position') }} :</td>
            <td>
              {{ record?.position ? record?.position?.title : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('IP Address') }} :</td>
            <td>
              {{ record?.ipaddress ? record?.ipaddress : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Letter number') }} :</td>
            <td>{{ record?.mail || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Company') }} :</td>
            <td>
              {{ record?.company ? record?.company?.title : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Branch') }} :</td>
            <td>
              {{ record?.branch ? record?.branch?.title : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Enterprise') }} :</td>
            <td>
              {{ record?.enterprise ? record?.enterprise?.title : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Department') }} :</td>
            <td>
              {{ record?.department ? record?.department?.title : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Date closed') }} :</td>
            <td>
              {{ record?.closed ? dateTimeToStr(record?.updatedAt) : '-' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Closed an request') }} :</td>
            <td>
              {{ record?.workerClose ? record?.workerClose?.fullname : '-' }}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="font-weight-bold w-full">{{ $t('Conclusion for request') }} :</p>
              <p class="font-medium text-primary">
                {{ record?.conclusion || '-' }}
              </p>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Comment') }} :</td>
            <td>{{ record?.comment || '-' }}</td>
          </tr>
        </table>

        <IPAddressPartial :record="recordip" v-if="recordip" />
        <SysInspectorPartial :record="recordsysi" v-if="recordsysi" />
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
  border-bottom: 1px solid var(--surface-border);
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
