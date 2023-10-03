<script setup>
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import { useScope } from '@/stores/scope';

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
    :draggable="false"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
    :style="{ maxWidth: '500px' }"
  >
    <template #header>
      <div class="flex align-items-center">
        <div class="flex align-items-center">
          <Avatar icon="pi pi-user text-4xl" class="text-4xl mr-3" size="large" />
          <div>
            <p class="font-bold m-0">
              {{ $helpdesk?.user?.fullname }}
            </p>
            <p class="line-height-3 text-color-secondary m-0">
              {{ $helpdesk?.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div class="flex my-4 align-items-center">
      <div class="formgrid grid">
        <div class="field col-12 xl:col-6 text-center">
          <Avatar
            image="/img/user-logo.png"
            shape="circle"
            class="w-4rem h-4rem"
            v-if="$helpdesk?.user?.logo"
          />
          <div class="flex align-items-center justify-content-center p-3 flex-column" v-else>
            <i
              class="pi pi-cloud-upload border-2 border-circle p-3 text-3xl text-color-secondary"
            />
            <p class="text-sm mt-4 mb-0 text-color-secondary">
              {{ $t('Drag and drop logo to here to upload') }}
            </p>
          </div>
        </div>

        <div class="field col-12 xl:col-6">
          <div class="field mb-0">
            <label class="font-bold text-primary text-lg">
              {{ $t('Login') }} :
              <span class="text-color">{{ $helpdesk?.user?.login }}</span>
            </label>
          </div>
          <div class="field mb-0">
            <label class="font-bold text-primary text-lg">
              {{ $t('Full name') }} :
              <span class="text-color">{{ $helpdesk?.user?.fullname }}</span>
            </label>
          </div>
          <div class="field mb-0">
            <label class="font-bold text-primary text-lg">
              {{ $t('E-Mail') }} :
              <span class="text-color">{{ $helpdesk?.user?.email }}</span>
            </label>
          </div>
          <div class="field mb-0">
            <label class="font-bold text-primary text-lg">
              {{ $t('Phone') }} :
              <span class="text-color">{{ $helpdesk?.user?.phone }}</span>
            </label>
          </div>
          <div class="field mb-0">
            <label class="font-bold text-primary text-lg">
              {{ $t('Is Admin') }} :
              <span class="text-color">{{ $helpdesk?.user?.isAdmin }}</span>
            </label>
          </div>
        </div>

        <div class="field col">
          <div class="field">
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
                        : 'pi-minus-circle text-color-secondary'
                    "
                  />
                  <span v-else class="text-color-secondary">-</span>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
::v-deep(.p-datatable-header) {
  background: var(--surface-overlay);
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--surface-overlay);
}

::v-deep(.p-datatable .p-datatable-tbody > tr) {
  background: var(--surface-overlay);
}

::v-deep(tr.p-datatable-emptymessage > td) {
  border: none;
}

::v-deep(tr.p-datatable-emptymessage:hover) {
  background: none !important;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):hover) {
  background: var(--surface-ground);
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):focus) {
  background-color: var(--surface-ground);
}

::v-deep(.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td) {
  padding: 0.3rem 0.3rem;
}

::v-deep(.p-datatable .p-column-header-content) {
  display: block;
}
</style>
