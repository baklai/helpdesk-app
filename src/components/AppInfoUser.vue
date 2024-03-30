<script setup>
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';

const DataTable = defineAsyncComponent(() => import('primevue/datatable'));

import { useScope } from '@/stores/scopes';

defineProps(['visible']);
defineEmits(['update:visible']);

const { t } = useI18n();

const $helpdesk = inject('helpdesk');

const { getCustomScope } = useScope();

const columns = ref([
  { field: 'create', header: t('Create') },
  { field: 'read', header: t('Read') },
  { field: 'update', header: t('Update') },
  { field: 'delete', header: t('Delete') }
]);

const scopes = ref(getCustomScope($helpdesk.user.scope));
</script>

<template>
  <Dialog
    modal
    closable
    position="top"
    dismissableMask
    :draggable="false"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
    :style="{ maxWidth: '500px' }"
  >
    <template #header>
      <div class="flex items-center">
        <div class="flex items-center">
          <Avatar icon="pi pi-user" class="mr-4" size="large" />
          <div>
            <p class="font-bold m-0">
              {{ $helpdesk?.user?.fullname }}
            </p>
            <p class="line-height-3 text-surface-500 m-0">
              {{ $helpdesk?.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="flex items-center">
      <div class="flex flex-wrap">
        <div class="flex-shrink-0 p-4 w-full xl:w-2/4 text-center">
          <Avatar
            image="/img/user-logo.png"
            shape="circle"
            class="w-16 h-16"
            v-if="$helpdesk?.user?.logo"
          />
          <div class="flex items-center justify-center p-3 flex-col" v-else>
            <i class="pi pi-cloud-upload p-3 text-3xl text-surface-500" />
            <p class="text-sm mt-6 mb-0 text-surface-500">
              {{ $t('Drag and drop logo to here to upload') }}
            </p>
          </div>
        </div>

        <div class="flex-shrink-0 p-4 w-full xl:w-2/4">
          <div class="mb-0">
            <p class="font-bold text-lg">
              {{ $t('Login') }} :
              <span class="">{{ $helpdesk?.user?.login }}</span>
            </p>
          </div>
          <div class="mb-0">
            <p class="font-bold text-lg">
              {{ $t('Fullname') }} :
              <span class="">{{ $helpdesk?.user?.fullname }}</span>
            </p>
          </div>
          <div class="mb-0">
            <p class="font-bold text-lg">
              {{ $t('E-Mail') }} :
              <span class="">{{ $helpdesk?.user?.email }}</span>
            </p>
          </div>
          <div class="mb-0">
            <p class="font-bold text-lg">
              {{ $t('Phone') }} :
              <span class="">{{ $helpdesk?.user?.phone }}</span>
            </p>
          </div>
          <div class="mb-0">
            <p class="font-bold text-lg">
              {{ $t('Is Admin') }} :
              <span class="">{{ $helpdesk?.user?.isAdmin }}</span>
            </p>
          </div>
        </div>

        <div class="col">
          <div class="">
            <DataTable
              rowHover
              scrollable
              scrollHeight="flex"
              responsiveLayout="scroll"
              v-model:value="scopes"
              class="min-w-full overflow-x-auto h-20rem"
            >
              <template #empty>
                <div class="text-center">
                  <h5>{{ $t('No scopes found') }}</h5>
                </div>
              </template>

              <Column frozen field="scope" :header="$t('Scope')" class="font-bold">
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
    </div>
  </Dialog>
</template>
