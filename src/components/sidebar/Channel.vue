<script setup>
import { ref } from 'vue';

import { useChannel } from '@/stores/api/channels';

const { $init, findOne } = useChannel();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await findOne({ id });
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
  record.value = $init({});
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
          <AppIcons name="network-channels" :size="40" class="mr-2" />
          <div>
            <p class="text-lg mb-0">{{ $t('Network channel') }}</p>
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
            class="w-2rem h-2rem mx-2"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Menu')"
            @click="toggleMenu($event, record)"
          />
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="w-2rem h-2rem mx-2"
            icon="pi pi-times"
            v-tooltip.bottom="$t('Close')"
            @click="onCloseSidebar"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="overflow-y-auto" style="height: calc(100vh - 20rem)">
        <h5>{{ $t('Start point') }}</h5>
        <table>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Location start') }} :</td>
            <td>{{ record?.locationFrom || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Unit start') }} :</td>
            <td>{{ record?.unitFrom || '-' }}</td>
          </tr>
        </table>

        <h5>{{ $t('End point') }}</h5>
        <table>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Location end') }} :</td>
            <td>{{ record?.locationTo || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Unit end') }} :</td>
            <td>{{ record?.unitTo || '-' }}</td>
          </tr>
        </table>

        <h5>{{ $t('Channel info') }}</h5>
        <table>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Level') }} :</td>
            <td>{{ record?.level || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Type') }} :</td>
            <td>{{ record?.type || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Speed') }} :</td>
            <td>{{ record?.speed || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Status') }} :</td>
            <td>{{ record?.status || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Operator') }} :</td>
            <td>{{ record?.operator || '-' }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold" width="50%">{{ $t('Composition') }} :</td>
            <td>{{ record?.composition || '-' }}</td>
          </tr>
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
  /* border-bottom: 1px solid var(--surface-border); */
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
