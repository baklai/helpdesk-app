<script setup>
import { ref, inject, defineAsyncComponent } from 'vue';

const DataTable = defineAsyncComponent(() => import('primevue/datatable'));

import { useScope } from '@/stores/scopes';

defineProps(['visible']);
defineEmits(['update:visible']);

const $helpdesk = inject('helpdesk');

const { getCustomScope } = useScope();

const columns = ref([
  { field: 'create', header: 'Create' },
  { field: 'read', header: 'Read' },
  { field: 'update', header: 'Update' },
  { field: 'delete', header: 'Delete' },
  { field: 'notice', header: 'Notice' }
]);

const scopes = ref(getCustomScope($helpdesk.profile.scope));
</script>

<template>
  <Dialog
    modal
    closable
    position="top"
    dismissableMask
    :draggable="false"
    :visible="visible"
    class="w-4/5 md:max-w-3xl"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="flex items-center">
        <div class="flex items-center">
          <Avatar icon="pi pi-user" class="mr-4" size="large" />
          <div>
            <p class="m-0 font-bold">
              {{ $helpdesk?.profile?.fullname }}
            </p>
            <p class="line-height-3 m-0 text-surface-500">
              {{ $helpdesk?.profile?.email }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="flex items-center">
      <div class="flex flex-wrap">
        <div class="w-full flex-shrink-0 p-4 text-center md:w-2/5">
          <Avatar
            image="/img/user-logo.png"
            shape="circle"
            class="h-16 w-16"
            v-if="$helpdesk?.profile?.logo"
          />
          <div class="flex flex-col items-center justify-center p-3" v-else>
            <i class="pi pi-cloud-upload p-3 text-3xl text-surface-500" />
            <p class="mb-0 mt-6 text-sm text-surface-500">
              Щоб завантажити, перетягніть логотип сюди
            </p>
          </div>
        </div>

        <div class="w-full space-y-2 p-4 md:w-3/5">
          <div class="mb-0">
            <p class="text-lg font-bold">
              Повне ім'я :
              <span class="">{{ $helpdesk?.profile?.fullname }}</span>
            </p>
          </div>
          <div class="mb-0">
            <p class="text-lg font-bold">
              Електронна пошта :
              <span class="">{{ $helpdesk?.profile?.email }}</span>
            </p>
          </div>
          <div class="mb-0">
            <p class="text-lg font-bold">
              Телефон :
              <span class="">{{ $helpdesk?.profile?.phone }}</span>
            </p>
          </div>
        </div>

        <div class="flex max-h-[25rem] w-full">
          <DataTable
            rowHover
            scrollable
            scrollHeight="flex"
            responsiveLayout="scroll"
            v-model:value="scopes"
            class="w-full overflow-x-auto"
          >
            <template #empty>
              <div class="text-center">
                <h5>No scopes found</h5>
              </div>
            </template>

            <Column frozen field="scope" header="Дозволи" class="font-bold">
              <template #body="slotProps">
                {{ slotProps.data.comment }}
              </template>
            </Column>

            <Column
              v-for="col of columns"
              :key="col.field"
              :field="col.field"
              :header="col.header"
              headerClass="text-center"
              class="text-center"
            >
              <template #body="{ data, field }">
                <i
                  v-if="data[field] !== undefined"
                  class="pi"
                  :class="
                    data[field]
                      ? 'pi-check-circle text-green-500'
                      : 'pi-minus-circle text-surface-500'
                  "
                />
                <span v-else class="text-surface-500">-</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </Dialog>
</template>
